import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import bcrypt from 'bcrypt';
import app from "@/lib/firebase/init";

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

export async function getDataByField(collectionName: string, field: string, value: string) {
  const q = query(collection(firestore, collectionName), where(field, '==', value));
  const snapshotData = await getDocs(q);

  const data = snapshotData.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))

  return data
}

export async function addData(collectionName: string, data: any, callBack: Function) {
  await addDoc(collection(firestore, collectionName), data).then(() => {
    callBack(true)
  }).catch((error) => {
    callBack(false)
  })
}

export async function SignUp(userData: {
  fullName: string,
  email: string,
  password: string
  role?: string
  phoneNumber: number,
  createdAt?: Date,
  updatedAt?: Date,
}, callBack: Function) {
  const data = await getDataByField("users", "email", userData.email)
  
  if (data.length > 0) {
    callBack(false)
  } else {
    if (!userData.role) {
      userData.role = "member"
    }
    userData.createdAt = new Date();
    userData.updatedAt = new Date();

    userData.password = await bcrypt.hash(userData.password, 10);
    await addData("users", userData, (result: boolean) => {
      callBack(result)
    })
  }
}

export async function LoginUsers(email: string) {
  const q = await getDataByField("users", "email", email)
  if (q) {
    return {
      status: true,
      user: q[0]
    }
  } else {
    return {
      status: false,
      message: "User not found"
    }
  }
}


export async function LoginGoogle(data: {
  fullame: string,
  email: string,
  idp: string,
  role?: string
}, callBack: Function) {
  const users = await getDataByField("users", "email", data.email)
  if (users.length > 0) {
    return callBack(users[0])
  } else {
    data.role = "member";
    await addData("users", data, (result: boolean) => {
      if(result) {
        callBack(data)
      }
    })
  }
}