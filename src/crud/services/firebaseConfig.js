import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_firebaseConfig_apiKey,
    authDomain: process.env.REACT_APP_firebaseConfig_authDomain,
    projectId: process.env.REACT_APP_firebaseConfig_projectId,
    storageBucket: process.env.REACT_APP_firebaseConfig_storageBucket,
    messagingSenderId: process.env.REACT_APP_firebaseConfig_messagingSenderId,
    appId: process.env.REACT_APP_firebaseConfig_appId
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

