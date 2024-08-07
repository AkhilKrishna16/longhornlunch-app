"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const DesktopDateSelector = ({dates, selectedDate, onDateChange}: {dates: string[], selectedDate: string, onDateChange: (date: string) => void}) => {
  const buttonRefs = useRef<HTMLButtonElement[]>([]);
  const fillRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    buttonRefs.current = buttonRefs.current.slice(0, dates.length);
    fillRefs.current = fillRefs.current.slice(0, dates.length);
  }, [dates]);

  const handleMouseEnter = (index: number) => {
    if (fillRefs.current[index]) {
      gsap.to(fillRefs.current[index], {
        duration: .7,
        scaleX: 1,
        ease: "power2.out",
      });
      gsap.to(buttonRefs.current[index], {
        duration: .7,
        scale: 1.1,
        ease: "power2.out",
        backgroundColor: "#212121", // Change this to your desired hover color
        color: "#212121", // Change this to your desired text color on hover
      });
    }
  };

  const handleMouseLeave = (index: number) => {
    if (fillRefs.current[index]) {
      gsap.to(fillRefs.current[index], {
        duration: .7,
        scaleX: 0,
        ease: "power2.in",
      });
      gsap.to(buttonRefs.current[index], {
        duration: .7,
        scale: 1,
        ease: "power2.in",
        backgroundColor: "#212121", // Change this back to your original background color
        color: "#edecf0", // Change this back to your original text color
      });
    }
  };

  return (
    <div className='hidden lg:flex space-x-6'>
      {dates.map((date, index) => (
        
        <button
          key={index}
          className={`px-4 py-2 rounded relative overflow-hidden font-semibold ${
            date === selectedDate ? 'bg-gray-200 text-navbar' : 'bg-navbar text-gray-200'
          }`}

          ref={el => { buttonRefs.current[index] = el!; }}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
          onClick={() => {onDateChange(date)}}
        >
          <div
            ref={el => { fillRefs.current[index] = el!; }}
            className={`absolute inset-0 bg-gray-200 transform origin-left ${
              date === selectedDate ? 'scale-x-100' : 'scale-x-0'
            }`}
          ></div>
          <span className="relative z-10">{date}</span>
        </button>
      ))}
    </div>
  );
}

export default DesktopDateSelector;