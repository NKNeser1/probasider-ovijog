import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

function getServiceAccount() {
  // Vercel / production: use environment variable
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  }

  // Local development: use firebase-service-account.json
  const serviceAccountPath = path.join(
    process.cwd(),
    "firebase-service-account.json"
  );

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      "Firebase Admin credentials not found. Set FIREBASE_SERVICE_ACCOUNT or add firebase-service-account.json."
    );
  }

  return JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
}

const serviceAccount = getServiceAccount();

const adminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount),
      });

export const adminDb = getFirestore(adminApp);

export default adminApp;