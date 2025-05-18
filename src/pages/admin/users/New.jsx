// src/pages/admin/clubs/New.jsx
import axios from "axios";
import { API_URL } from "@/config/api";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAdminUI } from "@/contexts/AdminUIContext";
import { continents } from "@/constants/continents";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string(),
  continent: z.string(),
  country: z.string(),
  city: z.string(),
  stadium: z.string(),
  founded: z.string(),
  founder: z.string(),
});

export default function NewClubPage() {
  const { setPageTitle } = useAdminUI();
  const [selectedContinent, setSelectedContinent] = useState("");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [city, setCity] = useState([]);

  useEffect(() => {
    setPageTitle("Create New Club");
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      continent: "",
      country: "",
      city: "",
      stadium: "",
      founded: "",
      founder: "",
    },
  });

  useEffect(() => {
    if (!selectedContinent) {
      setCountries([]);
      return;
    }

    const fetchCountries = async () => {
      try {
        const res = await axios.get(`${API_URL}/countries`, {
          params: {
            continent: selectedContinent,
            limit: 300,
          },
        });
        setCountries(res.data.data);
        console.log('country: \n',res.data.data);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };
    fetchCountries();
  }, [selectedContinent]);

  useEffect(() => {
    if (!selectedCountry) {
      setCity([]);
      return;
    }

    const fetchCities = async () => {
      try {
        const res = await axios.get(`${API_URL}/cities`, {
          params: {
            country: selectedCountry,
            limit: 500,
          },
        });
        setCity(res.data.data);
        console.log('city: \n',res.data.data);
      } catch (err) {
        console.error("Failed to fetch cities:", err);
      }
    };
    fetchCities();
  }, [selectedCountry]);

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="continent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Continent</FormLabel>
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => {
                    setSelectedContinent(value);
                    field.onChange(value);
                    form.setValue("country", "");
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Continent" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {continents.map((continent) => (
                      <SelectItem key={continent.value} value={continent.value}>
                        {continent.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {selectedContinent && (
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => {
                      setSelectedCountry(value);
                      field.onChange(value);
                    }}
                  >
                    <FormControl className="capitalize">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem
                          className="capitalize"
                          key={country._id}
                          value={country._id}
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="stadium"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stadium Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Stadium Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="founded"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Founded Year</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="founder"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Founder Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter founder name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
