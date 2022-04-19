import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from "react-native"


import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import {
    doc, db,
    setDoc, getDoc,
    deleteDoc, updateDoc, increment,
    storage, ref, auth, deleteObject
} from "../../firebase/firebasehandler"


export const getLikeById = async (postId, uid) => {
    try {
        const likeDoc = doc(db, "posts", postId, "likes", uid)
        const likeSnap = await getDoc(likeDoc)
        let haslike = true
        if (!likeSnap.exists()) {
            haslike = false
        }
        return haslike
    } catch (e) {
        console.log(e)
    }
}

export const updateLike = async (postId, uid, state) => {
    try {
        if (state) {
            const likeDoc = doc(db, "posts", postId, "likes", uid)
            const postRef = doc(db, "posts", postId)
            await updateDoc(postRef, { likes: increment(-1) })
            await deleteDoc(likeDoc)
        } else {
            const setLikeDoc = doc(db, "posts", postId, "likes", uid)
            const postRef = doc(db, "posts", postId)
            await updateDoc(postRef, { likes: increment(1) })
            await setDoc(setLikeDoc, {})
        }
    } catch (e) {
        console.log(e)
    }
}

export const deletePost = async (postId, fileName) => {
    try {
        await deleteDoc(doc(db, "posts", postId))
        await deleteObject(ref(storage, `posts/${auth.currentUser.uid}/${postId}/${fileName}`))
        Alert.alert("Sucesso", "Publicação apagada com sucesso!")
    } catch (error) {
        console.log(error)
        Alert.alert("Erro", "Aconteceu um erro inesperado, tenta novamente mais tarde.")
    }
}

export const deleteComment = async (commedId, postid) => {
    try {
        await deleteDoc(doc(db, "posts", postid, "comments", commedId))
        await updateDoc(doc(db, "posts", postid), { comments: increment(-1) })
        Alert.alert("Sucesso", "Comentário apagada com sucesso!")
    } catch (error) {
        console.log(error)
        Alert.alert("Erro", "Aconteceu um erro inesperado, tenta novamente mais tarde.")
    }
}



