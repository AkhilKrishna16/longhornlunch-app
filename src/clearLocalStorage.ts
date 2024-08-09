"use client";

import { useEffect } from 'react';

export const useClearLocalStorageAtMidnight = () => {
  useEffect(() => {
    const clearLocalStorageAtMidnight = () => {
      const now = new Date();
      const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, 
        0, 
        1, 
        0 
      );
      
      const msUntilMidnight = night.getTime() - now.getTime();
      
      setTimeout(() => {
        localStorage.clear();
        console.log('Local storage cleared at', new Date().toLocaleString());
        
        setInterval(clearLocalStorageAtMidnight, 24 * 60 * 60 * 1000);
      }, msUntilMidnight);
    };

    clearLocalStorageAtMidnight();

    return () => {
      const intervalId = setInterval(clearLocalStorageAtMidnight, 24 * 60 * 60 * 1000);
      clearInterval(intervalId);
    };
  }, []);
};
