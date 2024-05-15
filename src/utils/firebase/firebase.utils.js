import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
} from "firebase/firestore";

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

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export const auth = getAuth(firebaseApp);
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);
export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export const db = getFirestore(firebaseApp);

export const addCollectionAndDocuments = async (
  collectionKey,
  objectsToAdd
) => {
  const collectionRef = collection(db, collectionKey);
  const batch = writeBatch(db);

  objectsToAdd.forEach((obj) => {
    const newDocRef = doc(collectionRef);
    batch.set(newDocRef, obj);
  });

  return await batch.commit();
};

export const getCategoriesAndDocuments = async () => {
  const collectionRef = collection(db, "categories");
  const q = query(collectionRef);

  const querySnapshot = await getDocs(q);
  const categories = querySnapshot.docs.reduce((acc, doc) => {
    const { title, items } = doc.data();
    acc[title.toLowerCase()] = items;
    return acc;
  }, []);
  return categories;
};

export const createUserDocumentFromAuth = async (
  authUser,
  additionalInformation = {}
) => {
  if (!authUser) return;

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
        ...additionalInformation,
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      alert("Email already in use");
    }
  }
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error.code === "auth/wrong-password") {
      alert("Incorrect password. Please try again.");
    } else if (error.code === "auth/user-not-found") {
      alert("User not found. Please sign up.");
    } else if (error.code === "auth/invalid-credential") {
      alert("Invalid credentials. Please try again.");
    } else {
      console.error("Error signing in", error);
    }
  }
};

export const signOutAuthUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};

export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};
