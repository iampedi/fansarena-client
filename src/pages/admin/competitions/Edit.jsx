// src/pages/admin/competitions/Edit.jsx

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

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

export default function EditCompetitionPage() {
  const { setPageTitle } = useAdminUI();
  const { slug } = useParams();
  const [selectedContinent, setSelectedContinent] = useState("");
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      level: "",
      continent: "",
      country: "",
    },
  });

  // دریافت اطلاعات رقابت جاری
  useEffect(() => {
    setPageTitle("Edit Competition");

    const fetchCompetition = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/competitions/${slug}`);
        const comp = res.data;
        // اگر مسابقه داخلی بود قاره را از کشور بخوان
        let detectedContinent = "";
        if (comp.level === "domestic" && comp.country && comp.country.continent)
          detectedContinent = comp.country.continent;
        else if (comp.level === "continental" && comp.continent)
          detectedContinent = comp.continent;

        form.reset({
          name: comp.name || "",
          level: comp.level || "",
          continent: detectedContinent || "",
          country: comp.country?._id || "",
        });

        setSelectedContinent(detectedContinent);
      } catch (err) {
        toast.error("Failed to fetch competition data.");
        console.error("Failed to fetch competition data:", err);
        // navigate("/admin/competitions");
      } finally {
        setLoading(false);
      }
    };
    fetchCompetition();
    // eslint-disable-next-line
  }, [slug]);

  // دریافت کشورها با تغییر قاره
  useEffect(() => {
    if (!selectedContinent) {
      setCountries([]);
      return;
    }
    const fetchCountries = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/countries`, {
          params: { continent: selectedContinent, limit: 300 },
        });
        setCountries(res.data.data);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      }
    };
    fetchCountries();
  }, [selectedContinent]);

  // هندل ارسال
  async function onSubmit(data) {
    setIsSaving(true);
    const cleanData = { ...data };
    Object.keys(cleanData).forEach((k) => {
      if (!cleanData[k]) delete cleanData[k];
    });

    try {
      await axios.put(`${API_URL}/api/competitions/${slug}`, cleanData);
      toast.success("Competition updated!");
      navigate("/admin/competitions");
    } catch (err) {
      console.error("Failed to submit:", err);
      toast.error(err.response?.data?.error || "Update failed");
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-solid border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* نام مسابقه */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* سطح */}
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

          {/* اگر سطح continental => فقط قاره */}
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

          {/* اگر سطح domestic => اول قاره بعد کشور */}
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

          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Updating..." : "Update"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
