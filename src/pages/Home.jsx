import { useEffect, useState } from "react";
import { API_URL } from "../config/api";

import Modal from "../layout/Modal";
import ClubCard from "../components/ClubCard";
import AddNewClub from "../components/AddNewClub";
import axios from "axios";

const HomePage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  let [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/clubs.json`)
      .then((response) => {
        setClubs(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.log("Error Message:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-solid border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (clubs.length === 0) {
    return <div className="py-10 text-center">No clubs found!</div>;
  }

  const deleteClub = (id) => {
    setClubs((currentClubs) => currentClubs.filter((club) => club.id !== id));
  };

  return (
    <div className="container mx-auto max-w-[92%] py-10">
      {/* <h1 className="mb-10 rounded-full border border-blue-100 bg-blue-50 p-3 text-center text-xl font-bold text-blue-800 uppercase">
        Clubs List ({clubs.length}) -{" "}
        <button onClick={() => setIsOpen(true)}>Add New Club</button>
      </h1> */}

      <div className="_list-cards grid grid-cols-6 gap-5">
        {clubs.length === 0 && (
          <p className="col-span-3 flex items-center justify-center text-lg">
            No clubs found!
          </p>
        )}

        {clubs.map((club) => {
          return <ClubCard key={club.id} club={club} deleteClub={deleteClub} />;
        })}
      </div>

      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="Add New Club">
        <AddNewClub clubs={clubs} setClubs={setClubs} setIsOpen={setIsOpen} />
      </Modal>
    </div>
  );
};

export default HomePage;
