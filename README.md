Admin + User Auth Project with Custom Claims (Firebase)
------------------------------------------------------
What I added:
- A polished UI (dark theme) with animated login/register slide.
- Client checks for Firebase custom claim 'admin' in ID token using getIdTokenResult.
- A Node script (set_admin_claims.js) that uses firebase-admin SDK to set the admin claim.
  This script requires a service account JSON (download from Firebase Console).

Quick setup steps:
1) Enable Email/Password sign-in: Firebase Console -> Authentication -> Sign-in method -> Enable Email/Password.
2) (Optional) Create the admin user via Console -> Authentication -> Users -> Add user
   Email: prabhatverma673@gmail.com
   Password: your-chosen-password
3) To mark an existing user as admin (recommended, secure):
   - Go to Project Settings -> Service accounts -> Generate new private key, save as serviceAccountKey.json
   - Place serviceAccountKey.json in the same folder as set_admin_claims.js
   - Install Node deps: `npm install firebase-admin`
   - Run the script: `node set_admin_claims.js prabhatverma673@gmail.com true`
   - The script revokes refresh tokens so the user must re-login to pick up new claims.
4) If you don't want to use custom claims, the client still falls back to checking the admin email in the allowedAdmins array.

Files:
- firebase.js
- index.html (login/register UI)
- style.css (theme + animations)
- dashboard_admin.html (checks custom claim 'admin')
- dashboard_user.html (normal user dashboard)
- set_admin_claims.js (Node script to set admin claim)
- README.txt (this file)

Deploying to Firebase Hosting:
- Install firebase-tools (`npm install -g firebase-tools`) and login (`firebase login`).
- Initialize hosting and point to this folder (`firebase init hosting`).
- `firebase deploy --only hosting`

Security note:
- Do NOT rely solely on client-side checks for protecting sensitive actions/data.
- Use Firebase Security Rules (Firestore/Storage) and server-side verification for critical operations.
