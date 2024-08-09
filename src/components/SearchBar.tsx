"use client";

import React from 'react'

interface SearchBarProps {
  searchQuery: string,
  onSearchChange: (query: string) => void
}


const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value)
  }

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