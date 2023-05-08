import React, { useState } from "react";
import pollStyle from "./polls.module.css";
import OverallRank from "./partials/OverallRank";
import PollRank from "./partials/PollRank";

const Ranking = () => {
  const [rankType, setRankType] = useState("overall");
  return (
    <div className={pollStyle.fullContainer}>
      <div className={pollStyle.header}>
        <h1>Rankings in the PollsXtreme </h1>
        <p>
          Discover the top performers, trendsetters, and game-changers across
          various domains in PollsXtreme rankings.
        </p>
      </div>
      <div className={pollStyle.container}>
        <div className={pollStyle.pollContainer}>
          <div className={pollStyle.polls}>
            {rankType === "overall" ? <OverallRank /> : ""}
            {rankType === "polls" ? <PollRank /> : ""}
          </div>
        </div>
        <div className={pollStyle.pollStatus}>
          <div
            className={
              rankType === "overall"
                ? `${pollStyle.select} ${pollStyle.activeSelect}`
                : `${pollStyle.select}`
            }
            onClick={() => {
              setRankType("overall");
            }}
          >
            <span className="material-symbols-outlined">
              {rankType === "overall" ? "task_alt" : "circle"}
            </span>
            Overall Rank
          </div>
          <div
            className={
              rankType === "polls"
                ? `${pollStyle.select} ${pollStyle.activeSelect}`
                : `${pollStyle.select}`
            }
            onClick={() => {
              setRankType("polls");
            }}
          >
            <span className="material-symbols-outlined">
              {rankType === "polls" ? "task_alt" : "circle"}
            </span>
            Pollwise Rank
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
