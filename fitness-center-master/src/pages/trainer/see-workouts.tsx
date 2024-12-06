import React, { useEffect, useState } from "react";
import withAuth from "../../types/auth";
import TrainerNavBar from "../../types/trainernavbar";
import styles from "../../styles/trainer.module.css";
import Cookies from "js-cookie";

interface Client {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface Exercise {
  exerciseId: number;
  name: string;
  description: string;
  sets: number;
  repetitions: number;
  time?: string;
}

interface Workout {
  workoutProgramId: number;
  name: string;
  description: string;
  clientId: number;
  exercises: Exercise[];
}

const SeeWorkouts = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      const token = Cookies.get("token");
      try {
        const response = await fetch(
          "https://swafe24fitness.azurewebsites.net/api/Users/Clients",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch clients");
        }

        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const token = Cookies.get("token");
      try {
        const response = await fetch(
          "https://swafe24fitness.azurewebsites.net/api/WorkoutPrograms/trainer",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }

        const data = await response.json();
        setWorkouts(data);
      } catch (error) {
        console.error("Error fetching workouts:", error);
        setError("Failed to load workouts. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const filteredWorkouts = selectedClientId === "all"
    ? workouts
    : workouts.filter(workout => workout.clientId === selectedClientId);

  const getClientName = (clientId: number) => {
    const client = clients.find(c => c.userId === clientId);
    return client ? `${client.firstName} ${client.lastName}` : "Unknown Client";
  };

  return (
    <div className={styles.pageWrapper}>
      <TrainerNavBar />
      <div className={styles.container}>
        <h1 className={styles.title}>Workout Programs</h1>
        
        <div className={styles.filterSection}>
          <select
            className={styles.clientFilter}
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value === "all" ? "all" : Number(e.target.value))}
          >
            <option value="all">All Clients</option>
            {clients.map((client) => (
              <option key={client.userId} value={client.userId}>
                {client.firstName} {client.lastName}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className={styles.loadingWrapper}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading workouts...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : filteredWorkouts.length === 0 ? (
          <div className={styles.noWorkouts}>
            <p>No workout programs found.</p>
          </div>
        ) : (
          <div className={styles.workoutGrid}>
            {filteredWorkouts.map((workout) => (
              <div key={workout.workoutProgramId} className={styles.workoutCard}>
                <h2 className={styles.workoutTitle}>{workout.name}</h2>
                <p className={styles.clientName}>Client: {getClientName(workout.clientId)}</p>
                <p className={styles.workoutDescription}>{workout.description}</p>
                
                <div className={styles.exerciseList}>
                  <h3>Exercises</h3>
                  {workout.exercises.map((exercise) => (
                    <div key={exercise.exerciseId} className={styles.exerciseItem}>
                      <h4>{exercise.name}</h4>
                      <p>{exercise.description}</p>
                      <div className={styles.exerciseDetails}>
                        <span>Sets: {exercise.sets}</span>
                        {exercise.repetitions > 0 && (
                          <span>Reps: {exercise.repetitions}</span>
                        )}
                        {exercise.time && <span>Time: {exercise.time}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(SeeWorkouts, "PersonalTrainer");
