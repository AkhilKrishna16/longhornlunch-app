import React from 'react'
import { MenuItem } from './MainLayout'

import MenuVote from './MenuVote'

interface MenuCategoryProps {
  category: string,
  items: MenuItem[]
}

const MenuCategory:React.FC<MenuCategoryProps> = ({ category, items }) => {
  return (
    <div className='menu-category'>
      <h4 className='text-white font-semibold mt-4 text-center'>{category}</h4>
      <ul>
        {items.map((item, index) => (
          <li key={index} className='flex flex-row justify-between items-center mt-3 text-gray-200 mx-3'>
            <p>{item.name}</p>
            <MenuVote id={item.id as number} voteCount={item.votes}/>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MenuCategory