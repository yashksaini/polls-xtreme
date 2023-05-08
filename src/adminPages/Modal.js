import React from "react";
import {
  getDocs,
  getFirestore,
  query,
  collection,
  doc,
  where,
  updateDoc,
  increment,
} from "firebase/firestore";

import style from "./admin.module.css";
const Modal = ({ modal, setModal, setUpdate, update, getPollsData }) => {
  let firestore = getFirestore();
  const updatePoll = async () => {
    const pollRef = doc(firestore, "polls", update?.id);
    await updateDoc(pollRef, update);
    setModal(false);
    getPollsData();
    if (update.answer.length > 0) {
      let querySnapshot = await getDocs(
        query(
          collection(firestore, "pollsData"),
          where("pollId", "==", update.id),
          where("answer", "==", update.answer)
        )
      );
      querySnapshot.forEach(async (docData) => {
        // Update points for the corrected answers
        const pollUserData = docData.data();
        const docRef = doc(firestore, "pollsData", pollUserData.id);
        await updateDoc(docRef, {
          points: 100,
        });
        const profileRef = doc(firestore, "profile", pollUserData.userId);
        await updateDoc(profileRef, {
          points: increment(100),
          pollCount: increment(1),
        });
      });
    }
  };
  return (
    <div className={modal ? style.modal : style.hide}>
      <div className={style.modalBody}>
        <span
          className={`material-symbols-outlined ${style.modalClose}`}
          onClick={() => {
            setModal(false);
            setUpdate({});
          }}
        >
          close
        </span>
        <div className={style.form}>
          <h2>Update Poll</h2>
          <label>Question Title *</label>
          <input
            type="text"
            placeholder=""
            value={update?.title}
            onChange={(e) => {
              setUpdate({ ...update, title: e.target.value });
            }}
          />
          <label>Answer</label>
          <select
            onChange={(e) => {
              setUpdate({ ...update, answer: e.target.value });
            }}
            value={update?.answer}
          >
            <option value="">No Answer</option>
            {update?.options?.map((option, index) => {
              return (
                <option value={option} key={index}>
                  {option}
                </option>
              );
            })}
          </select>
          <label>Status *</label>
          <select
            value={update?.status}
            onChange={(e) => {
              setUpdate({ ...update, status: e.target.value });
            }}
          >
            <option value="live">Live</option>
            <option value="upcoming">Upcoming</option>
            <option value="closed">Closed</option>
          </select>
          <button onClick={updatePoll}>Update Poll</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
