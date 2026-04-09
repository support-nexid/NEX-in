import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    if (process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } else {
      // Fallback for build time
      admin.initializeApp({ projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project' });
    }
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

const adminDb = (() => { try { return admin.firestore(); } catch (e) { return null as any; } })();
const adminAuth = (() => { try { return admin.auth(); } catch (e) { return null as any; } })();
const adminStorage = (() => { try { return admin.storage(); } catch (e) { return null as any; } })();

export { adminDb, adminAuth, adminStorage };
