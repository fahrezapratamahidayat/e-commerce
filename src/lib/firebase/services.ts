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

export async function LoginUsers(data: { email: string; password: string }) {
    const q = query(
      collection(firestore, "users"),
      where("email", "==", data.email)
    );
  
    try {
      const querySnapshot = await getDocs(q);
  
      if (querySnapshot.empty) {
        return {
          status: false,
          statusCode: 404,
          message: "User not found",
        };
      }
  
      const user: any = querySnapshot.docs[0].data();
      const passwordMatch = await bcrypt.compare(data.password, user.password);
  
      if (passwordMatch) {
        return {
          status: true,
          statusCode: 200,
          message: "Login successful",
          user: {
            id: querySnapshot.docs[0].id,
            ...user,
          },
        };
      } else {
        return {
          status: false,
          statusCode: 401,
          message: "Invalid password",
        };
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return {
        status: false,
        statusCode: 500,
        message: "Internal server error",
      };
    }
  }