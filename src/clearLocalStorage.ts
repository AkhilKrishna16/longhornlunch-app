"use client";

import { useEffect } from 'react';

const useClearLocalStorageAtMidnight = () => {
  useEffect(() => {
    const clearLocalStorage = () => {
      localStorage.clear();
      console.log("Local storage cleared at", new Date().toLocaleTimeString());
    };

    const getTimeUntilMidnight = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);

      return midnight.getTime() - now.getTime();
    };

    if (getTimeUntilMidnight() <= 0) {
      clearLocalStorage();
    }

    const intervalId = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        clearLocalStorage();
      }
    }, 60000); 

    return () => {
      clearInterval(intervalId);
    };
  }, []);
};

export default useClearLocalStorageAtMidnight;
