import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyBjwqEWBUTlsu4mLz1QMgM_ipiRL4L31SA",
  authDomain: "crwn-db-christian.firebaseapp.com",
  databaseURL: "https://crwn-db-christian.firebaseio.com",
  projectId: "crwn-db-christian",
  storageBucket: "crwn-db-christian.appspot.com",
  messagingSenderId: "974287414375",
  appId: "1:974287414375:web:21944811c22d8671e460c2",
  measurementId: "G-LCXWNJ13GZ"
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData
      });
    } catch (error) {
      console.log("error creating user", error.message);
    }
  }

  return userRef;
};
export default firebase;
