import React, { useEffect, useState } from "react";
import Phonecard from "../card/Phonecard";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { Pagination, Navigation } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Latest = () => {
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("phones.json")
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

  if (loading) {
    return <div className="py-16 text-center text-[#536471]">Loading...</div>;
  }

  return (
    <div className="py-10 px-6">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-[#0f1419] flex items-center gap-2">
          Latest Products 
          <span className="bg-[#dbeafe] text-[#1e40af] px-3 py-1 rounded-full text-xs font-semibold">NEW</span>
        </div>
        <div className="text-[#536471] hover:text-[#667eea] cursor-pointer transition-colors font-medium">
          View All →
        </div>
      </div>

      {latestPhones.length === 0 ? (
        <p className="text-center text-[#536471]">
          No latest phones found
        </p>
      ) : (
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          navigation={true}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 40 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
            1280: { slidesPerView: 4, spaceBetween: 30 },
          }}
          modules={[Pagination, Navigation]}
          className="mySwiper !pb-10"
        >
          {latestPhones.map((phone) => (
            <SwiperSlide key={phone._id}>
              <Phonecard phone={phone} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default Latest;