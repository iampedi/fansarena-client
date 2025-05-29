// src/pages/HomeSliderComponent.jsx
import { useNavigate } from "react-router-dom";
// UI Imports
import slide01 from "@/assets/images/home-page-slider-01.webp";

const HomeSlider = () => {
  const navigate = useNavigate();

  return (
    <div className="relative mb-8 h-auto overflow-hidden md:mb-10 md:h-[420px] 2xl:h-[600px]">
      <div
        className="bg-star absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${slide01})` }}
      />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-10 container mx-auto flex h-full flex-col items-center justify-center gap-4 p-10 text-white 2xl:px-0">
        <h2 className="text-[54px] leading-none font-black drop-shadow-md drop-shadow-black/30 md:text-6xl">
          Stand with your club!
        </h2>
        <p className="text-2xl font-bold md:text-3xl">
          Join FANS ARENA, where football fans unite.
        </p>
        <button
          className="btn btn-primary mt-4 cursor-pointer rounded-md border-2 border-stone-600 bg-black/80 px-8 py-2.5 text-lg font-bold text-stone-300 duration-300 hover:border-gray-300 hover:text-white"
          onClick={() => navigate("/auth/signup")}
        >
          Join Now
        </button>
      </div>
    </div>
  );
};

export default HomeSlider;
