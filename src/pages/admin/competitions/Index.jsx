// src/pages/admin/competitions/Index.jsx
import { API_URL } from "@/config/api";
import { continents } from "@/constants/continents";
import { useAdminUI } from "@/contexts/AdminUIContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import ItemLogo from "@/components/ItemLogo";
import DeleteConfirmModal from "@/components/DeleteConfirmDialog";
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

export default function AdminCompetitionsPage() {
  const { setPageTitle } = useAdminUI();
  const [competitions, setCompetitions] = useState([]);
  const [level, setLevel] = useState("__all__");
  const [selectedContinent, setSelectedContinent] = useState("__all__");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [competitionToDelete, setCompetitionToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPageTitle("Competitions List");
  }, [setPageTitle]);

  useEffect(() => {
    if (location.state?.success) {
      toast.success(location.state.success);
      window.history.replaceState({}, document.title, "/admin/competitions");
    }
  }, [location.state]);

  useEffect(() => {
    // Get competitions
    const fetchCompetitions = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/competitions`, {
          params: {
            level: level !== "__all__" ? level : undefined,
            continent:
              selectedContinent !== "__all__" ? selectedContinent : undefined,
            country: selectedCountry !== "" ? selectedCountry : undefined,
            search,
          },
        });
        setCompetitions(res.data);
      } catch (err) {
        console.error("Failed to fetch competitions:", err);
      }
    };
    fetchCompetitions();
  }, [level, selectedContinent, selectedCountry, search]);

  useEffect(() => {
    if (selectedContinent === "__all__") {
      setCompetitions([]);
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

  // Delete Competition
  const handleDelete = async () => {
    if (!competitionToDelete) return;
    setIsLoading(true);
    try {
      await axios.delete(
        `${API_URL}/api/competitions/${competitionToDelete._id}`,
      );
      setCompetitions((prev) =>
        prev.filter((c) => c._id !== competitionToDelete._id),
      );
      toast.success("Competition Deleted Successfully.");
      setModalOpen(false);
      setCompetitionToDelete(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete competition.");
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="mb-4 grid gap-2 md:grid-cols-10 2xl:grid-cols-12">
        {/* Search Box */}
        <Input
          type="text"
          placeholder="Search..."
          className="col-span-2"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />

        {/* Select Level */}
        <Select
          value={level}
          onValueChange={(value) => {
            setLevel(value);
          }}
        >
          <SelectTrigger className="col-span-2 w-full">
            <SelectValue placeholder="Select Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="__all__">All Levels</SelectItem>
              <SelectItem value="domestic">Domestic</SelectItem>
              <SelectItem value="continental">Continental</SelectItem>
              <SelectItem value="global">Global</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

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
          <SelectTrigger className="col-span-2 w-full">
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
            <SelectTrigger className="col-span-2 w-full capitalize">
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

        <div className="col-span-2 flex flex-1 items-center justify-end md:col-start-9 2xl:col-start-11">
          <Button onClick={() => navigate("/admin/competitions/new")} className="w-full md:w-auto"
            >
            Add Competition
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow className="[&_th]:py-3 [&_th]:font-bold">
            <TableHead>#</TableHead>
            <TableHead className="text-left">Title</TableHead>
            <TableHead>Level</TableHead>
            <TableHead>Country</TableHead>
            <TableHead>Continent</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {competitions.length === 0 && (
            <TableRow>
              <TableCell></TableCell>
              <TableCell>No competitions found.</TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          )}

          {competitions.map((competition, index) => (
            <TableRow key={competition._id || index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-4">
                  <ItemLogo
                    logoUrl={`/images/competitions/${competition.slug}-symbol.webp`}
                    name={competition.name}
                    type="competition"
                    size={26}
                  />
                  {competition.name}
                </div>
              </TableCell>
              <TableCell className="capitalize">{competition.level}</TableCell>
              <TableCell className="capitalize">
                {competition.country ? competition.country.name : "---"}
              </TableCell>
              <TableCell className="capitalize">
                {competition.country
                  ? competition.country.continent
                  : competition.continent
                    ? competition.continent
                    : "---"}
              </TableCell>
              <TableCell>
                <div>
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    onClick={() =>
                      navigate(`/admin/competitions/${competition.slug}`)
                    }
                  >
                    <FilePenLine style={{ width: "18px", height: "18px" }} />
                  </Button>
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    onClick={() => {
                      setModalOpen(true);
                      setCompetitionToDelete(competition);
                    }}
                  >
                    <TrashIcon style={{ width: "18px", height: "18px" }} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <DeleteConfirmModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title={competitionToDelete?.name}
          item="competition"
          onConfirm={handleDelete}
          isLoading={isLoading}
        />
      </Table>
    </div>
  );
}
