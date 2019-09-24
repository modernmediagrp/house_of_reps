import React from 'react'
import Brands from './Brands'

export default function BrandContainer({
  profiles,
  loading,

}) {
  let brands
  if(!profiles || loading) {
    brands = null
  } else {
    brands = profiles.map(val => (
      val.brands.length > 0 && val.brands !== null 
      ? val.brands.map(brand => ( <Brands key={brand._id} brands={val.brands} brand={brand} />))
      : null 
    ))
  }
  return (
    <div className='certified_brands'>{ brands }</div>
  )
}
