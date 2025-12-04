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

  // ✅ Fixed: Changed setPhones to selectedCategory
  const filteredPhones =
    selectedCategory === "Phone finder"
      ? phones
      : phones.filter(
          (phone) => phone.category === selectedCategory.toLowerCase()
        );

  console.log(filteredPhones);

  if (loading) {
    return <div className="py-16 text-center">Loading...</div>;
  }

  return (
    <div className="py-16">
      <h2 className="text-3xl font-semibold mb-6">Recommended for you</h2>

      {/* Optional: Category filter buttons */}
      <div className="mb-6 flex gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {filteredPhones.length === 0 ? (
        <p className="text-center text-gray-600">
          No phones found in this category
        </p>
      ) : (
        <Swiper
          slidesPerView={1}
          spaceBetween={30}
          navigation={true}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 2,
              spaceBetween: 50,
            },
            1180: {
              slidesPerView: 3,
              spaceBetween: 50,
            },
          }}
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          {filteredPhones.map((phone, index) => {
            return (
              <SwiperSlide key={index}>
                <Phonecard phone={phone} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
};

export default AllBrand;
