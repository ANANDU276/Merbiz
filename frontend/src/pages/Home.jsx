import React from 'react'
import Hero from '../sections/home/Hero'
import ProductsShowcase from '../sections/home/ProductsShowcase'
import Features from '../sections/home/Features'
import PopularCategories from '../sections/home/PopularCategories'
import FAQ from '../sections/home/Faq'

function Home() {
  return (
    <div className='bg-gray-50'>
      <Hero/>
      <ProductsShowcase/>
      <Features/>
      <PopularCategories/>
      <FAQ/>
    </div>
  )
}

export default Home
