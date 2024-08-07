import React from 'react'

import { MenuItem } from './MainLayout'
import MenuCategory from './MenuCategory'

interface MealTypeProps {
  mealType: string
  categories: {
    [category: string]: MenuItem[]
  }
}

const MealType: React.FC<MealTypeProps> = ({ mealType, categories }) => {
  return (
    <div className='rounded-xl bg-navbar w-4/5 lg:w-1/3 min-h-screen pb-3'>
      <h1 className='text-white text-xl font-bold mt-3 text-center'>{mealType}</h1>
      {Object.keys(categories).map(category => (
        <MenuCategory key={category} category={category} items={categories[category]}/>
      ))}
    </div>
  )
}

export default MealType