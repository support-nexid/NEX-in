import { adminDb } from './firebase-admin';
import { LandingConfig, defaultLandingConfig } from './default-landing';

export async function getLandingConfig(): Promise<LandingConfig> {
  if (!adminDb) return defaultLandingConfig;
  
  try {
    const doc = await adminDb.collection('system_config').doc('landing_page').get();
    if (!doc.exists) {
      return defaultLandingConfig;
    }
    return doc.data() as LandingConfig;
  } catch (error) {
    console.error('Error fetching landing config:', error);
    return defaultLandingConfig;
  }
}

export async function updateLandingConfig(config: Partial<LandingConfig>) {
  if (!adminDb) throw new Error('Admin DB not initialized');
  await adminDb.collection('system_config').doc('landing_page').set(config, { merge: true });
}
