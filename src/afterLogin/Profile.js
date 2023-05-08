import React from "react";
import {
  getDocs,
  getFirestore,
  query,
  collection,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import pollStyle from "./polls.module.css";
import profileStyle from "./profile.module.css";
import formStyle from "./../beforeLogin/form.module.css";
import ProfileStats from "./partials/ProfileStats";

const Profile = () => {
  const { id } = useParams();
  const [validUser, setValidUser] = useState(true);
  const [profileData, setProfileData] = useState({});
  const [currentUserId, setCurrentUserId] = useState("");
  const [imageUpload, setImageUpload] = useState("");
  const [modal, setModal] = useState(false);
  const [update, setUpdate] = useState({});
  const [formValid, setFormValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [validUserId, setValidUserId] = useState(false);
  const firestore = getFirestore();
  let auth = getAuth();
  async function getProfileData(userId, currentId) {
    let firestore = getFirestore();
    let querySnapshot = await getDocs(
      query(collection(firestore, "profile"), where("id", "==", userId))
    );
    let array = [];
    querySnapshot.forEach((doc) => {
      array.push(doc.data());
    });
    if (array.length > 0) {
      if (array[0]?.id === currentId) {
        setValidUser(true);
      } else {
        setValidUser(false);
      }
      setProfileData(array[0]);
      setTimeout(() => {
        setLoading(false);
      }, 500);
      setValidUserId(true);
    } else {
      setValidUserId(false);
    }
  }
  useEffect(() => {
    if (update?.name?.length > 3) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
  }, [update]);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setCurrentUserId(user.uid);
      getProfileData(id, user.uid);
    }); // eslint-disable-next-line
  }, [id]);

  // Upload image to firestore storage and update the image url in profile section
  const uploadImage = (event) => {
    if (validUser) {
      setImageUpload("Uploading...");
      const file = event.target.files[0];
      const storage = getStorage();
      const imageRef = ref(storage, `images/${currentUserId}/avatar.png`);
      uploadBytes(imageRef, file).then(async () => {
        const profileRef = doc(firestore, "profile", currentUserId);
        getDownloadURL(imageRef).then(async (url) => {
          await updateDoc(profileRef, {
            imageUrl: url,
          });
          setImageUpload("Image uploaded successfully");
          setTimeout(() => {
            setImageUpload("");
          }, 3000);
          getProfileData(id, currentUserId);
        });
      });
    }
  };
  const updateUserProfile = async () => {
    if (validUser) {
      const profileRef = doc(firestore, "profile", currentUserId);
      await updateDoc(profileRef, update);
      setModal(false);
      getProfileData(id, currentUserId);
      let currentUser = auth.currentUser;
      updateProfile(currentUser, {
        displayName: update?.name,
      });
    }
  };

  const signOutUser = async () => {
    const auth = getAuth();
    await signOut(auth).then(() => {
      localStorage.setItem("userType", "");
      window.location.reload();
    });
  };
  return (
    <>
      <div
        className={
          validUserId ? `${pollStyle.hide}` : ` ${pollStyle.fullContainer}`
        }
      >
        <div className={pollStyle.header}>
          <h1>
            Welcome to <b>PollsXtreme</b>
          </h1>
          <p>404 Page not found</p>
        </div>
      </div>
      <div
        className={
          validUserId ? `${pollStyle.fullContainer}` : `${pollStyle.hide}`
        }
      >
        <div className={pollStyle.header}>
          <h1>
            PollsXtreme <b>Profile</b>
          </h1>
          <p>
            Check achievements and ranking on PollsXtreme - Track progress and
            compete with others.
          </p>
        </div>
        <div
          className={
            loading ? `${profileStyle.container} ` : `${pollStyle.hide} `
          }
        >
          <div className={profileStyle.profileImg}>
            <div className={pollStyle.load}>
              <div className={pollStyle.box}>Loading...</div>
            </div>
          </div>
        </div>

        <div
          className={
            loading ? `${pollStyle.hide} ` : `${profileStyle.container}`
          }
        >
          <div className={profileStyle.profileImg}>
            <img
              src={
                profileData?.imageUrl === ""
                  ? "/images/profile.png"
                  : profileData?.imageUrl
              }
              alt="Profile"
            />
            <input
              type="file"
              accept="image/*"
              className={
                validUser ? `${profileStyle.editImage}` : `${pollStyle.hide}`
              }
              onChange={(e) => {
                if (e.target.files?.length > 0) {
                  uploadImage(e);
                }
              }}
            />
            <p className={profileStyle.message}>{imageUpload}</p>
          </div>
          <div className={profileStyle.profileDetails}>
            <div>
              <h1>
                {profileData?.name}
                <img
                  src="/images/verified.png"
                  alt="Verified"
                  className={profileStyle.verified}
                />
              </h1>
              <h4>{profileData?.email}</h4>
              <h3>About</h3>
              <p>
                {profileData?.about?.length > 0
                  ? profileData?.about
                  : "About user appear here..."}
              </p>
            </div>
            <button
              onClick={() => {
                setModal(true);
                setUpdate({
                  name: profileData?.name,
                  about: profileData?.about,
                });
              }}
              className={validUser ? "" : `${pollStyle.hide}`}
            >
              Update Profile
            </button>
          </div>
        </div>
        <div
          className={
            !loading ? `${profileStyle.container}` : `${pollStyle.hide}`
          }
        >
          <ProfileStats profileData={profileData} />
        </div>
        <div
          className={
            validUser && !loading
              ? `${profileStyle.container}`
              : `${pollStyle.hide}`
          }
        >
          <div
            className={profileStyle.profileImg}
            style={{ marginTop: "2rem" }}
          >
            <button onClick={signOutUser} className={profileStyle.logOut}>
              Log Out <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </div>
      {/* Modal for updating profile */}
      <div className={modal ? `${profileStyle.modal}` : `${pollStyle.hide}`}>
        <div className={profileStyle.modalBody}>
          <span
            className={`${profileStyle.modalClose} material-symbols-outlined`}
            onClick={() => {
              setModal(false);
              setUpdate({});
            }}
          >
            close
          </span>
          <div className={formStyle.form}>
            <h2 style={{ marginBottom: "2.5rem" }}>Update Profile</h2>
            <label>Full Name *</label>
            <input
              type="text"
              placeholder="full name"
              value={update?.name}
              onChange={(e) => {
                setUpdate({ ...update, name: e.target.value });
              }}
            />
            <label>About</label>
            <textarea
              className={formStyle.textArea}
              placeholder="write about here..."
              onChange={(e) => {
                setUpdate({ ...update, about: e.target.value });
              }}
              value={update?.about}
            ></textarea>
            <button disabled={!formValid} onClick={updateUserProfile}>
              Update
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
