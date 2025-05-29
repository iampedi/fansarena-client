// src/pages/Leaderboard.jsx
import { API_URL } from "@/config/api";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useContext, useEffect, useState } from "react";

import Loader from "@/components/Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";
import {
  ArrowDownWideNarrowIcon,
  ArrowUpDownIcon,
  ArrowUpWideNarrowIcon,
  CalendarDaysIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeft,
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeIcon,
  MapPinIcon,
  Medal,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const LeaderboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState([]);
  const { user } = useContext(AuthContext);
  const favoriteClub = user?.favoriteClub;

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
        <Link
          to={`/clubs/${row.original.slug}`}
          className="flex min-w-[200px] items-center gap-3 capitalize hover:underline md:w-fit md:min-w-fit"
        >
          <img
            src={row.original.logoUrl}
            alt={row.original.name}
            className="w-8"
          />
          {row.original.name}
        </Link>
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
  const TableData = ({ columns, data, favoriteClub }) => {
    const [sorting, setSorting] = useState([{ id: "trophies", desc: true }]);
    const [pagination, setPagination] = useState({
      pageIndex: 0,
      pageSize: 10,
    });

    const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      state: { sorting, pagination },
      onSortingChange: setSorting,
      onPaginationChange: setPagination,
    });

    return (
      <>
        <Table className="mx-auto max-w-4xl whitespace-nowrap">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <TableHead className="flex items-center justify-center px-2.5">
                  <Medal />
                </TableHead>
                {headerGroup.headers.map((header, i) => (
                  <TableHead
                    key={i}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer px-2.5"
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
            {table.getRowModel().rows.map((row, index) => {
              const isFavorite = row.original.slug === favoriteClub;

              return (
                <TableRow
                  key={row.id}
                  className={cn(
                    isFavorite &&
                      "bg-yellow-100/60 font-bold text-yellow-700 hover:bg-yellow-100/90",
                  )}
                >
                  <TableCell className="text-muted-foreground px-2.5 text-center text-sm">
                    {pagination.pageIndex * pagination.pageSize + index + 1}
                  </TableCell>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="h-12 px-2.5" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination controls */}
        <div className="mt-5 flex justify-center gap-2">
          {/* <Button
            size="icon"
            variant="outline"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronFirstIcon />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon />
          </Button> */}

          {/* Page Numbers */}
          {[...Array(table.getPageCount()).keys()].map((page) => (
            <Button
              key={page}
              variant="outline"
              onClick={() => table.setPageIndex(page)}
              className={cn(
                "px-2.5",
                table.getState().pagination.pageIndex === page
                  ? "border-gray-500 font-bold"
                  : "",
              )}
              aria-current={
                table.getState().pagination.pageIndex === page
                  ? "page"
                  : undefined
              }
            >
              {page + 1}
            </Button>
          ))}

          {/* <Button
            size="icon"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronLastIcon />
          </Button> */}
        </div>
      </>
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 2xl:px-0">
      <div className="_page-title mb-8 flex flex-col items-center gap-2">
        <h1 className="md:text-3x text-2xl font-bold">Club Leaderboard</h1>
        <p className="text-lg">
          Is your club missing from the top ten?
          <br />
          Support your team, and change the game!
        </p>
      </div>
      <TableData columns={columns} data={clubs} favoriteClub={favoriteClub} />
    </div>
  );
};

export default LeaderboardPage;
