import React from 'react'
import {ChartLine, CircleUserRound} from 'lucide-react'

const Home = () => {

  return (
    <div className='flex items-center justify-center text-black'>
      <h1 className='font-bebas text-4xl font-bold px-10'>Saints & Songs</h1>
      <div><select className='bg-gray-200 border border-gray-300 rounded-md p-2 cursor-pointer'>
      <option value="1">Select Generation</option>
      <option value="2">Baby Boomer</option>
      <option value="3">Generation X</option>
      <option value="4">Millennial</option>
      <option value="5">Generation Z</option>
      <option value="6">Generation Alpha</option>
    </select></div>
    <form>
        <input type="text" placeholder="Search" className='bg-gray-200 border border-gray-300 rounded-full' />
    </form>

    <div>
        <CircleUserRound />
        <ChartLine />

    </div>



    </div>
  )
}

export default Home
