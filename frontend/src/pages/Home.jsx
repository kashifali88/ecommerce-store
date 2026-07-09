import React from 'react'
import CategoryList from '../components/CategoryList'
import HomeSlider from '../components/HomeSlider'
import HorizontalCard from '../components/HorizontalCard'

function Home() {
  return (
    <div className='min-h-screen'>
      <CategoryList />
      <HomeSlider />
      <HorizontalCard category = {"Airpodes"} heading = {"Top's Airpodes"} />
      <HorizontalCard category = {"Earphones"} heading = {"Top's Earphones"} />
      <HorizontalCard category = {"Tv"} heading = {"Popular Tv's"} />
      <HorizontalCard category = {"Watches"} heading = {"Popular Watch's"} />
      <HorizontalCard category = {"Camera"} heading = {"Popular Camera's"} />
    </div>
  )
}

export default Home