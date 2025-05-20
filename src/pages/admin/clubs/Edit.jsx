import { API_URL } from "@/config/api";
import { useAdminUI } from "@/contexts/AdminUIContext";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { continents } from "@/constants/continents";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ColorSelect } from "@/components/ui/color-select";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Club name is required and must be at least 3 characters",
  }),
  continent: z.string().min(1, { message: "Continent is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  city: z.string().min(1, { message: "City Name is required" }),
  arena: z.string().optional(),
  founded: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().min(1800).max(new Date().getFullYear()).optional(),
  ),
  founder: z.string().optional(),
  colors: z.array(z.any()).optional(),
  website: z
    .string()
    .url({ message: "Invalid URL" })
    .or(z.literal("").transform(() => undefined))
    .optional(),
});

export default function EditClubPage() {
  const { setPageTitle } = useAdminUI();
  const { slug } = useParams();
  const [club, setClub] = useState({});
  const [selectedContinent, setSelectedContinent] = useState("");
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();

  // Form initialization
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      continent: "",
      country: "",
      city: "",
      arena: "",
      founded: undefined,
      founder: "",
      colors: [],
      website: "",
    },
  });

  useEffect(() => {
    setPageTitle("Edit Club");
  }, [setPageTitle]);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/clubs/${slug}`);
        setClub(res.data);
      } catch (err) {
        console.error("Failed to fetch club:", err);
      }
    };
    fetchClub();
  }, [slug]);

  // مقداردهی فرم و قاره و کشورها بعد از دریافت دیتا
  useEffect(() => {
    if (club && club.name) {
      form.reset({
        name: club.name || "",
        continent: club.country?.continent || "",
        country: club.country?._id || "",
        city: club.city || "",
        arena: club.arena || "",
        founded: club.founded || "",
        founder: club.founder || "",
        colors: club.colors || [],
        website: club.website || "",
      });
      setSelectedContinent(club.country?.continent || "");
    }
  }, [club]);

  useEffect(() => {
    if (!selectedContinent) {
      setCountries([]);
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

  async function onSubmit(data) {
    try {
      await axios.put(`${API_URL}/api/clubs/${club._id}`, data);
      toast.success("Club updated successfully");
      navigate("/admin/clubs?updated=1");
    } catch (err) {
      console.error("Failed to submit:", err);
      toast.error(err.response?.data?.error || "Submission failed");
    }
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
                  <Input {...field} value={field.value ?? ""} />
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
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City Name</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
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
                  <Input type="number" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arena"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arena Name</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="colors"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Colors</FormLabel>
                <FormControl>
                  <ColorSelect
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/admin/clubs")}
            >
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
