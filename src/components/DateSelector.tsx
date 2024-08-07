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
    <div className='flex flex-row justify-center items-center lg:w-full'>
      <div className='lg:hidden'>
        <Carousel>
          <CarouselContent className='flex justify-center items-center'>
            {dates.map((date, index) => {
              return <CarouselItem key={index} className='flex justify-center items-center h-full'>
                <div className=' bg-navbar text-white font-semibold'>
                  {date}
                </div>
              </CarouselItem>
            })}
            
          </CarouselContent>
          <CarouselPrevious className=''/>
          <CarouselNext className=''/>
        </Carousel>
      </div>
      <DesktopDateSelector dates={dates} selectedDate={selectedDate} onDateChange={onDateChange} />
    </div>

    
  )
}

export default DateSelector
