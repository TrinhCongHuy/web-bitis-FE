import React, { Fragment } from 'react'

import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/slider/slider01.webp'
import slider2 from '../../assets/images/slider/slider02.webp'
import slider3 from '../../assets/images/slider/slider03.webp'
import slider4 from '../../assets/images/slider/slider04.webp'

import brand1 from '../../assets/images/brand/brand1.png'
import brand2 from '../../assets/images/brand/brand2.png'
import brand3 from '../../assets/images/brand/brand3.png'
import brand4 from '../../assets/images/brand/brand4.png'
import brand5 from '../../assets/images/brand/brand5.png'
import brand6 from '../../assets/images/brand/brand6.png'
import brand7 from '../../assets/images/brand/brand7.png'
import BrandComponent from '../../components/BrandComponent/BrandComponent'

const Sliders = () => {
    return (
        <>
            <div className="header__banner">
              <SliderComponent arrImg={[slider1, slider2, slider3, slider4]}/>
            </div>
            <div className="header__brand">
                <div className="container">
                    <BrandComponent arrImg={[brand1, brand2, brand3, brand4, brand5, brand6, brand7]}/>
                </div>
            </div>
        </>
    )
}

export default Sliders