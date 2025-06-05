"use client";
import { useLayoutEffect, useState } from "react";
import Cookies from "js-cookie";
import http from "@/app/http-common";
import { API_CONSTANTS } from "@/app/services/api.route";

const useSessionCheck = () => {
  const [sessionInitialized, setSessionInitialized] = useState(false);

  useLayoutEffect(() => {
    const initializeSession = async () => {
      try {
        // Read cookies from the client using js-cookie
        const deviceId = Cookies.get("ip");
        const sessionId = Cookies.get("id");
        const tokenId = Cookies.get("tokenId");

        console.log("Initial Cookie Values:");
        console.log("Device ID:", deviceId);
        console.log("Session ID:", sessionId);
        console.log("Token ID:", tokenId);

        if (tokenId) return; // Token already exists, no need to fetch a new one

        const response = await http.get(API_CONSTANTS.CART_BEFORE_LOGIN.GENERATE_TOKEN, {
          headers: {
            Authorization: `Bearer ${tokenId || ""}`,
          },
          withCredentials: true,
        });

        console.log("Full API Response:", response);

        const data = response.data || {};
        console.log("API Response Data:", data);

        const { deviceId: newDeviceId, sessionId: newSessionId, tokenId: newTokenId } = data;

        if (newDeviceId && newSessionId && newTokenId) {
          // Set cookies using js-cookie
          Cookies.set("ip", newDeviceId, { expires: 2, secure: true, sameSite: "Strict" });
          Cookies.set("id", newSessionId, { expires: 2, secure: true, sameSite: "Strict" });
          Cookies.set("tokenId", newTokenId, { expires: 2, secure: true, sameSite: "Strict" });

          console.log("Updated Cookie Values:");
          console.log("Device ID:", Cookies.get("ip"));
          console.log("Session ID:", Cookies.get("id"));
          console.log("Token ID:", Cookies.get("tokenId"));

          setSessionInitialized(true);
        } else {
          console.error("Invalid response data received for session generation:", response.data);
        }
      } catch (error) {
      }
    };

    if (!sessionInitialized) {
      initializeSession();
    }
  }, [sessionInitialized]);

  return sessionInitialized;
};

export default useSessionCheck;
