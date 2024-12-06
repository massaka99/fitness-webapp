import React, { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

type UserInfo = {
  Name: string;
  Role: string;
  UserId: string;
  GroupId: string;
  nbf: string;
  exp: string;
};

const withAuth = (WrappedComponent: React.ComponentType, requiredRole: string) => {
  return (props: any) => {
    const router = useRouter();

    useEffect(() => {
      const token = Cookies.get("token");

      if (!token) {
        router.replace("/login"); 
        return;
      }

      try {
        const userInfo: UserInfo = jwtDecode(token);

        if (userInfo.Role !== requiredRole) {
          router.replace("/login"); 
          return;
        }

        if (Date.now() >= parseInt(userInfo.exp) * 1000) {
          Cookies.remove("token");
          router.replace("/login"); 
          return;
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        Cookies.remove("token");
        router.replace("/login"); 
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;