import React, { useEffect, useState } from "react";
import Phonecard from "../card/Phonecard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Recommend = () => {
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

  const recommendedPhones = phones.filter(phone => phone.recommend === true);

  if (loading) return null;

  return (
    <div className="py-10 px-6 bg-[#f5f7fa] rounded-xl mx-4 mb-12 border border-white shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-[#0f1419] flex items-center gap-2">
          Recommended for you
          <span className="bg-[#dcfce7] text-[#166534] px-3 py-1 rounded-full text-xs font-semibold">HOT</span>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={24}
        slidesPerView={1.2}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2.2 },
          768: { slidesPerView: 3.2 },
          1024: { slidesPerView: 4 },
        }}
        className="pb-10"
      >
        {recommendedPhones.map((phone) => (
          <SwiperSlide key={phone._id}>
            <Phonecard phone={phone} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Recommend;