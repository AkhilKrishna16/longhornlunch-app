"use client";

import React, { useRef, useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import DesktopDateSelector from './DesktopDateSelector'

const DateSelector = ({dates, selectedDate, onDateChange}: {dates: string[], selectedDate: string, onDateChange: (date: string) => void}) => {

  return (
    <div className='flex flex-col md:flex-row justify-center items-center w-full'>
      
      <DesktopDateSelector dates={dates} selectedDate={selectedDate} onDateChange={onDateChange} />
    </div>

    
  )
}

export default DateSelector
