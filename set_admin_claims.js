/**
 * Node script to set admin custom claim for a user by email.
 * Usage:
 * 1) npm install firebase-admin
 * 2) Place your Firebase service account JSON at ./serviceAccountKey.json
 * 3) node set_admin_claims.js user@example.com true
 *
 * The script will find the user by email and set custom claim {admin: true/false}.
 */
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const keyPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(keyPath)) {
  console.error('Missing serviceAccountKey.json in project root. Get it from Firebase Console -> Project Settings -> Service accounts.');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(keyPath))
});

const email = process.argv[2];
const setTo = process.argv[3] === 'true';

if (!email) {
  console.error('Usage: node set_admin_claims.js user@example.com true');
  process.exit(1);
}

(async () => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: setTo });
    console.log(`Success: set admin=${setTo} for ${email} (uid=${user.uid})`);
    // Optionally revoke tokens so the change propagates immediately:
    await admin.auth().revokeRefreshTokens(user.uid);
    console.log('Revoked user refresh tokens so claim change propagates.');
  } catch (err) {
    console.error('Error:', err.message);
  }
})();
