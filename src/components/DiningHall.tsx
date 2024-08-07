"use client";

import React from 'react'

const DiningHall = ({index, value}: {index: number, value: string}) => {
  return (
    <button key={index} onClick={() => {}} className='text-gray-400 font-medium text-xs md:text-sm lg:text-lg hover:text-white transition-all duration-300'>
            {value}
          </button>
  )
}

export default DiningHall