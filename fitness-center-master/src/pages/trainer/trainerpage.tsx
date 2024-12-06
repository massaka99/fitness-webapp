import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import withAuth from "../../types/auth";;
import TrainerNavBar from "../../types/trainernavbar";
import styles from "../../styles/hometrainer.module.css";

type UserInfo = {
  Name: string;
  Role: string;
  UserId: string;
  GroupId: string;
  nbf: string;
  exp: string;
};

const TrainerPage = () => {
  const [trainerName, setTrainerName] = React.useState<string>("");

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      const decoded = jwtDecode(token) as UserInfo;
      setTrainerName(decoded.Name);
    }
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <TrainerNavBar />
      <div className={styles.container}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.welcomeTitle}>Welcome back, {trainerName}!</h1>
          <p className={styles.welcomeSubtitle}>Ready to help your clients achieve their fitness goals today?</p>
        </div>
      </div>
    </div>
  );
};

export default withAuth(TrainerPage, "PersonalTrainer");