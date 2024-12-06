import React, { useState } from "react";

type UserInfo = {
  Name: string;
  Role: string;
  UserId: string;
  GroupId: string;
  nbf: string;
  exp: string;
};

export default function JwtDecoder() {
  const [jwt, setJwt] = useState<string>("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

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

  const handleDecode = () => {
    const decodedInfo = decodeJwt(jwt);
    setUserInfo(decodedInfo);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>JWT Decoder</h2>
      <div>
        <label>
          Enter JWT:
          <input
            type="text"
            value={jwt}
            onChange={(e) => setJwt(e.target.value)}
            style={{ width: "100%", marginTop: "10px", marginBottom: "10px" }}
          />
        </label>
      </div>
      <button onClick={handleDecode}>Decode</button>

      {userInfo && (
        <div style={{ marginTop: "20px" }}>
          <h3>Decoded Information:</h3>
          <p><strong>Name:</strong> {userInfo.Name}</p>
          <p><strong>Role:</strong> {userInfo.Role}</p>
          <p><strong>UserId:</strong> {userInfo.UserId}</p>
          <p><strong>GroupId:</strong> {userInfo.GroupId}</p>
          <p><strong>Not Before (nbf):</strong> {userInfo.nbf}</p>
          <p><strong>Expiry (exp):</strong> {userInfo.exp}</p>
        </div>
      )}
    </div>
  );
}