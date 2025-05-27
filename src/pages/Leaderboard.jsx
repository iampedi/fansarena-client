// src/pages/Leaderboard.jsx
import { API_URL } from "@/config/api";
import axios from "axios";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDownWideNarrowIcon,
  ArrowUpDownIcon,
  ArrowUpWideNarrowIcon,
  CalendarDaysIcon,
  GlobeIcon,
  MapPinIcon,
  Medal,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import Loader from "@/components/Loader";

const LeaderboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState([]);

  /* ---------- Fetch clubs ---------- */
  useEffect(() => {
    const fetchClubs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/clubs`);
        setClubs(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch clubs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  /* ---------- Table columns ---------- */
  const columns = [
    {
      accessorKey: "name",
      header: () => "Club Name",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-3 capitalize">
          <img
            src={row.original.logoUrl}
            alt={row.original.name}
            className="w-6"
          />
          {row.original.name}
        </div>
      ),
    },
    {
      accessorKey: "trophies",
      header: () => <TrophyIcon />,
      enableSorting: true,
    },
    {
      accessorKey: "fans",
      header: () => <UsersIcon />,
      enableSorting: true,
    },
    {
      accessorKey: "founded",
      header: () => <CalendarDaysIcon />,
      enableSorting: true,
    },
    {
      accessorKey: "country.code",
      header: () => <MapPinIcon />,
      enableSorting: false,
      cell: ({ row }) => (
        <ReactCountryFlag
          countryCode={row.original.country.code}
          style={{
            width: "20px",
            height: "16px",
            borderRadius: "3px",
          }}
          svg
        />
      ),
    },
    {
      accessorKey: "country.continent",
      header: () => <GlobeIcon />,
      enableSorting: false,
      cell: ({ row }) => (
        <span className="capitalize">{row.original.country.continent}</span>
      ),
    },
  ];

  /* ---------- Table data ---------- */
  const TableData = ({ columns, data }) => {
    const [sorting, setSorting] = useState([]);

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      state: { sorting },
      onSortingChange: setSorting,
    });

    return (
      <Table className="mx-auto max-w-4xl">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              <TableHead className="flex items-center justify-center">
                <Medal />
              </TableHead>
              {headerGroup.headers.map((header, i) => (
                <TableHead
                  key={i}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer"
                >
                  <div
                    className={cn(
                      "flex w-fit items-center gap-1",
                      i === 0 ? "" : "mx-auto",
                    )}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    {header.column.getIsSorted() === "asc" ? (
                      <ArrowUpWideNarrowIcon className="text-muted-foreground h-4 w-4" />
                    ) : header.column.getIsSorted() === "desc" ? (
                      <ArrowDownWideNarrowIcon className="text-muted-foreground h-4 w-4" />
                    ) : header.column.getCanSort() ? (
                      <ArrowUpDownIcon className="text-muted-foreground h-4 w-4" />
                    ) : null}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell className="text-muted-foreground text-center text-sm">
                {index + 1}
              </TableCell>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="3xl:px-0 container mx-auto px-4 md:py-5">
      <TableData columns={columns} data={clubs} />
    </div>
  );
};

export default LeaderboardPage;
