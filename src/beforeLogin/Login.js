import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import formStyle from "./form.module.css";
import validator from "validator";

const Login = () => {
  const defaultForm = {
    email: "",
    password: "",
  };
  const [form, setForm] = useState(defaultForm);
  const [valid, setValid] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    if (validator.isEmail(form.email) && form.password.length > 5) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [form]);
  const loginUser = async () => {
    setMessage("Logging in . . .");
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, form.email, form.password)
      .then(() => {
        setMessage("Logged In Successfully");
      })
      .catch((error) => {
        setErrorMsg(error.message);
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
        <h2>Log In</h2>
        <h3>Welcome to pollsXtreme</h3>
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
        <button disabled={!valid} onClick={loginUser}>
          Login
        </button>
        <p className={formStyle.successMsg}>{message}</p>
        <p className={formStyle.errorMsg}>{errorMsg}</p>
        <Link to="/signup">Create a new account? / Register</Link>
      </div>
    </>
  );
};

export default Login;
