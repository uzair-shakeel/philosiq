import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import authConfig from "../lib/auth-config";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  // Add options for NextAuth SessionProvider
  const sessionOptions = {
    refetchInterval: 5 * 60, // Refetch session every 5 minutes
    refetchOnWindowFocus: true,
    storeInSessionStorage: typeof window !== "undefined" ? true : false, // Enable sessionStorage for better cross-domain support
  };

  return (
    <SessionProvider session={session} options={sessionOptions}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
