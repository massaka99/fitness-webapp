import React, { useEffect, useState } from "react";
import withAuth from "../../types/auth";
import TrainerNavBar from "../../types/trainernavbar";
import styles from "../../styles/SeeClient.module.css";
import Cookies from "js-cookie";

type Client = {
  id: string;
  name: string;
  email: string;
};

const SeeClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = Cookies.get("token");
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

  return (
    <div className={styles.pageWrapper}>
      <TrainerNavBar />
      <div className={styles.container}>
        <h1 className={styles.title}>My Clients</h1>
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
            <p>No clients found.</p>
          </div>
        ) : (
          <div className={styles.clientsGrid}>
            {clients.map((client) => (
              <div key={client.id} className={styles.clientCard}>
                <div className={styles.clientInfo}>
                  <h2>{client.name}</h2>
                  <p className={styles.clientEmail}>{client.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(SeeClients, "PersonalTrainer");
