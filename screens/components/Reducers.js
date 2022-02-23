import {
    doc, getDocs, db, collection,
    setDoc, auth, Timestamp,
    query, orderBy, deleteDoc, updateDoc, increment
} from "../../firebase/firebasehandler"


export const setLike = async (postId, uid) => {
    const setLikeColl = doc(db, "posts", postId, "likes", uid)
    const postRef = doc(db, "posts", postId)
    await updateDoc(postRef, {
        likes: increment(1)
    })

    await setDoc(setLikeColl, {
        likedAt: Timestamp.fromDate(new Date()),
        like: true
    })
}
export const removeLike = async (postId, uid) => {
    const likeColl = doc(db, "posts", postId, "likes", uid)

    const postRef = doc(db, "posts", postId)
    await updateDoc(postRef, {
        likes: increment(-1)
    })
    await deleteDoc(likeColl)
}