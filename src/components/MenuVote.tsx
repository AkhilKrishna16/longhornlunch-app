"use client"

import React, { useState, useRef, useEffect } from 'react'
import { ArrowBigUp, ArrowBigDown } from 'lucide-react'
import { gsap } from 'gsap'

import { handleDownvote, handleUpvote } from '@/api'


const MenuVote = ({voteCount, id}: {voteCount: number, id: number}) => {
  const [value, setValue] = useState(voteCount);
  const [voteStatus, setVoteStatus] = useState<'upvoted' | 'downvoted' | 'none'>('none')
  const valueRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(valueRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25 });
  }, [value]);

  const handleLocalUpvote = async () => {
    if(voteStatus === 'upvoted') {
      const newValue = await handleDownvote(id)
      console.log(newValue)
      setValue(newValue)
      setVoteStatus('none')
    } else {
      if(voteStatus === 'downvoted') {
        var newValue = await handleUpvote(id)
        newValue = await handleUpvote(id)
        setValue(newValue)
      } else {
        var newValue = await handleUpvote(id)
        setValue(newValue)
      }
      setVoteStatus('upvoted')
    }
   }

   const handleLocalDownvote = async () => {
      if(voteStatus === 'downvoted') {
        const newValue = await handleUpvote(id)
        setValue(newValue)
        setVoteStatus('none')
      } else {
        if(voteStatus === 'upvoted') {
          var newValue = await handleDownvote(id)
          newValue = await handleDownvote(id)
          setValue(newValue)
        } else {
          var newValue = await handleDownvote(id)
          setValue(newValue)
        }

        setVoteStatus('downvoted')
      }
   }

  return (
    <div className='flex flex-row justify-center items-center gap-0.5'>
      <button onClick={handleLocalUpvote} className={`${voteStatus === 'upvoted' ? 'text-green-500' : ''} ${voteStatus !== 'upvoted' ? 'hover:text-green-300' : ''} transition duration-200`}>
        <ArrowBigUp />
      </button>

      <p ref={valueRef}>
        {value}
      </p>

      <button onClick={handleLocalDownvote} className={`${voteStatus === 'downvoted' ? 'text-red-500' : ''} ${voteStatus !== 'downvoted' ? 'hover:text-red-300' : ''} transition duration-200`}>
        <ArrowBigDown />
      </button>
    </div>
  )
}

export default MenuVote
