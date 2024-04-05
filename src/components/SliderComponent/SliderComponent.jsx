import { Image } from "antd";
import React from "react";
import Slider from "react-slick";


const SliderComponent = ({arrImg}) => {
    const settings = {
        infinite: true,
        speed: 600,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000
    };
    return (
        <Slider {...settings}>
            {arrImg.map((img, index) => {
                return (
                    <Image key={index} src={img} alt="slider" preview={false} object-fit="cover"/>
                )
            })}
        </Slider>
    )
}

export default SliderComponent;