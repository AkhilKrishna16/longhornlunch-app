"use client"

import DateSelector from "@/components/DateSelector";
import MainLayout from "@/components/MainLayout";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import { useClearLocalStorageAtMidnight } from "@/clearLocalStorage";

import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { debounce } from 'lodash'
import { fetchDatesForDiningHall, fetchDiningHalls, fetchMenuData } from "@/api";


export default function Home() {
  useClearLocalStorageAtMidnight()
  
  const [diningHalls, setDiningHalls] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [menuData, setMenuData] = useState<any>(null);
  const [selectedDiningHall, setSelectedDiningHall] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const debouncedFetchMenu = useRef(
    debounce(async (hall: string, date: string) => {
      setIsLoading(true);
      try {
        const menu = await fetchMenuData(hall, date);
        console.log(menu)
        setMenuData(menu);
      } catch (error) {
        console.error('Error fetching menu data:', error);
        setMenuData(null);
      } finally {
        setIsLoading(false);
      }
    }, 300)
  ).current;

  useEffect(() => {
    const fetchDiningHallsData = async () => {
      try {
        const halls = await fetchDiningHalls() as string[]
        console.log(halls)
        setDiningHalls(halls);
        if (halls.length > 0) {
          setSelectedDiningHall(halls[0]);
        }
      } catch (error) {
        console.error("Error fetching dining halls:", error);
      }
    };
    fetchDiningHallsData();
  }, []);

  useEffect(() => {
    const fetchDatesData = async () => {
      if (selectedDiningHall) {
        setIsLoading(true);
        try {
          const availableDates = await fetchDatesForDiningHall(selectedDiningHall);

          const sortedDates = availableDates.sort((a: string, b: string) => {
            const dateA = new Date(Date.parse(a.replace(/^\w+,\s/, '')));
            const dateB = new Date(Date.parse(b.replace(/^\w+,\s/, '')));
            return dateA.getTime() - dateB.getTime();
          });

          setDates(sortedDates);
          if (sortedDates.length > 0) {
            setSelectedDate(sortedDates[0]);
          }
        } catch (error) {
          console.error("Error fetching dates:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchDatesData();
  }, [selectedDiningHall]);

  useEffect(() => {
    if (selectedDiningHall && selectedDate) {
      debouncedFetchMenu(selectedDiningHall, selectedDate);
    }
  }, [selectedDiningHall, selectedDate, debouncedFetchMenu]);

  return (
    
    <main className="flex flex-col min-h-screen">
      <Navbar diningHalls={diningHalls} selectedDiningHall={selectedDiningHall} onDiningHallsChange={setSelectedDiningHall} />
      <div className="relative top-[96px] md:top-[80px] flex flex-col items-center justify-center">
        <div className='flex flex-row w-full justify-center max-w-7xl px-4 items-center'>
          <div className="flex-1"></div> 
          <div className="flex-1 flex justify-center">
            <DateSelector dates={dates} selectedDate={selectedDate} onDateChange={setSelectedDate}/>
          </div>
          <div className="flex-1 flex justify-end">
            
          </div>
        </div>
          <MainLayout isLoading={isLoading} menuData={menuData}/> 
      </div>
    </main>
  );
}
