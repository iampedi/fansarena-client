// src/pages/admin/clubs/Index.jsx
import NewClubButton from "@/components/NewClubButton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API_URL } from "@/config/api";
import { continents } from "@/constants/continents";
import { useAdminUI } from "@/contexts/AdminUIContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";

export default function AdminClubsPage() {
  const { setPageTitle } = useAdminUI();
  const [clubs, setclubs] = useState([]);
  const [selectedContinent, setSelectedContinent] = useState("__all__");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [search, setSearch] = useState("");
  const location = useLocation();

  useEffect(() => {
    setPageTitle("Clubs List");
  }, [setPageTitle]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("created")) {
      toast.success("Club created successfully!");
    }
  }, [location.search]);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/clubs`, {
          params: {
            continent:
              selectedContinent !== "__all__" ? selectedContinent : undefined,
            country: selectedCountry !== "" ? selectedCountry : undefined,
            search,
          },
        });
        setclubs(res.data);
      } catch (err) {
        console.error("Failed to fetch clubs:", err);
      }
    };
    fetchClubs();
  }, [selectedContinent, selectedCountry, search]);

  useEffect(() => {
    if (selectedContinent === "__all__") {
      setclubs([]);
      return;
    }

    const fetchCountries = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/countries`, {
          params: {
            continent: selectedContinent,
            limit: 300,
          },
        });
        setCountries(res.data.data);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };
    fetchCountries();
  }, [selectedContinent]);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {/* Search Box */}
        <Input
          type="text"
          placeholder="Search..."
          className="w-auto"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />

        {/* Select Continent */}
        <Select
          value={selectedContinent}
          onValueChange={(value) => {
            setSelectedContinent(value);
            setSelectedCountry("");
            if (value === "__all__") {
              setCountries([]);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Continent" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="__all__">All Continents</SelectItem>
              {continents.map((continent) => (
                <SelectItem key={continent.value} value={continent.value}>
                  {continent.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Select Country */}
        {selectedContinent !== "__all__" && (
          <Select onValueChange={setSelectedCountry} value={selectedCountry}>
            <SelectTrigger className="w-[180px] capitalize">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {countries.map((country) => (
                  <SelectItem
                    key={country._id}
                    value={country._id}
                    className="capitalize"
                  >
                    {country.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        <div className="flex flex-1 items-center justify-end">
          <NewClubButton />
        </div>
      </div>

      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow className="[&_th]:py-3 [&_th]:font-bold">
            <TableHead>#</TableHead>
            <TableHead>Logo</TableHead>
            <TableHead>Club Name</TableHead>
            <TableHead>Continent</TableHead>
            <TableHead>Country</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clubs.length === 0 && (
            <TableRow>
              <TableCell></TableCell>
              <TableCell>No clubs found.</TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          )}

          {clubs.map((club, index) => (
            <TableRow key={club._id || index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <img src={club.logoUrl} className="w-5" />
              </TableCell>
              <TableCell className="capitalize">{club.name}</TableCell>
              <TableCell className="capitalize">
                {club.country?.continent}
              </TableCell>
              <TableCell className="capitalize">{club.country?.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
