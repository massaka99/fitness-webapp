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

type WithAuthProps = {
  [key: string]: unknown;
};

const withAuth = <P extends WithAuthProps>(
  WrappedComponent: React.ComponentType<P>,
  requiredRole: string
) => {
  const WithAuthComponent: React.FC<P> = (props) => {
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

  // Add display name
  WithAuthComponent.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

  return WithAuthComponent;
};

// Helper function to get component display name
function getDisplayName<P>(WrappedComponent: React.ComponentType<P>): string {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuth;