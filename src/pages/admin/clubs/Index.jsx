// src/pages/admin/clubs/Index.jsx
import NewClubButton from "@/components/NewClubButton";
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
import { API_URL } from "@/config/api";
import { continents } from "@/constants/continents";
import { useAdminUI } from "@/contexts/AdminUIContext";
import axios from "axios";
import { useEffect, useState } from "react";

export default function AdminClubsPage() {
  const { setPageTitle } = useAdminUI();
  const [clubs, setclubs] = useState([]);

  useEffect(() => {
    setPageTitle("Clubs List");
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get(`${API_URL}/clubs`);
        setclubs(res.data);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };
    fetchCities();
  }, []);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {/* Search Box */}
        <Input type="text" placeholder="Search..." className="w-auto" />

        {/* Select Continent */}
        <Select>
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
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem></SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="flex flex-1 items-center justify-end">
          <NewClubButton />
        </div>
      </div>

      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow className="[&_th]:py-3 [&_th]:font-bold">
            <TableHead>#</TableHead>
            <TableHead>Club Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clubs.map((club, index) => (
            <TableRow key={club._id || index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{club.name}</TableCell>
            </TableRow>
          ))}
          {console.log(clubs)}
        </TableBody>
      </Table>
    </div>
  );
}
