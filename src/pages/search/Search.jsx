import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Phonecard from "../card/Phonecard";
import config from '../../config';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.toLowerCase() || "";
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${config.baseURL}/api/phones`)
      .then((res) => res.json())
      .then((data) => {
        setPhones(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredPhones = phones.filter((phone) =>
    phone.name.toLowerCase().includes(query)
  );

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="py-12 px-6 max-w-screen-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Search Results for "<span className="text-[#667eea]">{query}</span>"
      </h1>
      
      {filteredPhones.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPhones.map((phone) => (
            <div key={phone._id} className="h-96">
                <Phonecard phone={phone} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500 text-xl">
          No phones found matching your search.
        </div>
      )}
    </div>
  );
};

export default Search;