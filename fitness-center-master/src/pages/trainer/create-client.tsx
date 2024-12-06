import React, { useState, useEffect } from "react";
import withAuth from "../../types/auth";
import TrainerNavBar from "../../types/trainernavbar";
import styles from "../../styles/trainer.module.css";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

type CreateClientForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type DecodedToken = {
  UserId: string;
  Role: string;
};

const CreateClient = () => {
  const router = useRouter();
  const [trainerId, setTrainerId] = useState<string>("");
  const [formData, setFormData] = useState<CreateClientForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const decoded = jwtDecode(token) as DecodedToken;
      setTrainerId(decoded.UserId);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const token = Cookies.get("token");
      const response = await fetch(
        "https://swafe24fitness.azurewebsites.net/api/Users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            personalTrainerId: trainerId,
            accountType: "Client"
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create client");
      }

      setSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
      });

      setTimeout(() => {
        router.push("/trainer/see-clients");
      }, 2000);

    } catch (err) {
      setError("Failed to create client. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.pageWrapper}>
      <TrainerNavBar />
      <div className={styles.container}>
        <h1 className={styles.title}>Create New Client</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <div className={styles.error}>{error}</div>}
          {success && (
            <div className={styles.success}>
              Client created successfully! Redirecting...
            </div>
          )}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Client"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default withAuth(CreateClient, "PersonalTrainer");
