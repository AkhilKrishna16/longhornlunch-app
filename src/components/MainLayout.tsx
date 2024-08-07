import React, { useState } from 'react'
import axios from 'axios'
import Image from 'next/image'


import Loading from './Loading'
import MealType from './MealType'

export interface MenuItem {
  category: string,
  id: number, 
  meal_type: string,
  name: string,
  votes: number,
}

interface CategorizedMenu {
  [mealType: string] : {
    [category: string]: MenuItem[]
  }
}



const categorizedMenuData = (menuData: MenuItem[]): CategorizedMenu => {
  return menuData ? menuData.reduce((acc, item) => {
    const { meal_type, category } = item

    if(!acc[meal_type]) {
      acc[meal_type] = {};
    }

    if(!acc[meal_type][category]) {
      acc[meal_type][category] = []
    }

    acc[meal_type][category].push(item)
    return acc
  }, {} as CategorizedMenu) : {} as CategorizedMenu
} 
const MainLayout = ({isLoading, menuData} : {isLoading: boolean, menuData: string | any}) => {

  console.log(menuData)

  const categorizedMenu = categorizedMenuData(menuData)

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-full'>
        <div className="loader"></div> {/* This is where your GSAP animation will be applied */}
      </div>
    );
  }
  if (!menuData || menuData === 'Unavailable' ) {
    return <div className='flex flex-col items-center justify-center h-full text-gray-200'>
      <Image src='/texas-cleared-logo.png' width={128} height={128} alt='Longhorns Logo'/>
      <h2>Sorry, but this is not open! Try again later!</h2>
    </div>
  } 

  return (
    <div className='w-3/4 my-12'>
      <div className='hidden lg:flex flex-row justify-between items-start gap-28 mx-4'>
        {Object.keys(categorizedMenu).map(mealType => (
          <MealType key={mealType} mealType={mealType} categories={categorizedMenu[mealType]}/>
        ))}
      </div>

      <div className='lg:hidden flex flex-col justify-around items-center gap-12'>
        {Object.keys(categorizedMenu).map(mealType => (
          <MealType key={mealType} mealType={mealType} categories={categorizedMenu[mealType]}/>
        ))}
      </div>
    </div>
    
    
  )
}

export default MainLayout