import React, { createContext, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getDocs,
  getFirestore,
  query,
  collection,
  where,
} from "firebase/firestore";
export const UserContext = createContext();
const UserContextProvider = (props) => {
  const auth = getAuth();
  const [userId, setUserId] = useState("");
  const [userType, setUserType] = useState(
    localStorage.getItem("userType") ?? ""
  );
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserId(user.uid);
      getUserType(user.uid);
    } else {
      setUserId("");
    }
  });
  let firestore = getFirestore();
  async function getUserType(userId) {
    let querySnapshot = await getDocs(
      query(collection(firestore, "profile"), where("id", "==", userId))
    );
    let array = [];
    querySnapshot.forEach((doc) => {
      array.push(doc.data());
    });
    if (array.length > 0) {
      setUserType(array[0].type);
      localStorage.setItem("userType", array[0].type);
    }
  }
  return (
    <UserContext.Provider value={{ userId, userType }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
