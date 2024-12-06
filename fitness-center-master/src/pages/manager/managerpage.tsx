import Cookies from "js-cookie";
import withAuth from "../../types/auth";;
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "../../styles/manager.module.css";

type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  accountType: string;
};

const ManagerPage = () => {
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    accountType: "PersonalTrainer",
  });
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = Cookies.get("token");
      const response = await fetch("https://swafe24fitness.azurewebsites.net/api/Users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Personal Trainer created successfully!");
        setError("");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          accountType: "PersonalTrainer",
        });
      } else {
        const errorData = await response.json();
        setMessage("");
        setError(`Error: ${errorData.message || response.statusText}`);
      }
    } catch (err) {
      setMessage("");
      setError(`Error: ${(err as Error).message}`);
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  return (
    <div className={styles.pageWrapper}>
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <span className={styles.logo}>Fitness Manager</span>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formField}>
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className={styles.inputField}
              />
            </div>
            <div className={styles.formField}>
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className={styles.inputField}
              />
            </div>
            <div className={styles.formField}>
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className={styles.inputField}
              />
            </div>
            <div className={styles.formField}>
              <label>Password:</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className={styles.inputField}
              />
            </div>
            <button type="submit" className={styles.submitButton}>
              Create Personal Trainer
            </button>
          </form>
          {message && <p className={styles.message}>{message}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default withAuth(ManagerPage, "Manager");