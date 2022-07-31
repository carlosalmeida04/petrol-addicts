import { initializeApp } from 'firebase/app'

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut, updateEmail, updatePassword, sendPasswordResetEmail 
} from "firebase/auth"


import {
    doc,
    setDoc,
    getFirestore,
    getDoc,
    Timestamp,
    collection, getDocs,
    onSnapshot, orderBy,
    query, limit, where, deleteDoc, increment, updateDoc
} from "firebase/firestore"



import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL, deleteObject
} from "firebase/storage";


const firebaseConfig = {
    //put your firebase config here
};

const app = initializeApp(firebaseConfig)
const db = getFirestore()
const auth = getAuth()
const storage = getStorage()

export {
    auth, storage, db,
    signInWithEmailAndPassword, createUserWithEmailAndPassword,
    onAuthStateChanged, signOut, doc, setDoc,
    getDoc, ref, uploadBytesResumable,
    getDownloadURL,
    Timestamp, collection, getDocs, onSnapshot, query, orderBy,
    limit, where, deleteDoc, updateDoc, increment, deleteObject,
    updateEmail, updatePassword, sendPasswordResetEmail 
}