import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/api";
import { useAdminUI } from "@/contexts/AdminUIContext";
import { continents } from "@/constants/continents";
import PaginationComponent from "@/components/PaginationComponent";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactCountryFlag from "react-country-flag";

export default function AdminCountriesPage() {
  const { setPageTitle } = useAdminUI();
  const [contries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [continent, setContinent] = useState("__all__");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setPageTitle("Countries List");
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/countries`, {
          params: {
            search,
            page: currentPage,
            continent: continent !== "__all__" ? continent : undefined,
          },
        });
        setCountries(res.data.data);
        setTotalPages(res.data?.pagination?.totalPages) || 1;
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };

    fetchCountries();
  }, [search, currentPage, continent]);

  return (
    <div className="_wrapper">
      <div className="mb-4 grid gap-2 md:grid-cols-10">
        <Input
          type="text"
          placeholder="Search..."
          className="col-span-2 w-full"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
        <Select
          value={continent}
          onValueChange={(value) => {
            setContinent(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="col-span-2 w-full">
            <SelectValue placeholder="Select a continent" />
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
      </div>

      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow className="[&_th]:py-3 [&_th]:font-bold">
            <TableHead>#</TableHead>
            <TableHead className="text-left">Country</TableHead>
            <TableHead>Continent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contries.map((country, index) => (
            <TableRow key={country.id || index}>
              <TableCell>{index + 1}</TableCell>
              <TableCell className="capitalize">
                <div className="flex items-center gap-2">
                  <ReactCountryFlag
                    countryCode={country.code}
                    style={{
                      width: "16px",
                      height: "14px",
                      borderRadius: "4px",
                    }}
                    svg
                  />
                  {country.name}
                </div>
              </TableCell>
              <TableCell className="capitalize">{country.continent}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
