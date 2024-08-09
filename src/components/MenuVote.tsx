"use client"

import React, { useState, useRef, useEffect } from 'react'
import { ArrowBigUp, ArrowBigDown } from 'lucide-react'
import { gsap } from 'gsap'

import { handleDownvote, handleUpvote } from '@/api'


const MenuVote = ({voteCount, id }: {voteCount: number, id: number }) => {
  const [value, setValue] = useState(voteCount);
  const [voteStatus, setVoteStatus] = useState<'upvoted' | 'downvoted' | 'none'>('none')
  const valueRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(valueRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.25 });
  }, [value]);

  const getVoteStatusFromLocalStorage = (itemId: number) => {
    const voteStatus = localStorage.getItem(`voteStatus_${itemId}`)
    return voteStatus ? JSON.parse(voteStatus) : null
  }
  
  const setVoteStatusToLocalStorage = (itemId: number, status: 'upvoted' | 'downvoted' | null) => {
    localStorage.setItem(`voteStatus_${itemId}`, JSON.stringify(status));
  }

  useEffect(() => {
    // Check local storage for vote status on component mount
    const status = getVoteStatusFromLocalStorage(id);
    if (status) {
      setVoteStatus(status);
    }
  }, [id]);

  const handleLocalUpvote = async () => {
    console.log(id)
    if(voteStatus === 'upvoted') {
      const newValue = await handleDownvote(id)
      setValue(newValue)
      setVoteStatus('none')
      setVoteStatusToLocalStorage(id, null);
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
      setVoteStatusToLocalStorage(id, 'upvoted')
    }
   }

   const handleLocalDownvote = async () => {
    console.log(id)
      if(voteStatus === 'downvoted') {
        const newValue = await handleUpvote(id)
        setValue(newValue)
        setVoteStatus('none')
        setVoteStatusToLocalStorage(id, null);
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
        setVoteStatusToLocalStorage(id, 'downvoted')
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

      <button onClick={handleLocalDownvote} className={`${voteStatus === 'downvoted' ? 'text-red-500' : ''} ${voteStatus !== 'downvoted' ? 'hover:text-red-300' : ''} transition duration-200` }>
        <ArrowBigDown />
      </button>
    </div>
  )
}

export default MenuVote
