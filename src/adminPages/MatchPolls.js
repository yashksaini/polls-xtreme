import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
} from "firebase/firestore";

import style from "./admin.module.css";
import { generateQuestions } from "./questions";

// Get current date and time
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
const currentDay = currentDate.getDate().toString().padStart(2, "0");
const defaultStartTime = `${currentYear}-${currentMonth}-${currentDay}T19:00`;
const defaultEndTime = `${currentYear}-${currentMonth}-${currentDay}T20:00`;

const MatchPolls = ({ setMatchPoll }) => {
  const [valid, setValid] = useState(false);
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [matchNo, setMatchNo] = useState("");
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState(defaultEndTime);
  let firestore = getFirestore();
  const addPolls = async () => {
    setValid(false);

    const generatedPolls = generateQuestions(
      team1,
      team2,
      matchNo,
      startTime,
      endTime
    );

    for (const pollData of generatedPolls) {
      try {
        const docRef = await addDoc(collection(firestore, "polls"), pollData);
        await updateDoc(docRef, { id: docRef.id });
      } catch (error) {
        console.error("Error adding poll:", error);
      }
    }

    window.location.reload();
  };
  useEffect(() => {
    if (team1.length > 0 && team2.length > 0 && startTime && endTime) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [endTime, startTime, team1.length, team2.length]);

  return (
    <div className={style.modal}>
      <div className={style.modalBody}>
        <span
          className={`material-symbols-outlined ${style.modalClose}`}
          onClick={() => {
            setMatchPoll(false);
          }}
        >
          close
        </span>
        <div className={style.form}>
          <h2>Match Poll</h2>
          <label>Team 1 Name *</label>
          <input
            type="text"
            placeholder=""
            onChange={(e) => {
              setTeam1(e.target.value);
            }}
            value={team1}
          />
          <label>Team 2 Name *</label>
          <input
            type="text"
            placeholder=""
            onChange={(e) => {
              setTeam2(e.target.value);
            }}
            value={team2}
          />
          <label>Match Number *</label>
          <input
            type="number"
            placeholder=""
            onChange={(e) => {
              setMatchNo(e.target.value);
            }}
            value={matchNo}
          />
          <label>Start Time *</label>
          <input
            type="datetime-local"
            placeholder=""
            onChange={(e) => {
              setStartTime(e.target.value);
              console.log(e.target.value);
            }}
            value={startTime}
          />
          <label>End Time *</label>
          <input
            type="datetime-local"
            placeholder=""
            onChange={(e) => {
              setEndTime(e.target.value);
              console.log(e.target.value);
            }}
            value={endTime}
          />
          <button disabled={!valid} onClick={addPolls}>
            Create Polls
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchPolls;
