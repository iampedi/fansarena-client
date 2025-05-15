import { useState } from "react";

const AddNewClub = (props) => {
  const [formData, setFormData] = useState({
    name: "",
    founded: "",
    country: "",
    city: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const maxId = props.clubs.reduce((acc, club) => {
      return acc > club.id ? acc : club.id;
    }, 0);

    const newId = maxId + 1;

    const newClub = {
      id: newId,
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s/g, "-"),
      founded: formData.founded,
      country: formData.country,
      city: formData.city,
    };

    setFormData({
      name: "",
      founded: "",
      country: "",
      city: "",
    });

    props.setClubs((currentClubs) => [...currentClubs, newClub]);
    props.setIsOpen(false);
  };

  return (
    <div className="_add-new">
      <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
        <div className="item">
          <label htmlFor="name">Club Name</label>
          <input
            required
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div className="item">
          <label htmlFor="founded">Founded Year</label>
          <input
            required
            id="founded"
            type="text"
            value={formData.founded}
            onChange={(e) =>
              setFormData({ ...formData, founded: e.target.value })
            }
          />
        </div>
        <div className="item">
          <label htmlFor="country">Country</label>
          <input
            required
            id="country"
            type="text"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
          />
        </div>
        <div className="item">
          <label htmlFor="city">City</label>
          <input
            required
            id="city"
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>
        <button type="submit">Add New Club</button>
      </form>
    </div>
  );
};

export default AddNewClub;
