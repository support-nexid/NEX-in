import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// --- CONFIGURATION FOR DUAL DB ARCHITECTURE --- //

// Database 1: Primary (nexid-in)
const db1Config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Database 2: Failover / Replica (nexid-v2)
// This will silently fail until the user provides the V2 keys in .env.local
const db2Config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_V2_API_KEY || "missing",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_V2_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_V2_PROJECT_ID,
};

let app1: FirebaseApp | null = null;
let app2: FirebaseApp | null = null;
let db1: Firestore | null = null;
let db2: Firestore | null = null;
export let syncAuth: Auth | any = null;

try {
  app1 = !getApps().length ? initializeApp(db1Config) : getApp();
  db1 = getFirestore(app1);
  syncAuth = getAuth(app1);
} catch (e) {
  console.error("Critical: Failed to initialize DB1", e);
}

try {
  if (db2Config.apiKey !== "missing") {
    app2 = initializeApp(db2Config, 'secondary');
    db2 = getFirestore(app2);
  }
} catch (e) {
  console.warn("DB2 (V2) not initialized or missing credentials. Running in single-node mode.");
}

/**
 * Ensures data is safely written to BOTH databases to maintain Active-Active sync.
 * Does not block if V2 is down; strictly enforces V1 but attempts V2 backup.
 */
export async function syncSetDoc(collectionName: string, docId: string, data: any) {
  if (!db1) throw new Error("DB1 is offline");

  const p1 = setDoc(doc(db1, collectionName, docId), data);
  const promises = [p1];

  if (db2) {
    promises.push(setDoc(doc(db2, collectionName, docId), data));
  }

  // Promise.allSettled ensures it doesn't fail if just DB2 goes down.
  const results = await Promise.allSettled(promises);
  
  if (results[0].status === 'rejected') {
    throw new Error("Primary DB1 failed to write data.");
  }
  
  return true;
}

/**
 * Intelligent Read. Tries DB1. If DB1 hits a quota limit or fails, it auto-shifts to DB2.
 */
export async function syncGetDoc(collectionName: string, docId: string) {
  if (!db1) throw new Error("DB1 is offline");

  try {
    const docSnap = await getDoc(doc(db1, collectionName, docId));
    if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
    return null;
  } catch (error) {
    console.error("DB1 READ FAILURE! Auto-shifting to DB2...", error);
    if (!db2) throw new Error("DB2 is not configured. Total Database Failure.");
    
    // Auto shift to V2 Database
    const docSnap2 = await getDoc(doc(db2, collectionName, docId));
    if (docSnap2.exists()) return { id: docSnap2.id, ...docSnap2.data() };
    return null;
  }
}

/**
 * Intelligent Collection Fetch. Pulls array data with failover support.
 */
export async function syncGetDocs(collectionName: string) {
  if (!db1) throw new Error("DB1 is offline");

  try {
    const snap = await getDocs(collection(db1, collectionName));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("DB1 COLLECTION FETCH FAILURE! Auto-shifting to DB2...", error);
    if (!db2) throw new Error("DB2 is not configured. Total Database Failure.");
    
    const snap2 = await getDocs(collection(db2, collectionName));
    return snap2.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}

/**
 * Real-time Subscription (WebSockets). Automatically falls back to DB2 if DB1 drops.
 */
import { onSnapshot, query, QueryConstraint } from 'firebase/firestore';

export function syncSubscribe(
  collectionName: string, 
  queryConstraints: QueryConstraint[], 
  callback: (docs: any[]) => void
) {
  if (!db1) {
    console.error("DB1 offline, Cannot bind listener");
    return () => {};
  }

  try {
    const q = query(collection(db1, collectionName), ...queryConstraints);
    const unsubscribe = onSnapshot(q, (snap) => {
      callback(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("DB1 WS Disconnected! Falling back to DB2 listener...", error);
      if (db2) {
        const q2 = query(collection(db2, collectionName), ...queryConstraints);
        onSnapshot(q2, (snap2) => {
          callback(snap2.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
      }
    });
    return unsubscribe;
  } catch (e) {
    if (db2) {
        const q2 = query(collection(db2, collectionName), ...queryConstraints);
        return onSnapshot(q2, (snap2) => {
          callback(snap2.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
    }
    return () => {};
  }
}
