import React from 'react'

import SliderComponent from '../SliderComponent/SliderComponent'
import slider1 from '../../assets/images/slider/slider01.webp'
import slider2 from '../../assets/images/slider/slider02.webp'
import slider3 from '../../assets/images/slider/slider03.webp'
import slider4 from '../../assets/images/slider/slider04.webp'

import FeatureComponent from '../FeatureComponent/FeatureComponent'

const Sliders = ({ isShowFeature }) => {
    return (
        <>
            <div className="header__banner">
              <SliderComponent arrImg={[slider1, slider2, slider3, slider4]}/>
            </div>
            {isShowFeature && 
                <div className="header__features" style={{marginTop: '20px'}}>
                    <div className="container">
                        <FeatureComponent />
                    </div>
                </div>
            }
        </>
    )
}

export default Sliders