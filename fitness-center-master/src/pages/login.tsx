import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/loginstyle.module.css";
import Cookies from "js-cookie";

type UserInfo = {
  Name: string;
  Role: string;
  UserId: string;
  GroupId: string;
  nbf: string;
  exp: string;
};

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const decodeJwt = (token: string): UserInfo | null => {
    try {
      const payloadBase64 = token.split(".")[1];
      if (!payloadBase64) {
        throw new Error("Invalid JWT structure.");
      }
      const payloadJson = atob(payloadBase64);
      const payload: UserInfo = JSON.parse(payloadJson);
      return payload;
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(
        "https://swafe24fitness.azurewebsites.net/api/Users/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const { jwt } = await response.json();
        Cookies.set("token", jwt, { expires: 1, secure: true });

        const userInfo = decodeJwt(jwt);
        if (userInfo) {
          switch (userInfo.Role) {
            case "Manager":
              router.push("manager/managerpage");
              break;
            case "PersonalTrainer":
              router.push("trainer/trainerpage");
              break;
            case "Client":
              router.push("client/clientpage");
              break;
            default:
              setError("Invalid role detected. Please contact support.");
          }
        } else {
          setError("Unable to retrieve user information. Please try again.");
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to login. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Login request failed. Please try again.");
    }
  };

  return (
    <div className={styles["login-body"]}>
      <button onClick={() => router.push('/')} className={styles["back-button"]}>
        ← Back
      </button>
      <div className={styles["login-container"]}>
        <div className={styles["login-header"]}>
          <h1>Fitness Center</h1>
          <h2>Welcome Back</h2>
        </div>
        <form className={styles["login-form"]} onSubmit={handleSubmit}>
          <div className={styles["form-group"]}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <div className={styles["error-message"]}>{error}</div>}
          <button type="submit" className={styles["submit-button"]}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}