import {
    doc, db,
    setDoc, getDoc,
    deleteDoc, updateDoc, increment,
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
    } catch (error) {
        console.log(error)
    }
}