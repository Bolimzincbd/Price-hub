import React, { useEffect, useState } from "react";
import Phonecard from "../card/Phonecard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const categories = ["iphone", "samsung", "oneplus"];

const AllBrand = () => {
  const [phones, setPhones] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("iphone");
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

  const filteredPhones = phones.filter(
    (phone) => phone.category === selectedCategory.toLowerCase()
  );

  if (loading) {
    return <div className="py-16 text-center text-[#536471]">Loading...</div>;
  }

  return (
    <div className="py-10 px-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-[#0f1419]">Browse by Brand</h2>

        <div className="flex gap-3 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 capitalize ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white shadow-md"
                  : "bg-transparent text-[#536471] hover:bg-gray-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredPhones.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-[#536471] text-lg">No phones found in this category</p>
        </div>
      ) : (
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          navigation={true}
          breakpoints={{
            640: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 40 },
            1024: { slidesPerView: 3, spaceBetween: 40 },
          }}
          modules={[Pagination, Navigation]}
          className="mySwiper !pb-12"
        >
          {filteredPhones.map((phone) => (
            <SwiperSlide key={phone._id}>
              <Phonecard phone={phone} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default AllBrand;