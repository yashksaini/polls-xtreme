import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import style from "./admin.module.css";

// Get current date and time
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = (currentDate.getMonth() + 1).toString().padStart(2, "0");
const currentDay = currentDate.getDate().toString().padStart(2, "0");
const defaultStartTime = `${currentYear}-${currentMonth}-${currentDay}T19:00`;
const defaultEndTime = `${currentYear}-${currentMonth}-${currentDay}T20:00`;

const AddModal = ({ addModal, setAddModal }) => {
  const [valid, setValid] = useState(false);
  const [optionCount, setOptionCount] = useState(2);
  const [options, setOptions] = useState(["", ""]);
  const [status, setStatus] = useState("live");
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState(defaultEndTime);
  let firestore = getFirestore();
  const addPoll = async () => {
    const docRef = await addDoc(collection(firestore, "polls"), {
      title: title,
      answer: "",
      createdOn: serverTimestamp(),
      options: options,
      status: status,
      startTime: startTime,
      endTime: endTime,
    });
    await updateDoc(docRef, {
      id: docRef.id,
    }).then(() => {
      window.location.reload();
    });
  };
  const optionsValid = () => {
    let count = 0;
    options.forEach((option) => {
      if (option.length === 0) {
        count++;
      }
    });
    if (count === 0) {
      return true;
    } else {
      return false;
    }
  };
  const checkValid = () => {
    if (title.length > 3 && optionsValid()) {
      setValid(true);
    } else {
      setValid(false);
    }
  };
  useEffect(() => {
    let arr = [];
    for (let i = 0; i < optionCount; i++) {
      arr.push("");
    }
    setOptions(arr);
  }, [optionCount]);
  useEffect(() => {
    checkValid();
    // eslint-disable-next-line
  }, [title]);
  return (
    <div className={addModal ? `${style.modal}` : `${style.hide}`}>
      <div className={style.modalBody}>
        <span
          className={`material-symbols-outlined ${style.modalClose}`}
          onClick={() => {
            setAddModal(false);
          }}
        >
          close
        </span>
        <div className={style.form}>
          <h2>Create Poll</h2>
          <label>Question Title *</label>
          <input
            type="text"
            placeholder=""
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            value={title}
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
          <label>Option Count *</label>
          <select
            onChange={(e) => {
              setOptionCount(e.target.value);
            }}
            value={optionCount}
          >
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
          <label>Status *</label>
          <select
            onChange={(e) => {
              setStatus(e.target.value);
            }}
          >
            <option value="live">Live</option>
            <option value="upcoming">Upcoming</option>
            <option value="closed">Closed</option>
          </select>
          {options.map((option, index) => {
            return (
              <div key={index}>
                <label>Option {index + 1} *</label>
                <input
                  type="text"
                  onInput={(e) => {
                    let arr = options;
                    arr[index] = e.target.value;
                    setOptions(arr);
                    checkValid();
                  }}
                />
              </div>
            );
          })}
          <button disabled={!valid} onClick={addPoll}>
            Create Poll
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
