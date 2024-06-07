import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCQdbfk2rkMiaN15ua2Qv833yL_NA285eU",
  authDomain: "signcom-577bc.firebaseapp.com",
  projectId: "signcom-577bc",
  storageBucket: "signcom-577bc.appspot.com",
  messagingSenderId: "678618577834",
  appId: "1:678618577834:web:776484824ffc4cd2c609d3",
  measurementId: "G-FM2MP9PP2B"
  // apiKey: "AIzaSyCQdbfk2rkMiaN15ua2Qv833yL_NA285eU",
  // authDomain: "signcom-577bc.firebaseapp.com",
  // projectId: "signcom-577bc",
  // storageBucket: "signcom-577bc",
  // messagingSenderId: "678618577834",
  // appId: "1:678618577834:web:48fa332b55c9dc55c609d3",
  // measurementId: "G-10H4340NJF",
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_ST = getStorage(FIREBASE_APP);

export const  USES_REF = collection(FIREBASE_DB, 'users');

