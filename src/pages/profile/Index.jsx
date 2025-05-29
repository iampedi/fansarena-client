// src/pages/profile/Index.jsx
import { API_URL } from "@/config/api";
import { continents } from "@/constants/continents";
import { AuthContext } from "@/contexts/AuthContext";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
// UI Imports
import { Button } from "@/components/ui/button";
import { ShieldAlertIcon, UserRoundCheckIcon } from "lucide-react";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user, isLoading, authenticateUser } = useContext(AuthContext);
  const [countries, setCountries] = useState([]);
  const [isInitialSet, setIsInitialSet] = useState(false);
  const [clubs, setClubs] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.message) {
      setTimeout(() => {
        toast.success(location.state.message);
        window.history.replaceState({}, document.title, "/profile");
      }, 100);
    }
  }, [location.state]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      gender: "",
      continent: "",
      country: "",
      city: "",
      favoriteClub: "",
    },
  });

  useEffect(() => {
    if (user && clubs.length > 0) {
      reset({
        name: user.name || "",
        gender: user.gender || "",
        email: user.email || "",
        continent: user.continent || "",
        country: "",
        city: user.city || "",
        favoriteClub: user.favoriteClub || "",
      });
      setIsInitialSet(false);
    }
  }, [user, clubs, reset]);

  const watchedContinent = watch("continent");
  useEffect(() => {
    if (!watchedContinent) {
      setCountries([]);
      return;
    }
    const fetchCountries = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/countries`, {
          params: { continent: watchedContinent, limit: 300 },
        });
        setCountries(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
        setCountries([]);
      }
    };
    fetchCountries();
  }, [watchedContinent]);

  useEffect(() => {
    if (user && user.country && countries.length > 0 && !isInitialSet) {
      const found = countries.some((c) => c.name === user.country);
      if (found) {
        setValue("country", user.country);
      } else {
        setValue("country", "");
      }
      setIsInitialSet(true);
    }
  }, [user, countries, setValue, isInitialSet]);

  useEffect(() => {
    const country = watch("country");
    if (country && countries.length > 0) {
      const found = countries.some((c) => c.name === country);
      if (!found) {
        setValue("country", "");
      }
    }
  }, [countries, setValue, watch]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/clubs`);
        setClubs(res.data);
      } catch (err) {
        console.error("Failed to fetch clubs:", err);
      }
    };
    fetchClubs();
  }, []);

  /* ---------- UPDATE USER ---------- */
  const onSubmit = async (data) => {
    console.log(user._id);

    try {
      console.log("Data: ", data);
      await axios.put(`${API_URL}/api/users/${user._id}`, data);
      toast.success("User Updated Successfully");
      authenticateUser();
      navigate("/leaderboard");
    } catch (err) {
      toast.error("Failed to update user");
      console.error("🔥 UPDATE USER ERROR:", err);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/auth/signin" replace />;
  }

  return (
    <div className="mx-auto max-w-2xl px-5 2xl:px-0">
      <div className="_alert-demo mb-8 flex flex-col gap-2 rounded-lg border border-yellow-400 bg-yellow-50 px-5 py-4 text-yellow-700">
        <p>
          This is a demo version built for portfolio purposes. To review my
          implementation skills in detail, you can also access the admin
          dashboard using the credentials below.
        </p>
        <p>
          <strong>Email:</strong> email@example.com,
          <br />
          <strong>Password:</strong> password
        </p>
      </div>
      <div className="_page-title mb-8 flex flex-col gap-2">
        <h1 className="md:text-3x flex items-center gap-2 text-2xl font-bold">
          <UserRoundCheckIcon className="size-6" /> User Profile
        </h1>
        <p className="text-lg">
          Complete your profile to select and support your favorite club. See
          your team climb the leaderboard with your support!
        </p>
        <h2 className="mt-4 flex items-center gap-2 font-bold text-gray-500">
          <ShieldAlertIcon className="size-5" /> Why do we need your info?
        </h2>
        <p className="text-sm text-gray-600">
          We ask for geographic and demographic info only for statistics. Your
          name helps us address you personally in our communications.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="tmp-form mx-auto max-w-md space-y-4 rounded-xl border-2 border-gray-200/50 bg-gray-50/80 p-5 md:p-8"
      >
        <div className="grid gap-2 md:grid-cols-3">
          {/* Name */}
          <div className="md:col-span-2">
            <label>Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label>Gender</label>
            <select {...register("gender")} required>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* email */}
        <div>
          <label>Email</label>
          <input
            type="email"
            {...register("email", { required: true })}
            disabled
          />
        </div>

        {/* Continent */}
        <div>
          <label>Continent</label>
          <select {...register("continent")} required>
            <option value="">Select</option>
            {continents.map((c, i) => (
              <option key={i} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Country */}
        <div>
          <label>Country</label>
          <select
            className="capitalize"
            {...register("country")}
            disabled={countries.length === 0}
            required
          >
            <option value="">Select</option>
            {countries.map((c) => (
              <option key={c._id} value={c.name} className="capitalize">
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label>City</label>
          <input
            type="text"
            {...register("city")}
            placeholder="Enter your city"
            required
          />
        </div>

        {/* Favourite Club */}
        <div>
          <label>Your Favourite Club</label>
          <select
            className="capitalize"
            {...register("favoriteClub")}
            disabled={clubs.length === 0}
            required
          >
            <option value="">Select</option>
            {clubs
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((c) => (
                <option key={c._id} value={c.slug} className="capitalize">
                  {c.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={"outline"}
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Submit"}
          </Button>
        </div>
      </form>

      {/* <div>
        <Button
          size={"lg"}
          variant="link"
          className="mx-auto mt-4 flex"
          asChild
        >
          <Link to={"/"} className="text-red-500">
            Delete your account
          </Link>
        </Button>
      </div> */}
    </div>
  );
};

export default ProfilePage;
