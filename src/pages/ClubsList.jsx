import { useEffect, useState } from "react";
import { API_URL } from "../config/api";

import Modal from "../components/Modal";
import ClubCard from "../components/ClubCard";
import AddNewClub from "../components/AddNewClub";
import axios from "axios";

const ClubsList = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  let [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URL}/clubs`)
      .then((response) => {
        setClubs(response.data);
      })
      .catch((error) => {
        console.log("Error Message:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading club details...</div>;
  }

  if (clubs.length === 0) {
    return <div className="text-center py-10">No clubs found!</div>;
  }

  const deleteClub = (id) => {
    setClubs((currentClubs) => currentClubs.filter((club) => club.id !== id));
  };

  return (
    <div className="container max-w-6xl mx-auto py-10 bg-testColor">
      <h1 className="bg-blue-50 p-3 rounded-full border border-blue-100 text-xl uppercase text-blue-800 font-bold text-center mb-10">
        Clubs List ({clubs.length}) -{" "}
        <button onClick={() => setIsOpen(true)}>Add New Club</button>
      </h1>

      <div className="_list-cards grid grid-cols-3 gap-5">
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

export default ClubsList;
