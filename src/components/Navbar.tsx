"use client";

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect, useRef } from 'react'

import { fetchDiningHalls } from '@/api';

import gsap from 'gsap'
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


const DINING_HALLS = [
  // "Jester City Limits (JCL)",
  "Cypress Bend Cafe",
  "Littlefield Patio Cafe",
  "J2 Dining",
  "Jester City Market",
  "Jesta' Pizza"
]

const Navbar = ({ diningHalls, selectedDiningHall, onDiningHallsChange}: {diningHalls: string[], selectedDiningHall: string, onDiningHallsChange: (hall: string) => void}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<SVGSVGElement>(null);;

  
  useEffect(() => {
    if (isOpen) {
      gsap.to(buttonRef.current, { duration: 0.5, rotate: 180, ease: 'bounce.out' });
    } else {
      gsap.to(buttonRef.current, { duration: 0, rotate: 0, ease: 'power1.in' });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDiningHallClick = (hall: string) => {
    scrollToTop();
    onDiningHallsChange(hall);
    setIsOpen(false); // Close the menu on selection
  };

  return (
    <div className='fixed top-0 left-0 w-full z-50'>
      <nav className='bg-navbar shadow-md'>
        <div className='container mx-auto px-6 py-3 flex justify-between items-center'>
          <div className='flex items-center'>
            {/* <button onClick={() => {
                onDiningHallsChange(diningHalls[0])
                window.scrollTo({top: 0, behavior: 'smooth'})
              }}>
              <div className='w-24 md:w-20'>
                <Image src='/texas-cleared-logo.png' alt='Texas Logo' width={100} height={100} />
              </div>
            </button> */}
          </div>

          <div className='hidden md:flex flex-grow items-center justify-center pl-4'>
            <div className='flex space-x-2 md:space-x-6'>
              {diningHalls.map((hall, index) => (
                <button
                  key={hall}  
                  onClick={() => {handleDiningHallClick(hall)}}
                  className={`sm:text-sm md:text-[14px] lg:text-[18px] text-ellipsis text-gray-500 hover:text-gray-200 transition duration-300 font-semibold focus:text-gray-200 cursor-pointer ${hall === selectedDiningHall ? 'text-gray-200' : 'text-gray-500'}`}
                >
                  {hall}
                </button>
              ))}
            </div>

            
          </div>
          
          <div className='hidden md:flex flex-row gap-2'>
            <div className='text-gray-200 rounded-xl bg-custom px-4 py-2'>
              <HoverCard>
                <HoverCardTrigger className='cursor-default'>Note</HoverCardTrigger>
                <HoverCardContent className='mt-4 bg-navbar border-none text-gray-200'>
                  Dining halls or dates may be missing due to them closing for the scheduled week or date.
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
          

          <div className='flex items-center md:hidden'>
            <button
              onClick={() => setIsOpen(!isOpen)}
              type='button'
              className='text-gray-400 hover:text-gray-200 focus:outline-none focus:text-gray-400 focus:hover:text-gray-200 transition duration-100'
              aria-label='toggle menu'
            >
              <svg viewBox='0 0 24 24' className='w-6 h-6 fill-current' ref={buttonRef}>
                {isOpen ? (
                  <CloseIcon />
                ) : (
                  <MenuIcon />
                )}
              </svg>
            </button>
          </div>
          {isOpen && (
            <div className='fixed top-16 right-6 gap-6 bg-black shadow-lg rounded-lg p-6 z-50'>
              <div className='flex flex-col items-start'>
                {diningHalls.map((hall, index) => (
                  <Link
                    key={hall}
                    href='/'
                    className={`text-gray-400 font-semibold hover:text-gray-200 transition duration-300 ${
                      hall === selectedDiningHall ? 'text-gray-200' : 'text-gray-400'
                    }`}
                    onClick={() => {handleDiningHallClick(hall)}}
                  >
                    {hall}
                    
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className='fixed bottom-4 right-4 shadow-md'>
        <div className='text-gray-200 rounded-xl bg-navbar px-4 py-2'>
          <HoverCard>
            <HoverCardTrigger className='cursor-default'>Feedback</HoverCardTrigger>
            <HoverCardContent className='mt-4 bg-navbar border-none text-gray-200 mb-4 w-24'>
              <form action="mailto:longhornlunch@gmail.com" method='GET'>
                <input type="submit" placeholder='Send email' className='bg-navbar text-gray-200 outline-none text-center w-full'/>
              </form>
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
    </div>
  );
};

export default Navbar;