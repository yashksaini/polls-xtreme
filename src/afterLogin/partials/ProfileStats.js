import React, { useEffect, useState } from "react";
import {
  getFirestore,
  query,
  collection,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import styles from "./stats.module.css";
import intToString from "../../converter";

const ProfileStats = (props) => {
  const { profileData } = props;
  const [totalPolls, setTotalPolls] = useState(0);
  const [graphOffset, setGraphOffset] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const { id } = useParams();
  const firestore = getFirestore();

  const getPollsCount = async () => {
    const collectionRef = collection(firestore, "pollsData");
    const q = query(collectionRef, where("userId", "==", id));
    const snapshot = await getCountFromServer(q);
    setTotalPolls(snapshot.data().count);
  };
  const updateGraph = () => {
    if (totalPolls > 0) {
      const correct = profileData?.pollCount;
      const graphConst = 478;
      const portion = correct / totalPolls;
      setAccuracy(Math.round(portion * 100));
      setGraphOffset(-graphConst * (1 - portion));
    }
  };
  useEffect(() => {
    updateGraph(); // eslint-disable-next-line
  }, [profileData, totalPolls]);

  useEffect(() => {
    getPollsCount(); // eslint-disable-next-line
  }, [id]);
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h4>Accuracy</h4>
        <div className={styles.accuracy}>
          <svg>
            <circle cx="84" cy="84" r="72"></circle>
            <circle
              cx="84"
              cy="84"
              r="72"
              strokeLinecap="round"
              style={{ strokeDashoffset: graphOffset }}
            ></circle>
          </svg>
          <div>
            <h5>{accuracy} %</h5>
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <h4>Points</h4>
        <p>{intToString(profileData?.points)}</p>
      </div>
      <div className={styles.card}>
        <h4>Participations</h4>
        <p>{intToString(totalPolls)}</p>
      </div>
    </div>
  );
};

export default ProfileStats;
