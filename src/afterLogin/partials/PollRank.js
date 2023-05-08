import React, { useEffect, useState } from "react";
import {
  getDocs,
  getFirestore,
  query,
  collection,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import pollStyle from "./../polls.module.css";
import rankStyle from "./rank.module.css";
import intToString from "../../converter";
import { Link } from "react-router-dom";

const PollRank = () => {
  const [rankData, setRankData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pollCount, setPollCount] = useState(20);
  let firestore = getFirestore();
  const rankStatus = ["st", "nd", "rd"];

  async function getProfileData(pointsData) {
    let profileData = [];
    let queryProfile = await getDocs(query(collection(firestore, "profile")));
    queryProfile.forEach((profileDoc) => {
      let profile = profileDoc.data();
      let data = {
        id: profile.id,
        points: pointsData[profile.id] || 0,
        name: profile.name,
        allPoints: profile.points,
      };
      profileData.push(data);
    });
    const rankingData = profileData
      .filter((profile) => {
        return profile.allPoints !== 0;
      })
      .sort((a, b) => {
        return b.allPoints - a.allPoints;
      })
      .sort((a, b) => {
        return b.points - a.points;
      });
    setRankData(rankingData);
    setLoading(false);
  }
  async function getPollWiseRanking() {
    setLoading(true);
    let queryPolls = await getDocs(
      query(
        collection(firestore, "polls"),
        orderBy("createdOn", "desc"),
        limit(pollCount)
      )
    );
    let arr = [];
    queryPolls.forEach(async (pollDoc) => {
      let poll = pollDoc.data();
      let querySubmitted = await getDocs(
        query(
          collection(firestore, "pollsData"),
          where("pollId", "==", poll.id)
        )
      );
      querySubmitted.forEach((doc) => {
        let data = doc.data();
        arr[data.userId] = arr[data.userId] || 0;
        arr[data.userId] += data.points;
      });
      getProfileData(arr);
    });
  }
  useEffect(() => {
    getPollWiseRanking(); // eslint-disable-next-line
  }, [pollCount]);
  return (
    <>
      <div className={rankStyle.select}>
        <p>
          Last <span>{pollCount}</span> polls rank
        </p>
        <select
          onChange={(e) => {
            setPollCount(e.target.value);
          }}
          value={pollCount}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      {loading ? (
        <div className={pollStyle.load}>
          <div className={pollStyle.box}>Loading...</div>
        </div>
      ) : (
        ""
      )}
      <div className={loading ? pollStyle.hide : ""}>
        {rankData?.splice(0, 3)?.map((user, index) => {
          return (
            <div className={pollStyle.card} key={index}>
              <span className={rankStyle.points}>
                {intToString(user?.points)}
              </span>
              <h3>
                <p className={rankStyle.rankLogo + " " + rankStatus[index]}>
                  <span>
                    {index + 1} <sup>{rankStatus[index]}</sup>
                  </span>
                </p>
                {user?.name}
              </h3>

              <div className={pollStyle.footer}>
                <Link to={"/profile/" + user?.id}>
                  <span>View Profile </span>
                  <span className="material-symbols-outlined">open_in_new</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default PollRank;
