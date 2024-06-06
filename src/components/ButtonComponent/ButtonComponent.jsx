import React from 'react'
import './ButtonComponent.scss'

const ButtonComponent = (prop) => {
  const {title} = prop
  
  return (
    <button class="full-rounded">
    <span>{title}</span>
    <div class="border full-rounded"></div></button>
  )
}

export default ButtonComponent