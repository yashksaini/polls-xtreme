import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import UserContextProvider from "./UserContext";
import { initializeApp } from "firebase/app";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));

const firebaseConfig = {
  apiKey: "AIzaSyDb5CW6jvn54VmBWtevubKqWB_iDmchA0A",
  authDomain: "pollsxtreme.firebaseapp.com",
  projectId: "pollsxtreme",
  storageBucket: "pollsxtreme.appspot.com",
  messagingSenderId: "942866945278",
  appId: "1:942866945278:web:dc6690cbc2d12c2c9881af",
  measurementId: "G-N9Q5K5GS0N",
};
// Initialize Firebase
initializeApp(firebaseConfig);

root.render(
  <UserContextProvider>
    <App />
  </UserContextProvider>
);

serviceWorkerRegistration.register();
