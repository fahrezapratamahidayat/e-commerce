import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import app from "./init";
import bcrypt from 'bcrypt';

const firestore = getFirestore(app);

export async function getData(collectionName: string) {
    const snapshotData = await getDocs(collection(firestore, collectionName));
    const resultsData = snapshotData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return resultsData
}

export async function getDataByid(collectionName: string, id: string) {
    const snapshotData = await getDoc(doc(firestore, collectionName, id));
    const resultsData = snapshotData.data();
    return resultsData
}

export async function SignUp(userData: {
    fullName: string,
    email: string,
    password: string
    role?: string
    phoneNumber: string
    createdAt: Date
}, callBack: Function) {
    const q = query(collection(firestore, 'users'), where('email', '==', userData.email));
    const snapshotData = await getDocs(q);

    const data = snapshotData.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))

    if (data.length > 0) {
        callBack(false)
    } else {
        if (!userData.role) {
            userData.role = "member"
        }
        userData.password = await bcrypt.hash(userData.password, 10);
        const docRef = await addDoc(collection(firestore, 'users'), userData).then(() => {
            callBack(true)
        }).catch((error) => {
            callBack(false)
        })
    }
}