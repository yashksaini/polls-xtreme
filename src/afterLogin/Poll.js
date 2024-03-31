import React from "react";
import {
  getDocs,
  getFirestore,
  query,
  collection,
  where,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import style from "./poll.module.css";
import pollStyle from "./polls.module.css";
import TimeLeftCounter from "./partials/TimeLeftCounter";

const Poll = () => {
  const { id } = useParams();
  const [userID, setUserID] = useState("");
  const [pollData, setPollData] = useState({});
  const [selected, setSelected] = useState("");
  const [valid, setValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [points, setPoints] = useState(0);
  const [submittedUsers, setSubmittedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isActive, setActive] = useState(false);

  let auth = getAuth();
  let firestore = getFirestore();

  async function getSubmittedData(userUID) {
    setUserID(userUID);
    let querySnapshot = await getDocs(
      query(
        collection(firestore, "pollsData"),
        where("pollId", "==", id),
        where("userId", "==", userUID)
      )
    );
    let array = [];
    querySnapshot.forEach((doc) => {
      array.push(doc.data());
    });
    if (array.length > 0) {
      setSelected(array[0]?.answer);
      setPoints(array[0]?.points);
      setIsSubmitted(true);
      await getSubmitedUsers();
    } else {
      setIsSubmitted(false);
    }
    await getPollData();
  }
  async function getSubmitedUsers() {
    let querySnapshot = await getDocs(
      query(collection(firestore, "pollsData"), where("pollId", "==", id))
    );
    let array = [];
    querySnapshot.forEach(async (doc) => {
      let currentData = doc.data();
      let queryUserName = await getDocs(
        query(
          collection(firestore, "profile"),
          where("id", "==", currentData.userId)
        )
      );
      let userData = [];
      queryUserName.forEach((profileDoc) => {
        userData.push(profileDoc.data());
      });
      let finalOutput = {
        name: userData[0]?.name,
        email: userData[0]?.email,
        points: userData[0]?.points,
        answer: currentData.answer,
        answerOn: currentData.answerOn,
      };
      array.push(finalOutput);
    });
    setSubmittedUsers(array);
  }

  async function getPollData() {
    let querySnapshot = await getDocs(
      query(collection(firestore, "polls"), where("id", "==", id))
    );
    let array = [];
    querySnapshot.forEach((doc) => {
      array.push(doc.data());
    });
    setPollData(array[0]);
    setLoading(false);
  }

  async function addPoll() {
    if (pollData?.startTime && pollData?.endTime) {
      let startTime = new Date(pollData?.startTime);
      let endTime = new Date(pollData?.endTime);
      let currentTime = new Date();
      if (currentTime > startTime && currentTime < endTime) {
        setValid(false);
        const docRef = await addDoc(collection(firestore, "pollsData"), {
          userId: userID,
          pollId: id,
          answer: selected,
          points: 0,
          answerOn: serverTimestamp(),
        });
        await updateDoc(docRef, {
          id: docRef.id,
        }).then(async () => {
          await getSubmittedData(userID);
          window.location.reload();
        });
      } else {
        alert("Times up . Poll is in progress.");
      }
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      await getSubmittedData(user.uid);
    }); // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (selected.length > 0) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [selected]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (pollData?.startTime && pollData?.endTime) {
        let startTime = new Date(pollData?.startTime);
        let endTime = new Date(pollData?.endTime);
        let currentTime = new Date();
        if (currentTime > startTime && currentTime < endTime) {
          setActive(true);
        } else {
          setActive(false);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [pollData?.endTime, pollData?.startTime]);
  return (
    <div className={pollStyle.fullContainer}>
      <div className={pollStyle.header}>
        <h1>
          Welcome, <strong>{auth?.currentUser?.displayName}</strong>
        </h1>
        <p
          className={
            pollData?.title?.length > 0 && !loading ? `` : `${pollStyle.hide}`
          }
        >
          {pollData?.createdOn?.toDate().toDateString()}{" "}
          {pollData?.startTime &&
            pollData?.endTime &&
            pollData.status !== "closed" && (
              <TimeLeftCounter
                startTime={pollData.startTime}
                endTime={pollData.endTime}
              />
            )}
          {pollData?.status === "closed" && (
            <strong className={`${pollStyle.status} ${pollData.status}`}>
              {pollData?.status}
            </strong>
          )}
        </p>
        <p
          className={
            pollData?.title?.length > 0 && !loading ? `${pollStyle.hide}` : ``
          }
        >
          404 Page not found
        </p>
      </div>
      <div className={pollStyle.container}>
        <div className={pollStyle.pollContainer}>
          <div className={pollStyle.polls}>
            {loading ? (
              <div className={pollStyle.load}>
                <div className={pollStyle.box}>Loading...</div>
              </div>
            ) : (
              ""
            )}
            <div
              className={
                !pollData?.title?.length && !loading
                  ? `${pollStyle.emptyStatus}`
                  : `${pollStyle.hide}`
              }
            >
              <div>
                <span className="material-symbols-outlined">
                  hourglass_disabled
                </span>
              </div>
              <div> This poll does not exist.</div>
              <Link to="/polls" className={style.viewAllBtn}>
                View Polls
              </Link>
            </div>
            <div
              className={
                pollData?.title?.length > 0 && !loading
                  ? `${pollStyle.card}`
                  : `${pollStyle.hide}`
              }
            >
              <div className={style.optionSpace}>
                <h2>{pollData?.title}</h2>
                {pollData?.options?.map((option, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (
                          !isSubmitted &&
                          pollData?.status !== "closed" &&
                          isActive
                        ) {
                          setSelected(option);
                        }
                      }}
                      className={
                        selected === option
                          ? `${style.select} ${style.activeSelect}`
                          : `${style.select}`
                      }
                    >
                      <span className="material-symbols-outlined">
                        {selected === option ? "task_alt" : "circle"}
                      </span>{" "}
                      {option}
                    </div>
                  );
                })}
                <button
                  disabled={!valid}
                  onClick={addPoll}
                  className={
                    isSubmitted === true ||
                    pollData?.status === "closed" ||
                    !isActive
                      ? `${pollStyle.hide}`
                      : ""
                  }
                >
                  Submit Answer
                </button>
              </div>
            </div>
            <div
              className={
                pollData?.answer?.length > 0
                  ? `${pollStyle.card}`
                  : `${pollStyle.hide}`
              }
            >
              <h3>
                <strong>Answer: </strong>&nbsp; {pollData?.answer}
              </h3>
              <span
                className={
                  points === 100 ? pollStyle.correctStatus : pollStyle.hide
                }
              >
                100 Points
              </span>
              <span
                className={
                  points === 0 ? pollStyle.wrongStatus : pollStyle.hide
                }
              >
                0 Points
              </span>
            </div>
          </div>
        </div>
        <div
          className={
            pollData?.title?.length > 0 && !loading
              ? `${style.pollStatus}`
              : `${pollStyle.hide}`
          }
        >
          <div className={pollStyle.card}>
            <h2>
              Submitted By
              <strong>{submittedUsers.length}</strong>
            </h2>
            <p
              className={submittedUsers.length !== 0 ? `${pollStyle.hide}` : ""}
            >
              Submit the poll to see the submitted users.
            </p>
          </div>
          {submittedUsers.map((userData, index) => {
            return (
              <div className={pollStyle.card} key={index}>
                <h3 className={style.cardHead}>
                  {userData.name}
                  <span
                    className={
                      userData?.answer === pollData.answer &&
                      pollData.answer !== ""
                        ? `${style.correctAnswer} material-symbols-outlined`
                        : `${pollStyle.hide}`
                    }
                  >
                    check_circle
                  </span>
                  <span
                    className={
                      userData?.answer !== pollData.answer &&
                      pollData.answer !== ""
                        ? `${style.wrongAnswer} material-symbols-outlined`
                        : `${pollStyle.hide}`
                    }
                  >
                    cancel{" "}
                  </span>
                </h3>

                <p style={{ marginTop: "0.3rem" }}>
                  <strong>{userData.answer}</strong>
                </p>
                <div className={pollStyle.footer}>
                  <span className={style.correctStatus}>
                    {userData.points} Points
                  </span>
                  <p>
                    <i>
                      {userData?.answerOn?.toDate().toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </i>
                  </p>
                  {/* <Link to={"/profile/" + userData?.userId}>
                        <span>View Profile </span>
                        <span className="material-symbols-outlined">
                          open_in_new
                        </span>
                      </Link> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Poll;
