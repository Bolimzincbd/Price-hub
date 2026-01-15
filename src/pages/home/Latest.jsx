import React, { useEffect, useState } from "react";
import Phonecard from "../card/Phonecard";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; // Only Navigation needed
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "swiper/css";

const Latest = () => {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/phones")
      .then((res) => res.json())
      .then((data) => {
        setPhones(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading phones:", error);
        setLoading(false);
      });
  }, []);

  const latestPhones = phones.filter(phone => phone.latest === true);

  if (loading) return <div className="py-16 text-center text-[#536471]">Loading...</div>;

  return (
    <div className="py-10 px-6 relative group"> {/* group for hover effect */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-[#0f1419] flex items-center gap-2">
          Latest Products 
          <span className="bg-[#dbeafe] text-[#1e40af] px-3 py-1 rounded-full text-xs font-semibold">NEW</span>
        </div>
        <Link to="/phones" className="text-[#536471] hover:text-[#667eea] cursor-pointer transition-colors font-medium">
          View All →
        </Link>
      </div>

      {latestPhones.length === 0 ? (
        <p className="text-center text-[#536471]">No latest phones found</p>
      ) : (
        <div className="relative">
            {/* Custom Previous Button */}
            <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:block hover:bg-white text-[#667eea] cursor-pointer">
                <FaChevronLeft />
            </button>

            {/* Custom Next Button */}
            <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hidden md:block hover:bg-white text-[#667eea] cursor-pointer">
                <FaChevronRight />
            </button>

            <Swiper
                slidesPerView={1}
                spaceBetween={30}
                // Connect custom buttons here
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                breakpoints={{
                    640: { slidesPerView: 1, spaceBetween: 20 },
                    768: { slidesPerView: 2, spaceBetween: 40 },
                    1024: { slidesPerView: 3, spaceBetween: 30 },
                    1280: { slidesPerView: 4, spaceBetween: 30 },
                }}
                modules={[Navigation]}
                className="mySwiper !pb-4 !px-2"
            >
                {latestPhones.map((phone) => (
                    <SwiperSlide key={phone._id}>
                        <Phonecard phone={phone} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
      )}
    </div>
  );
};

export default Latest;