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
import { Link } from "react-router-dom";
import intToString from "../../converter";
// import { Link } from "react-router-dom";
const OverallRank = () => {
  const [rankData, setRankData] = useState([]);
  const [loading, setLoading] = useState(true);
  let firestore = getFirestore();
  const rankStatus = ["st", "nd", "rd"];
  async function getOverAllRanking() {
    let queryUserName = await getDocs(
      query(
        collection(firestore, "profile"),
        where("points", "!=", 0),
        orderBy("points", "desc"),
        limit(3)
      )
    );
    let userData = [];
    queryUserName.forEach((profileDoc) => {
      userData.push(profileDoc.data());
    });
    setRankData(userData);
    setLoading(false);
  }
  useEffect(() => {
    getOverAllRanking(); // eslint-disable-next-line
  }, []);
  return (
    <>
      {loading ? (
        <div className={pollStyle.load}>
          <div className={pollStyle.box}>Loading...</div>
        </div>
      ) : (
        ""
      )}
      {rankData?.map((user, index) => {
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
    </>
  );
};

export default OverallRank;
