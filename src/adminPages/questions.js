import { serverTimestamp } from "firebase/firestore";

export const generateQuestions = (
  team1,
  team2,
  matchNo,
  startTime,
  endTime
) => {
  const questions = [
    {
      title: `${team1} vs ${team2}. Match - ${matchNo}. How many total runs scored in this match ?`,
      answer: "",
      options: ["0 - 300", "301 - 350", "351 - 390", "390+"],
      status: "live",
      startTime: startTime,
      endTime: endTime,
      createdOn: serverTimestamp(),
    },
    {
      title: `${team1} vs ${team2}. Match - ${matchNo}. How many total wickets fall in this match?`,
      answer: "",
      options: ["0 - 6", "7 - 11", "12 - 15", "15+"],
      status: "live",
      startTime: startTime,
      endTime: endTime,
      createdOn: serverTimestamp(),
    },
    {
      title: `${team1} vs ${team2}. Match - ${matchNo}. How many total fours in this match?`,
      answer: "",
      options: ["0 - 20", "21 - 26", "27 - 32", "32+"],
      status: "live",
      startTime: startTime,
      endTime: endTime,
      createdOn: serverTimestamp(),
    },
    {
      title: `${team1} vs ${team2}. Match - ${matchNo}. How many total sixes in this match?`,
      answer: "",
      options: ["0 - 8", "9 - 14", "15 - 22", "22+"],
      status: "live",
      startTime: startTime,
      endTime: endTime,
      createdOn: serverTimestamp(),
    },
    {
      title: `${team1} vs ${team2}. Match - ${matchNo}. Who will win the match?`,
      answer: "",
      options: [team1, team2],
      status: "live",
      startTime: startTime,
      endTime: endTime,
      createdOn: serverTimestamp(),
    },
  ];
  return questions;
};
