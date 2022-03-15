import AsyncStorage from '@react-native-async-storage/async-storage'
import { Alert } from "react-native"

import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid'

import {
    doc, db,
    setDoc, getDoc,
    deleteDoc, updateDoc, increment,
    storage, uploadBytesResumable,
    getDownloadURL,
    ref, auth,
    Timestamp,
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

export const deletePost = async (postId) => {
    try {
        await deleteDoc(doc(db, "posts", postId))
        Alert.alert("Sucesso", "Publicação apagada com sucesso!")
    } catch (error) {
        console.log(error)
    }
}

export const getName = async () => {
    try {
        return await AsyncStorage.getItem("name")
    } catch (e) {
        console.log(e)
    }
}

export const createPost = async (url, filename, carro, description) => {
    let name
    getName().then((nome) => name = nome)

    const postId = uuidv4()
    try {
        await setDoc(doc(db, "posts", postId), {
            postedAt: Timestamp.fromDate(new Date()),
            name: name,
            uid: auth.currentUser.uid,
            desc: description,
            car: carro,
            comments: 0,
            likes: 0,
            downloadUrl: url,
            fileName: filename
        })
    } catch (error) {
        console.log(error)
    }
}


export const uploadImage = async (imageUri, carro, desc) => {
    try {

        let filename = imageUri.substring(imageUri.lastIndexOf("/") + 1)

        const extention = filename.split(".").pop()
        const name = filename.split(".").slice(0, -1).join(".")
        filename = name + Date.now() + "." + extention


        let imgUri = await fetch(image)
        const blob = await imgUri.blob()
        const postFolderRef = uuidv4()

        const metadata = {
            contentType: 'image/jpeg'
        }

        const storageRef = ref(storage, `posts/${auth.currentUser.uid}/${postFolderRef}/${filename}`)
        const uploadTask = uploadBytesResumable(storageRef, blob, metadata)
        uploadTask.on("state_changed",
            (snapshot) => {
                setUploadProgress(snapshot.bytesTransferred / snapshot.totalBytes * 100)
            },
            (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                        console.log("storage/unauthorized")
                        break;
                    case 'storage/canceled':
                        console.log("storage/canceled")
                        break;
                    case 'storage/unknown':
                        console.log("storage/unknown")
                        break;
                }
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    createPost(downloadUrl, filename, carro, desc).then(() => {
                        setImage(null)
                        setImagePicked(false)
                        setUploadProgress(0)
                        setCarro("")
                        setDesc("")
                        blob.close()
                        imgUri = null
                        Alert.alert("Sucesso", "Publicado com sucesso!")
                        navigation.goBack()
                    }).catch(alert)
                })
            })

    } catch (error) {
        console.log(error)
    }
}

