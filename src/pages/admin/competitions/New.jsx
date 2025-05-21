// src/pages/admin/competitions/New.jsx
import { API_URL } from "@/config/api";
import { continents } from "@/constants/continents";
import { useAdminUI } from "@/contexts/AdminUIContext";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const formSchema = z
  .object({
    name: z
      .string()
      .min(3, "Competition name is required and must be at least 3 characters"),
    level: z.enum(["domestic", "continental", "global"], {
      required_error: "Level is required",
    }),
    continent: z.string().optional(),
    country: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.level === "domestic" && !data.country) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["country"],
        message: "Country is required for domestic competitions",
      });
    }
    if (data.level === "continental" && !data.continent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["continent"],
        message: "Continent is required for continental competitions",
      });
    }
  });

export default function NewCompetitionPage() {
  const { setPageTitle } = useAdminUI();
  const [selectedContinent, setSelectedContinent] = useState("");
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setPageTitle("Create New Competition");
  }, [setPageTitle]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      level: "",
      continent: "",
      country: "",
    },
  });

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
    const cleanData = { ...data };
    Object.keys(cleanData).forEach((k) => {
      if (!cleanData[k]) delete cleanData[k];
    });

    try {
      await axios.post(`${API_URL}/api/competitions`, cleanData);
      form.reset();
      setSelectedContinent("");
      setCountries([]);
      navigate("/admin/competitions?created=1");
    } catch (err) {
      console.error("Failed to submit:", err);
      console.log("Server error:", err.response?.data); // اینو اضافه کن
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedContinent("");
                    form.setValue("continent", "");
                    form.setValue("country", "");
                  }}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="domestic">Domestic</SelectItem>
                    <SelectItem value="continental">Continental</SelectItem>
                    <SelectItem value="global">Global</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* اگر level=continental => فقط قاره */}
          {form.watch("level") === "continental" && (
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
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Continent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {continents.map((continent) => (
                        <SelectItem
                          key={continent.value}
                          value={continent.value}
                        >
                          {continent.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* اگر level=domestic => اول قاره، بعد کشور */}
          {form.watch("level") === "domestic" && (
            <>
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
                          <SelectItem
                            key={continent.value}
                            value={continent.value}
                          >
                            {continent.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* نمایش کشور فقط وقتی قاره انتخاب شده */}
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
            </>
          )}

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
