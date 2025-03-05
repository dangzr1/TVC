import React from "react";
import { Link } from "react-router-dom";
import { Camera, Music, Utensils, Building, Flower, Cake } from "lucide-react";

const VendorCategories = () => {
  const categories = [
    {
      name: "Photography",
      icon: <Camera className="h-8 w-8" />,
      color: "bg-blue-50 text-blue-600",
      link: "/vendors/photography",
    },
    {
      name: "Venues",
      icon: <Building className="h-8 w-8" />,
      color: "bg-purple-50 text-purple-600",
      link: "/vendors/venues",
    },
    {
      name: "Catering",
      icon: <Utensils className="h-8 w-8" />,
      color: "bg-amber-50 text-amber-600",
      link: "/vendors/catering",
    },
    {
      name: "Florists",
      icon: <Flower className="h-8 w-8" />,
      color: "bg-pink-50 text-pink-600",
      link: "/vendors/florists",
    },
    {
      name: "Music",
      icon: <Music className="h-8 w-8" />,
      color: "bg-green-50 text-green-600",
      link: "/vendors/music",
    },
    {
      name: "Cakes",
      icon: <Cake className="h-8 w-8" />,
      color: "bg-red-50 text-red-600",
      link: "/vendors/cakes",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category, index) => (
        <Link
          key={index}
          to={category.link}
          className="flex flex-col items-center p-6 rounded-xl hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm border border-white/50 hover:border-teal-300/50 group hover:-translate-y-1"
        >
          <div
            className={`${category.color} p-4 rounded-full mb-3 transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-lg`}
          >
            {category.icon}
          </div>
          <span className="font-medium">{category.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default VendorCategories;
