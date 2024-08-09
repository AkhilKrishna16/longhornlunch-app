"use client"

import React, { useState, useEffect, useRef } from 'react';
import { debounce } from 'lodash';
import { fetchDatesForDiningHall, fetchDiningHalls, fetchMenuData } from '@/api';

const TestComponent = () => {
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
        setMenuData(menu.menu_items);
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
        const halls = await fetchDiningHalls();
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
          setDates(availableDates);
          if (availableDates.length > 0) {
            setSelectedDate(availableDates[0]);
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

  const renderMenuSections = () => {
    if (isLoading) return <p>Loading menu data...</p>;
    if (!menuData || menuData === 'Unavailable') return <p>No menu data available.</p>;

    return (
      <div>
        {Object.entries(menuData).map(([mealType, sections]) => (
          <div key={mealType}>
            <h3>{mealType}</h3>
            {Object.entries(sections as Record<string, any>).map(([sectionName, items]) => (
              <div key={sectionName}>
                <h4>{sectionName}</h4>
                <ul>
                  {(items as any[]).map((item, index) => (
                    <li key={index}>
                      {item.name} (Votes: {item.vote_count})
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1>API Test Component</h1>
      
      <h2>Dining Halls</h2>
      <select 
        value={selectedDiningHall} 
        onChange={(e) => setSelectedDiningHall(e.target.value)}
      >
        {diningHalls.map((hall) => (
          <option key={hall} value={hall}>{hall}</option>
        ))}
      </select>

      <h2>Available Dates</h2>
      <select 
        value={selectedDate} 
        onChange={(e) => setSelectedDate(e.target.value)}
      >
        {dates.map((date) => (
          <option key={date} value={date}>{date}</option>
        ))}
      </select>

      <h2>Menu Data</h2>
      {renderMenuSections()}
    </div>
  );
};

export default TestComponent;
