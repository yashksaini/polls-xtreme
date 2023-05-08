import React from "react";
import {
  getDocs,
  getFirestore,
  query,
  collection,
  orderBy,
  where,
  limit,
} from "firebase/firestore";
import pollStyle from "./polls.module.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Paging from "./partials/Paging";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const Polls = () => {
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [polls, setPolls] = useState([]);
  const [pollType, setPollType] = useState("");
  const [loading, setLoading] = useState(true);
  let auth = getAuth();

  async function getPollsData(userID) {
    let array = [];
    let firestore = getFirestore();
    let querySnapshot = await getDocs(
      query(
        collection(firestore, "polls"),
        orderBy("createdOn", "desc"),
        limit(20)
      )
    );
    querySnapshot.forEach(async (doc) => {
      let tempPollData = doc.data();
      let userDataSanapshot = await getDocs(
        query(
          collection(firestore, "pollsData"),
          where("pollId", "==", tempPollData.id),
          where("userId", "==", userID)
        )
      );
      let userStats = [];
      userDataSanapshot.forEach((pollDoc) => {
        userStats.push(pollDoc.data());
      });
      if (userStats.length > 0) {
        let submittedData = userStats[0];
        let finalOutputData = {
          ...tempPollData,
          UserAnswer: submittedData.answer,
          points: submittedData.points,
        };
        array.push(finalOutputData);
      } else {
        let finalOutputData = {
          ...tempPollData,
          UserAnswer: "",
          points: -1,
        };
        array.push(finalOutputData);
      }
    });
    setTimeout(() => {
      setPolls(array);
      if (array.length % 5 === 0) {
        setPageCount(array.filter(checkStatus).length / 5);
      } else {
        setPageCount(parseInt(array.filter(checkStatus).length / 5) + 1);
      }
      setLoading(false);
    }, 800);
  }

  const checkStatus = (poll) => {
    if (pollType !== "") {
      return poll.status === pollType;
    } else {
      return true;
    }
  };
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      await getPollsData(user.uid);
    }); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (polls.filter(checkStatus).length % 5 === 0) {
      setPageCount(polls.filter(checkStatus).length / 5);
    } else {
      setPageCount(parseInt(polls.filter(checkStatus).length / 5) + 1);
    } // eslint-disable-next-line
  }, [pollType]);

  const updateCurrentPage = (pageNo) => {
    setCurrentPage(pageNo);
  };
  return (
    <div className={pollStyle.fullContainer}>
      <div className={pollStyle.header}>
        <h1>Participate in the PollsXtreme </h1>
        <p>
          Participate in polls and increase your points by giving correct
          estimations.
        </p>
      </div>
      <div className={pollStyle.container}>
        <div className={pollStyle.pollContainer}>
          <Paging
            currentPage={currentPage}
            updateCurrentPage={updateCurrentPage}
            pageCount={pageCount}
          />
          <div className={pollStyle.polls}>
            {loading ? (
              <div className={pollStyle.load}>
                <div className={pollStyle.box}>Loading...</div>
              </div>
            ) : (
              ""
            )}
            {polls.filter(checkStatus).length === 0 && !loading ? (
              <div className={pollStyle.emptyStatus}>
                <div>
                  <span className="material-symbols-outlined">
                    hourglass_disabled
                  </span>
                </div>
                <div>
                  {" "}
                  No <i>{pollType}</i> polls
                </div>
                <button
                  onClick={() => {
                    setPollType("closed");
                  }}
                >
                  Closed Polls
                </button>
              </div>
            ) : (
              ""
            )}

            {polls
              .filter(checkStatus)
              ?.slice((currentPage - 1) * 5, (currentPage - 1) * 5 + 5)
              .map((poll, index) => {
                return (
                  <div className={pollStyle.card} key={index}>
                    <h3>{poll?.title}</h3>
                    <span
                      className={
                        poll?.points > -1
                          ? pollStyle.submitStatus
                          : pollStyle.hide
                      }
                    >
                      Submitted
                    </span>
                    &nbsp;
                    <span
                      className={
                        poll?.points > -1 && poll?.answer === ""
                          ? pollStyle.answerStatus
                          : pollStyle.hide
                      }
                    >
                      {poll.UserAnswer}
                    </span>
                    <span
                      className={
                        poll?.points === -1 && poll?.answer === ""
                          ? pollStyle.pendingStatus
                          : pollStyle.hide
                      }
                    >
                      Not Submitted
                    </span>
                    <span
                      className={
                        poll?.points > -1 && poll?.answer === poll?.UserAnswer
                          ? pollStyle.correctStatus
                          : pollStyle.hide
                      }
                    >
                      100 Points
                    </span>
                    <span
                      className={
                        poll?.points > -1 &&
                        poll?.answer !== poll?.UserAnswer &&
                        poll?.answer !== ""
                          ? pollStyle.wrongStatus
                          : pollStyle.hide
                      }
                    >
                      0 Points
                    </span>
                    <div className={pollStyle.footer}>
                      <p>
                        <i>{poll?.createdOn?.toDate().toDateString()}</i>
                        <strong
                          className={`${pollStyle.status} ${poll.status}`}
                        >
                          {poll?.status}
                        </strong>
                      </p>
                      <Link to={"/poll/" + poll?.id}>
                        <span>View Poll </span>
                        <span className="material-symbols-outlined">
                          open_in_new
                        </span>
                      </Link>
                    </div>
                  </div>
                );
              })}
          </div>
          <Paging
            currentPage={currentPage}
            updateCurrentPage={updateCurrentPage}
            pageCount={pageCount}
          />
        </div>
        <div className={pollStyle.pollStatus}>
          <div
            className={
              pollType === ""
                ? `${pollStyle.select} ${pollStyle.activeSelect}`
                : `${pollStyle.select}`
            }
            onClick={() => {
              setPollType("");
              setCurrentPage(1);
            }}
          >
            <span className="material-symbols-outlined">
              {pollType === "" ? "task_alt" : "circle"}
            </span>
            All Polls
          </div>
          <div
            className={
              pollType === "upcoming"
                ? `${pollStyle.select} ${pollStyle.activeSelect}`
                : `${pollStyle.select}`
            }
            onClick={() => {
              setPollType("upcoming");
              setCurrentPage(1);
            }}
          >
            <span className="material-symbols-outlined">
              {pollType === "upcoming" ? "task_alt" : "circle"}
            </span>
            Upcoming Polls
          </div>
          <div
            className={
              pollType === "live"
                ? `${pollStyle.select} ${pollStyle.activeSelect}`
                : `${pollStyle.select}`
            }
            onClick={() => {
              setPollType("live");
              setCurrentPage(1);
            }}
          >
            <span className="material-symbols-outlined">
              {pollType === "live" ? "task_alt" : "circle"}
            </span>
            Live Polls
          </div>
          <div
            className={
              pollType === "closed"
                ? `${pollStyle.select} ${pollStyle.activeSelect}`
                : `${pollStyle.select}`
            }
            onClick={() => {
              setPollType("closed");
              setCurrentPage(1);
            }}
          >
            <span className="material-symbols-outlined">
              {pollType === "closed" ? "task_alt" : "circle"}
            </span>
            Closed Polls
          </div>
        </div>
      </div>
    </div>
  );
};

export default Polls;
