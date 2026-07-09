import React, { useEffect, useState } from "react";
import Banner1 from "../assest/banner/Banner1.png";
import img2 from "../assest/banner/img2.png";
import img3 from "../assest/banner/img3.png";
import img4 from "../assest/banner/img4.png";
import img5 from "../assest/banner/img5.png";

import Banner1_mobile from "../assest/banner/Banner1_mobile.png";
import img2_mobile from "../assest/banner/img2_mobile.png";
import img3_mobile from "../assest/banner/img3_mobile.png";
import img4_mobile from "../assest/banner/img4_mobile.png";
import img5_mobile from "../assest/banner/img5_mobile.png";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";

function HomeSlider() {
  const [currentImage, setCurrentImage] = useState(0);
  

  const desktopImages = [
    img2,
    Banner1,
    img3,
    img4,
    img5,
  ];

  const mobileImages = [
      img2_mobile,
    Banner1_mobile,
    img3_mobile,
    img4_mobile,
    img5_mobile,
  ];


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === desktopImages.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

 

  return (
    <div className="container mx-auto rounded overflow-hidden">
      <div className="relative w-full h-72 md:h-86">
        
        {/* Desktop */}
        <img
          src={desktopImages[currentImage]}
          alt="banner"
          className="hidden md:block w-full h-full"
        />

        {/* Mobile */}
        <img
          src={mobileImages[currentImage]}
          alt="banner"
          className="block md:hidden w-full h-full"
        />
        <div className="absolute top-1/2 left-0 right-0 flex justify-between -translate-y-1/2 px-4">
        <button  className="bg-white p-2 rounded-full shadow">
            <FaChevronLeft />
        </button>
        <button  className="bg-white rounded-full p-2 shadow">
            <FaChevronRight />
        </button>
        </div>

         {/* DOTS */}
      <div className="absolute bottom-3  left-1/2 -translate-x-1/2 flex gap-2">
        {desktopImages.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300
              ${currentImage === index ? "bg-black scale-125" : "bg-white/60"}
            `}
          />
        ))}

      </div>
      </div>
    </div>
  );
}

export default HomeSlider;