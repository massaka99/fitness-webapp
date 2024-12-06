import React, { useState, useEffect } from "react";
import withAuth from "../../types/auth";
import TrainerNavBar from "../../types/trainernavbar";
import styles from "../../styles/trainer.module.css";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

type Client = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
};

type Exercise = {
  name: string;
  description: string;
  sets: number;
  repetitions: number;
  time: string;
};

type WorkoutProgram = {
  name: string;
  description: string;
  clientId: number;
  exercises: Exercise[];
};

type DecodedToken = {
  UserId: string;
  Role: string;
};

const CreateWorkout = () => {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [trainerId, setTrainerId] = useState<string>("");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    name: "",
    description: "",
    sets: 0,
    repetitions: 0,
    time: "",
  });
  const [workoutProgram, setWorkoutProgram] = useState<WorkoutProgram>({
    name: "",
    description: "",
    clientId: 0,
    exercises: [],
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const decoded = jwtDecode(token) as DecodedToken;
      setTrainerId(decoded.UserId);
    }

    const fetchClients = async () => {
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
      } catch (err) {
        setError("Failed to load clients");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentExercise.name && (currentExercise.repetitions > 0 || currentExercise.time)) {
      setExercises([...exercises, currentExercise]);
      setCurrentExercise({
        name: "",
        description: "",
        sets: 0,
        repetitions: 0,
        time: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) {
      setError("Please select a client");
      return;
    }

    try {
      const token = Cookies.get("token");
      const response = await fetch(
        "https://swafe24fitness.azurewebsites.net/api/WorkoutPrograms",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: workoutProgram.name,
            description: workoutProgram.description,
            clientId: selectedClient.userId,
            personalTrainerId: Number(trainerId),
            exercises: exercises.map(ex => ({
              ...ex,
              personalTrainerId: Number(trainerId)
            }))
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create workout program");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/trainer/see-workouts");
      }, 2000);
    } catch (err) {
      setError("Failed to create workout program");
      console.error(err);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <TrainerNavBar />
      <div className={styles.container}>
        <h1 className={styles.title}>Create Program</h1>
        {loading ? (
          <div className={styles.loadingWrapper}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading clients...</p>
          </div>
        ) : error ? (
          <div className={styles.errorMessage}>
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        ) : clients.length === 0 ? (
          <div className={styles.noClients}>
            <span>👥</span>
            <p>No clients found. Please add clients first.</p>
          </div>
        ) : (
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Program Name</label>
                <input
                  type="text"
                  id="name"
                  value={workoutProgram.name}
                  onChange={(e) =>
                    setWorkoutProgram({ ...workoutProgram, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Program Description</label>
                <input
                  type="text"
                  id="description"
                  value={workoutProgram.description}
                  onChange={(e) =>
                    setWorkoutProgram({
                      ...workoutProgram,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="client">Select Client</label>
                <select
                  id="client"
                  value={selectedClient?.userId || ""}
                  onChange={(e) => {
                    const client = clients.find(
                      (c) => c.userId === Number(e.target.value)
                    );
                    setSelectedClient(client || null);
                  }}
                  required
                >
                  <option value="">Select a client</option>
                  {clients.map((client) => (
                    <option key={client.userId} value={client.userId}>
                      {client.firstName} {client.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.exercisesSection}>
                <h3>Exercises</h3>
                {exercises.map((exercise, index) => (
                  <div key={index} className={styles.exerciseItem}>
                    <p><strong>{exercise.name}</strong></p>
                    <p>{exercise.description}</p>
                    <p>Sets: {exercise.sets}</p>
                    {exercise.repetitions ? (
                      <p>Repetitions: {exercise.repetitions}</p>
                    ) : (
                      <p>Time: {exercise.time}</p>
                    )}
                  </div>
                ))}

                <div className={styles.addExerciseForm}>
                  <h4>Add Exercise</h4>
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      placeholder="Exercise Name"
                      value={currentExercise.name}
                      onChange={(e) =>
                        setCurrentExercise({
                          ...currentExercise,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      placeholder="Description"
                      value={currentExercise.description}
                      onChange={(e) =>
                        setCurrentExercise({
                          ...currentExercise,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <input
                      type="number"
                      placeholder="Sets"
                      value={currentExercise.sets || ""}
                      onChange={(e) =>
                        setCurrentExercise({
                          ...currentExercise,
                          sets: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <input
                      type="number"
                      placeholder="Repetitions"
                      value={currentExercise.repetitions || ""}
                      onChange={(e) =>
                        setCurrentExercise({
                          ...currentExercise,
                          repetitions: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      placeholder="Time (e.g., '30 seconds')"
                      value={currentExercise.time}
                      onChange={(e) =>
                        setCurrentExercise({
                          ...currentExercise,
                          time: e.target.value,
                        })
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddExercise}
                    className={styles.addExerciseButton}
                  >
                    Add Exercise
                  </button>
                </div>
              </div>

              <button type="submit" className={styles.submitButton}>
                Create Program
              </button>

              {error && <div className={styles.error}>{error}</div>}
              {success && (
                <div className={styles.success}>
                  Workout program created successfully!
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(CreateWorkout, "PersonalTrainer");
