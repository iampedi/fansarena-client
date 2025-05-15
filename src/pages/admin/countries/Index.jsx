import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "@/config/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import PaginationComponent from "@/components/PaginationComponent";

export default function AdminCountriesPage() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 15;

  useEffect(() => {
    axios
      .get(`${API_URL}/countries`)
      .then((res) => {
        setCountries(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("خطا در دریافت لیست کشورها:", err);
        setError("دریافت اطلاعات با خطا مواجه شد");
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(countries.length / itemsPerPage);

  const paginatedCountries = countries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">لیست کشورها</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Country Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCountries.map((country, index) => (
            <TableRow key={country.id || index}>
              <TableCell>
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>{country.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
