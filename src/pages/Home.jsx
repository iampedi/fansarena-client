// src/pages/Home.jsx
import ClubsListPage from "./clubs/Index";
import HomeSlider from "./HomeSliderComponent";

const HomePage = () => {
  return (
    <>
      <HomeSlider />
      <ClubsListPage />
    </>
  );
};

export default HomePage;
