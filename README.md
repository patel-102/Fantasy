# Firebase Web App (Auth + Firestore)

This project is a simple Firebase web app with:
- Email/password Authentication
- Firestore-based user profiles
- Launcher screen (connection check)
- Login, Register, Dashboard pages
- Deployable to GitHub Pages

## Setup
1. Enable **Email/Password** under Firebase Console → Authentication → Sign-in method.
2. Create **Firestore** (start in test mode for development).
3. Update `firebaseConfig` in `firebase.js` if using another project.
4. Deploy to GitHub Pages (push repository and enable Pages in settings).

## Firestore security rules (recommended)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```
