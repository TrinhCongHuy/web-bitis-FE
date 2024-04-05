import { Image } from "antd";
import React from "react";
import Slider from "react-slick";
import './BrandComponent.scss'


const BrandComponent = ({arrImg}) => {
    const settings = {
        infinite: true,
        speed: 600,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
    };
    return (
        <Slider {...settings}>
            {arrImg.map((img, index) => {
                return (
                    <div className="brand__img" key={index}>
                        <Image className="img" src={img} alt="slider" preview={false} height="100px" object-fit="cover"/>
                    </div>
                )
            })}
        </Slider>
    )
}

export default BrandComponent;