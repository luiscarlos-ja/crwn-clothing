import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";

import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3cbNScyPPRsMNwS6DkFzveBZIRE9jz4k",
  authDomain: "crwn-app-c388f.firebaseapp.com",
  projectId: "crwn-app-c388f",
  storageBucket: "crwn-app-c388f.appspot.com",
  messagingSenderId: "1066368058324",
  appId: "1:1066368058324:web:1728a414a10e3e3148cc41",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });

export const auth = getAuth(firebaseApp);
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const db = getFirestore(firebaseApp);

export const createUserDocumentFromAuth = async (authUser) => {
  const userDocRef = doc(db, "users", authUser.uid);
  const userDocSnap = await getDoc(userDocRef);
  if (!userDocSnap.exists()) {
    const { displayName, email } = authUser;
    const createdAt = new Date();
    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }

  return userDocRef;
};
