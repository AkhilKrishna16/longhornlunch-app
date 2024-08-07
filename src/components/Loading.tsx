"use client";

import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

const Loading = () => {
  const circleRef = useRef<SVGCircleElement>(null)

  useEffect(() => {
    const circle = circleRef.current
    if (circle) {
      gsap.to(circle, {
        rotation: 360, 
        duration: 0.5, 
        repeat: -1,
        ease: 'linear'

      })
    }
  }, [])

  return (
    <div className="flex justify-center items-center h-full">
      <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle
          ref={circleRef}
          cx="50"
          cy="50"
          r="40"
          stroke="#3498db"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="251.2"
          strokeDashoffset="0"
        />
      </svg>
    </div>
  )
}

export default Loading