import { useEffect, useReducer } from "react";
import axios from "axios";
import { API_URL } from "@/config/api";
import { continents } from "@/constants/continents";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PaginationComponent from "@/components/PaginationComponent";

const initialState = {
  selectedContinent: "__all__",
  countries: [],
  selectedCountry: "",
  currentPage: 1,
  totalPages: 1,
  cities: [],
  search: "",
  loading: false,
  error: null,
  mode: "search", // "search" | "country"
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_SEARCH_MODE":
      return {
        ...state,
        mode: "search",
        selectedContinent: "__all__",
        selectedCountry: "",
        search: "",
        currentPage: 1,
        cities: [],
      };
    case "SET_SEARCH":
      return {
        ...state,
        search: action.payload,
        mode: "search",
        selectedCountry: "",
        currentPage: 1,
      };
    case "SET_CONTINENT":
      return {
        ...state,
        selectedContinent: action.payload,
        selectedCountry: "",
        cities: [],
        mode: "country",
        currentPage: 1,
      };
    case "SET_COUNTRY":
      return {
        ...state,
        selectedCountry: action.payload,
        search: "",
        currentPage: 1,
      };
    case "SET_CITIES":
      return { ...state, cities: action.payload };
    case "SET_COUNTRIES":
      return { ...state, countries: action.payload };
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.payload };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export default function AdminCitiesPage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const filteredCountries = state.countries.filter(
    (country) => country.continent === state.selectedContinent,
  );

  useEffect(() => {
    axios
      .get(`${API_URL}/countries`)
      .then((res) => dispatch({ type: "SET_COUNTRIES", payload: res.data }))
      .catch((err) => console.error("Failed to fetch countries:", err));
  }, []);

  useEffect(() => {
    if (state.mode !== "search") return;

    if (state.search.trim().length < 3) {
      dispatch({ type: "SET_CITIES", payload: [] });
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    dispatch({ type: "SET_LOADING", payload: true });

    const delay = setTimeout(() => {
      axios
        .get(`${API_URL}/cities`, {
          params: {
            search: state.search,
            page: 1,
            limit: 10,
          },
        })
        .then((res) => {
          dispatch({ type: "SET_CITIES", payload: res.data.data });
          dispatch({ type: "SET_LOADING", payload: false });
        })
        .catch((err) => {
          console.error("Failed to fetch cities:", err);
          dispatch({ type: "SET_ERROR", payload: "Failed to fetch cities." });
          dispatch({ type: "SET_LOADING", payload: false });
        });
    }, 400);

    return () => clearTimeout(delay);
  }, [state.search, state.mode]);

  useEffect(() => {
    if (state.mode !== "country" || !state.selectedCountry) return;

    dispatch({ type: "SET_LOADING", payload: true });

    axios
      .get(`${API_URL}/cities`, {
        params: {
          country: state.selectedCountry,
          page: state.currentPage,
          limit: 15,
        },
      })
      .then((res) => {
        dispatch({ type: "SET_CITIES", payload: res.data.data });
        dispatch({
          type: "SET_TOTAL_PAGES",
          payload: Math.ceil(res.data.total / 15),
        });
        dispatch({ type: "SET_LOADING", payload: false });
      })
      .catch((err) => {
        console.error("Failed to fetch cities:", err);
        dispatch({ type: "SET_ERROR", payload: "Failed to fetch cities." });
        dispatch({ type: "SET_LOADING", payload: false });
      });
  }, [state.selectedCountry, state.currentPage, state.mode]);

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Cities</h1>

      <div className="flex flex-wrap gap-2">
        {state.mode === "search" && (
          <Input
            type="text"
            value={state.search}
            onChange={(e) =>
              dispatch({ type: "SET_SEARCH", payload: e.target.value })
            }
            placeholder="Search city..."
            className="w-auto"
          />
        )}

        {state.search.length < 3 && (
          <>
            <Select
              value={state.selectedContinent}
              onValueChange={(value) => {
                if (value === "__all__") {
                  dispatch({ type: "SET_SEARCH_MODE" });
                } else {
                  dispatch({ type: "SET_CONTINENT", payload: value });
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
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

            {state.selectedContinent !== "__all__" && (
              <Select
                value={state.selectedCountry}
                onValueChange={(value) =>
                  dispatch({ type: "SET_COUNTRY", payload: value })
                }
              >
                <SelectTrigger className="min-w-[180px]">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {filteredCountries.map((country) => (
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
          </>
        )}
      </div>

      {state.loading && <p>Loading...</p>}
      {state.error && <p className="text-red-500">{state.error}</p>}

      {!state.loading && state.cities.length > 0 && (
        <>
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>City Name</TableHead>
                <TableHead>Country Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {console.log(state.cities)}
              
              {state.cities.map((city, index) => (
                <TableRow key={city._id || index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{city.name}</TableCell>
                  <TableCell>{city.country.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {state.mode === "country" && (
            <PaginationComponent
              currentPage={state.currentPage}
              totalPages={state.totalPages}
              onPageChange={(page) =>
                dispatch({ type: "SET_CURRENT_PAGE", payload: page })
              }
            />
          )}
        </>
      )}

      {!state.loading &&
        state.mode === "search" &&
        state.search.length >= 3 &&
        state.cities.length === 0 && (
          <p className="text-muted-foreground mt-4 text-sm">
            No results found.
          </p>
        )}
    </div>
  );
}
