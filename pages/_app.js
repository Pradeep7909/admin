import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/global.css";
import "../public/assets/css/style.css";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import DashboardLayout from "../src/components/Layout";
import LoadingBar from "react-top-loading-bar";
import Head from "next/head";
import Router from "next/router";
import APIService from "../src/api/API";
import Cookies from "universal-cookie";

const api = new APIService();
const cookies = new Cookies();

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingUserDetails, setLoadingUserDetails] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Fetch user details on first load
    const token = cookies.get("user_token");
    if (token) {
      console.log('🟢 getAdminDetails called');
      api.getAdminDetails()
        .then((response) => {
          const adminDetails = JSON.stringify(response.admin);
          // Update user info cookie
          cookies.set("user_info", adminDetails, {
            path: "/",
            secure: true,
            sameSite: "Strict",
          });
        })
        .catch((error) => {
          console.error("Error fetching user details", error);
        })
        .finally(() => {
          setLoadingUserDetails(false);
        });
    }else{
      setLoadingUserDetails(false);
    }


    const handleRouteChangeStart = () => setProgress(30);
    const handleRouteChangeComplete = () => setProgress(100);
    const handleRouteChangeError = () => setProgress(100);

    Router.events.on("routeChangeStart", handleRouteChangeStart);
    Router.events.on("routeChangeComplete", handleRouteChangeComplete);
    Router.events.on("routeChangeError", handleRouteChangeError);

    return () => {
      Router.events.off("routeChangeStart", handleRouteChangeStart);
      Router.events.off("routeChangeComplete", handleRouteChangeComplete);
      Router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, []);

  // Define routes that should NOT use the layout
  const noLayoutRoutes = ["/login", "/404"];
  const useLayout = !noLayoutRoutes.includes(router.pathname);


  return (
    <>
      <Head>
        <title>Clubby - Admin</title>
      </Head>
      <LoadingBar progress={progress} color="#5C64E7" height={4} onLoaderFinished={() => setProgress(0)} />

      {
        loadingUserDetails || !mounted ? (
          // Show loading screen if data is still loading or component is not mounted
          <div className="initial-loading">
            <div className="custom-spinner"></div>
          </div>
        ) : (
          // Render the actual content if user details are loaded and component is mounted
          useLayout ? (
            <DashboardLayout>
              <Component {...pageProps} userDetails={userDetails} />
            </DashboardLayout>
          ) : (
            <Component {...pageProps} userDetails={userDetails} />
          )
        )
      }

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default MyApp;
