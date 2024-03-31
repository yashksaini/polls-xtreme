import React, { useState, useEffect } from "react";
import style from "./stats.module.css";

const TimeLeftCounter = ({ startTime, endTime }) => {
  const [timeLeft, setTimeLeft] = useState(
    calculateTimeLeft(startTime, endTime)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(startTime, endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  function calculateTimeLeft(startTime, endTime) {
    const newStartTime = new Date(startTime);
    const newEndTime = new Date(endTime);
    const currentTime = new Date();
    let color = "#ff9900";
    let text = "Live In";

    let timeDiff = newStartTime - currentTime;
    if (timeDiff <= 0) {
      timeDiff = newEndTime - currentTime;
      text = "Active For";
      color = "#2c974b";
    }
    if (timeDiff <= 0) {
      text = "In Progress";
      color = "#1992e6";
      return;
    }

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return (
      <span className={style.status1}>
        <span style={{ color: color }}>{text}</span>
        <b className={style.label}>
          {hours}:{minutes < 10 ? "0" : ""}
          {minutes}:{seconds < 10 ? "0" : ""}
          {seconds}
        </b>
      </span>
    );
  }

  return <>{timeLeft}</>;
};

export default TimeLeftCounter;
