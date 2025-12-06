import React, { useEffect, useState } from "react";
import Phonecard from "../card/Phonecard";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Recommend = () => {
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

  const recommendedPhones = phones.filter(phone => phone.recommend === true);

  if (loading) {
    return <div className="py-16 text-center text-[#536471]">Loading...</div>;
  }

  return (
    <div className="py-10 px-6 bg-[#f5f7fa] rounded-xl mx-4 mb-12">
      <div className="flex justify-between items-center mb-6">
        <div className="text-2xl font-bold text-[#0f1419] flex items-center gap-2">
          Recommended for you
          <span className="bg-[#dcfce7] text-[#166534] px-3 py-1 rounded-full text-xs font-semibold">HOT</span>
        </div>
        <Link to="/phones" className="text-[#536471] hover:text-[#667eea] cursor-pointer transition-colors font-medium">
          See More →
        </Link>
      </div>

      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        navigation={true}
        breakpoints={{
          640: { slidesPerView: 1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 40 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper !pb-10"
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