"use client";

import { useEffect } from 'react';

export const useClearLocalStorageAtMidnight = () => {
  useEffect(() => {
    const clearLocalStorageAtMidnight = () => {
      localStorage.clear();
      console.log('Local storage cleared at', new Date().toLocaleString());
      window.location.reload();
    };

    const scheduleNextClear = () => {
      const now = new Date();
      const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, 
        1, 
        0, 
        0 
      );
      
      const msUntilMidnight = night.getTime() - now.getTime();
      
      return setTimeout(() => {
        clearLocalStorageAtMidnight();
        scheduleNextClear();
      }, msUntilMidnight);
    };

    const timeoutId = scheduleNextClear();

    return () => clearTimeout(timeoutId);
  }, []);
};