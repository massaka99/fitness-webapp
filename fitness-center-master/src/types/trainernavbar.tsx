import React from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import styles from "../styles/navbar.module.css";
import Link from "next/link";

const TrainerNavBar = () => {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <span className={styles.logo}>FitnessTrainer</span>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link href="/trainer/trainerpage" legacyBehavior>
              <a className={router.pathname === "/trainer/trainerpage" ? styles.active : ""}>Home</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/trainer/create-client" legacyBehavior>
              <a className={router.pathname === "/trainer/create-client" ? styles.active : ""}>Create Client</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/trainer/create-workout" legacyBehavior>
              <a className={router.pathname === "/trainer/create-workout" ? styles.active : ""}>Create and Edit Workout</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/trainer/see-workouts" legacyBehavior>
              <a className={router.pathname === "/trainer/see-workouts" ? styles.active : ""}>See Workouts</a>
            </Link>
          </li>
          <li className={styles.navItem}>
            <Link href="/trainer/see-clients" legacyBehavior>
              <a className={router.pathname === "/trainer/see-clients" ? styles.active : ""}>See Clients</a>
            </Link>
          </li>
        </ul>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default TrainerNavBar;