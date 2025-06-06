// src/pages/admin/clubs/Index.jsx
import { API_URL } from "@/config/api";
import { continents } from "@/constants/continents";
import { useAdminUI } from "@/contexts/AdminUIContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import DeleteConfirmModal from "@/components/DeleteConfirmDialog";
import ItemLogo from "@/components/ItemLogo";
import { Button } from "@/components/ui/button";
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
import { FilePenLine, TrashIcon } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

export default function AdminClubsPage() {
  const { setPageTitle } = useAdminUI();
  const [clubs, setClubs] = useState([]);
  const [selectedContinent, setSelectedContinent] = useState("__all__");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [clubToDelete, setClubToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
        setClubs(res.data);
      } catch (err) {
        console.error("Failed to fetch clubs:", err);
      }
    };
    fetchClubs();
  }, [selectedContinent, selectedCountry, search]);

  useEffect(() => {
    if (selectedContinent === "__all__") {
      setClubs([]);
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

  const handleDelete = async () => {
    if (!clubToDelete) return;
    setIsLoading(true);
    try {
      await axios.delete(`${API_URL}/api/clubs/${clubToDelete._id}`);
      setClubs((prev) => prev.filter((c) => c._id !== clubToDelete._id));
      toast.success("Club deleted successfully.");
      setModalOpen(false);
      setClubToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete club.");
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-8 2xl:grid-cols-12">
        {/* Search Box */}
        <Input
          type="text"
          placeholder="Search..."
          className="order-1 md:col-span-2"
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
          <SelectTrigger className="order-3 col-span-1 w-full md:order-2 md:col-span-2">
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
          <Select
            onValueChange={setSelectedCountry}
            value={selectedCountry}
            className="order-4"
          >
            <SelectTrigger className="order-4 col-span-1 w-full capitalize md:col-span-2">
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

        <div className="order-2 flex items-center justify-end md:order-4 md:col-start-8 2xl:col-start-12">
          <Button
            className="w-full md:w-auto"
            onClick={() => navigate("/admin/clubs/new")}
          >
            Add Club
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow className="[&_th]:py-3 [&_th]:font-bold">
            <TableHead>#</TableHead>
            <TableHead className="text-left">Club Name</TableHead>
            <TableHead>Continent</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Actions</TableHead>
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

          {[...clubs]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((club, index) => (
              <TableRow key={club._id || index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell className="capitalize">
                  <div className="flex items-center gap-4">
                    <ItemLogo
                      logoUrl={club.logoUrl}
                      name={club.name}
                      type="club"
                      size={28}
                    />
                    {club.name}
                  </div>
                </TableCell>
                <TableCell className="capitalize">
                  {club.country?.continent}
                </TableCell>
                <TableCell className="capitalize">
                  <ReactCountryFlag
                    countryCode={club.country?.code}
                    style={{
                      width: "18px",
                      height: "16px",
                      borderRadius: "4px",
                    }}
                    svg
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      onClick={() => navigate(`/admin/clubs/${club.slug}`)}
                    >
                      <FilePenLine style={{ width: "18px", height: "18px" }} />
                    </Button>
                    <Button
                      size={"icon"}
                      variant={"ghost"}
                      onClick={() => {
                        setModalOpen(true);
                        setClubToDelete(club);
                      }}
                    >
                      <TrashIcon style={{ width: "18px", height: "18px" }} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

          <DeleteConfirmModal
            open={modalOpen}
            onOpenChange={setModalOpen}
            title={clubToDelete?.name}
            item="club"
            onConfirm={handleDelete}
            isLoading={isLoading}
          />
        </TableBody>
      </Table>
    </div>
  );
}
