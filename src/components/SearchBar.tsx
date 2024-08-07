"use client";

import React from 'react'


const SearchBar = () => {

  return (
    <div className='hidden lg:flex flex-row justify-end'>
      <div className='rounded-xl bg-navbar px-6 py-3 flex flex-row justify-center items-center gap-4 ml-5'>
        <div className=''>
         🔍
        </div>
        
        <input type="text" placeholder='Find your favorites 😋' className='bg-navbar text-gray-200 outline-none' onChange={() => {}}/>
      </div>
    </div>
  )
}

export default SearchBar