import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import withAuth from "../../types/auth";
import styles from "../../styles/client.module.css";

type WorkoutProgram = {
  id: number;
  name: string;
  description: string;
  exercises: Exercise[];
};

type Exercise = {
  id: number;
  name: string;
  description: string;
  sets: number;
  repetitions: number;
  time: number;
};

const NavBar = () => {
  const router = useRouter();
  
  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <span className={styles.logo}>Fitness Center</span>
          </li>
          <li className={styles.navItem}>
            <span className={styles.pageTitle}>My Workout Programs</span>
          </li>
        </ul>
        <button 
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

const ProgramCard = ({ program, onClick }: { program: WorkoutProgram; onClick: () => void }) => (
  <div className={styles.programCard} onClick={onClick}>
    <div className={styles.programHeader}>
      <h2>{program.name}</h2>
      <span className={styles.exerciseCount}>
        {program.exercises.length} {program.exercises.length === 1 ? 'exercise' : 'exercises'}
      </span>
    </div>
    <p className={styles.programDescription}>{program.description}</p>
    <div className={styles.viewDetails}>
      <span>View Details</span>
      <svg className={styles.arrow} viewBox="0 0 24 24" width="16" height="16">
        <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
      </svg>
    </div>
  </div>
);

const ProgramDetail = ({ program, onBack }: { program: WorkoutProgram; onBack: () => void }) => (
  <div className={styles.programDetail}>
    <button className={styles.backButtonDetail} onClick={onBack}>
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
      Back to Programs
    </button>
    <h2 className={styles.programDetailTitle}>{program.name}</h2>
    <p className={styles.description}>{program.description}</p>
    <div className={styles.exercisesList}>
      <h3>Exercises</h3>
      {program.exercises.map((exercise, index) => (
        <div key={exercise.id} className={styles.exercise}>
          <div className={styles.exerciseHeader}>
            <span className={styles.exerciseNumber}>#{index + 1}</span>
            <h4>{exercise.name}</h4>
          </div>
          <p>{exercise.description}</p>
          <div className={styles.exerciseDetails}>
            <span className={styles.exerciseMetric}>Sets: {exercise.sets}</span>
            {exercise.repetitions > 0 && (
              <span className={styles.exerciseMetric}>Reps: {exercise.repetitions}</span>
            )}
            {exercise.time > 0 && (
              <span className={styles.exerciseMetric}>Time: {exercise.time}s</span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ClientPage = () => {
  const [workoutPrograms, setWorkoutPrograms] = useState<WorkoutProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<WorkoutProgram | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWorkoutPrograms = async () => {
      try {
        const token = Cookies.get("token");
        const response = await fetch(
          "https://swafe24fitness.azurewebsites.net/api/WorkoutPrograms",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch workout programs");
        }

        const data = await response.json();
        setWorkoutPrograms(data);
      } catch (err) {
        setError("Failed to load workout programs");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutPrograms();
  }, []);

  return (
    <div className={styles.pageWrapper}>
      <NavBar />
      <div className={styles.container}>
        {loading ? (
          <div className={styles.loadingWrapper}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading workout programs...</p>
          </div>
        ) : error ? (
          <div className={styles.errorMessage}>
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        ) : workoutPrograms.length === 0 ? (
          <div className={styles.noPrograms}>
            <span>📋</span>
            <p>No workout programs found.</p>
          </div>
        ) : selectedProgram ? (
          <ProgramDetail 
            program={selectedProgram} 
            onBack={() => setSelectedProgram(null)}
          />
        ) : (
          <div className={styles.programsGrid}>
            {workoutPrograms.map((program) => (
              <ProgramCard
                key={program.id}
                program={program}
                onClick={() => setSelectedProgram(program)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(ClientPage, "Client");
