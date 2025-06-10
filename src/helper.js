import Cookies from 'universal-cookie';
const cookies = new Cookies();

export const formatDateTime = (dateString) => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24-hour format
  }).replace(",", " |");
};


export const getUserDetails = () => {
  const userInfoCookie = cookies.get("user_info");
  if (!userInfoCookie) return null; // missing cookie
  try {
    return JSON.parse(JSON.stringify(userInfoCookie));
  } catch (error) {
    console.error("Error parsing user_info cookie:", error);
    return null;
  }
};
