import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import formStyle from "./form.module.css";
import validator from "validator";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getFirestore, serverTimestamp } from "firebase/firestore";

const Signup = () => {
  const defaultForm = {
    name: "",
    email: "",
    password: "",
  };
  const [form, setForm] = useState(defaultForm);
  const [valid, setValid] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    if (
      form.name.length > 3 &&
      validator.isEmail(form.email) &&
      form.password.length > 5
    ) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [form]);

  const signIn = () => {
    let auth = getAuth();
    setMessage("Signing up ...");
    createUserWithEmailAndPassword(auth, form.email, form.password)
      .then(() => {
        const user = auth.currentUser;
        const firestore = getFirestore();
        const profileData = {
          id: user.uid,
          name: form.name,
          email: form.email,
          imageUrl: "",
          about: "",
          pollCount: 0,
          points: 0,
          type: "user",
          dateJoined: serverTimestamp(),
        };
        // Adding data to firestore
        setDoc(doc(firestore, "profile", user.uid), profileData).then(() => {
          // Set Display name for the user
          let currentUser = auth.currentUser;
          updateProfile(currentUser, {
            displayName: form.name,
          });
          setMessage("Account created successfully. Login and continue.");
          signOut(auth).then(() => {
            setForm(defaultForm);
            setValid(false);
          });
        });
      })
      .catch((err) => {
        setMessage("");
        setErrorMsg(err.message);
      });
  };
  return (
    <>
      <h1 className={formStyle.heading}>
        <span>Polls</span>
        <span>X</span>
        <span>treme</span>
      </h1>
      <p className={formStyle.subHeading}>Make your mark on the game</p>
      <div className={formStyle.form}>
        <h2>Sign Up</h2>
        <h3>Create account for free</h3>
        <input
          type="text"
          placeholder="full name"
          value={form.name}
          onChange={(e) => {
            setForm({ ...form, name: e.target.value });
          }}
        />
        <input
          type="email"
          placeholder="email"
          value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
          }}
        />
        <input
          type="password"
          placeholder="password"
          value={form.password}
          onChange={(e) => {
            setForm({ ...form, password: e.target.value });
          }}
        />
        <button disabled={!valid} onClick={signIn}>
          Sign Up
        </button>
        <p className={formStyle.successMsg}>{message}</p>
        <p className={formStyle.errorMsg}>{errorMsg}</p>
        <Link to="/">Already have account? / Login</Link>
      </div>
    </>
  );
};

export default Signup;
