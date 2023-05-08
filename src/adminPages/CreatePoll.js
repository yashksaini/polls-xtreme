import React, { useEffect, useState } from "react";
import {
  getDocs,
  getFirestore,
  query,
  collection,
  orderBy,
  limit,
} from "firebase/firestore";
import AdminNavbar from "./Navbar";
import Modal from "./Modal";
import AddModal from "./AddModal";
import style from "./admin.module.css";
const CreatePoll = () => {
  const [polls, setPolls] = useState([]);
  const [update, setUpdate] = useState({});
  const [modal, setModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  let firestore = getFirestore();
  async function getPollsData() {
    let querySnapshot = await getDocs(
      query(
        collection(firestore, "polls"),
        orderBy("createdOn", "desc"),
        limit(32)
      )
    );
    let array = [];
    querySnapshot.forEach((doc) => {
      array.push(doc.data());
    });
    setPolls(array);
  }
  useEffect(() => {
    getPollsData(); // eslint-disable-next-line
  }, []);

  return (
    <>
      <AdminNavbar />
      <div className={style.container}>
        <button
          className={style.addPollBtn}
          onClick={() => {
            setAddModal(true);
          }}
        >
          <span className="material-symbols-outlined">playlist_add</span>
        </button>
        <div className={style.adminPolls}>
          {polls.map((poll, index) => {
            return (
              <div className={style.adminPollCard} key={index}>
                <h1>{poll.title}</h1>
                <span className={style.pollStatus + " " + poll.status}>
                  {poll.status}
                </span>
                <div className={style.adminPollFooter}>
                  <span>{poll.createdOn.toDate().toDateString()}</span>
                  <button
                    onClick={() => {
                      let data = {
                        title: poll.title,
                        options: poll.options,
                        status: poll.status,
                        answer: poll.answer,
                        id: poll.id,
                      };
                      setUpdate(data);
                      setModal(true);
                    }}
                  >
                    Edit Poll
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <AddModal addModal={addModal} setAddModal={setAddModal} />
        <Modal
          modal={modal}
          setModal={setModal}
          setUpdate={setUpdate}
          update={update}
          getPollsData={getPollsData}
        />
      </div>
    </>
  );
};

export default CreatePoll;
