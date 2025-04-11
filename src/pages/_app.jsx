import "../styles/globals.css";
import { useState, useEffect } from "react";
import { BACKEND_HOSTNAME } from "../commons/development_config";
import axios from "axios";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch user authentication status
  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_HOSTNAME}/api/auth/protected`,
        {
          withCredentials: true,
        }
      );
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    }
  };

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} user={user} setUser={setUser} />
    </SessionProvider>
  );
}

export default MyApp;
