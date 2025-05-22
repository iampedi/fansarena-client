// src/pages/admin/competitions/Form.jsx
import { API_URL } from "@/config/api";
import { continents } from "@/constants/continents";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

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
import { Loader2Icon } from "lucide-react";

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
    if (data.level === "domestic") {
      if (!data.continent) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["continent"],
          message: "Continent is required for domestic competitions",
        });
      }
      if (!data.country) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["country"],
          message: "Country is required for domestic competitions",
        });
      }
    }
    if (data.level === "continental" && !data.continent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["continent"],
        message: "Continent is required for continental competitions",
      });
    }
  });

export default function CompetitionForm({
  initialValues = { name: "", level: "", continent: "", country: "" },
  onSubmit,
  mode = "create",
  loading = false,
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const level = form.watch("level");

  const [selectedContinent, setSelectedContinent] = useState("");
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();

  // Reset form & selectedContinent when initialValues changes (Edit mode)
  useEffect(() => {
    form.reset(initialValues);
    setSelectedContinent(initialValues.continent || "");
  }, [initialValues, form]);

  // Fetch countries when selectedContinent changes
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
        setCountries([]);
      }
    };
    fetchCountries();
  }, [selectedContinent]);

  // Fix: Sync country field when countries are loaded and level is domestic
  useEffect(() => {
    if (
      level === "domestic" &&
      initialValues.country &&
      countries.some((c) => c._id === initialValues.country)
    ) {
      form.setValue("country", initialValues.country);
    } else if (level === "domestic") {
      form.setValue("country", "");
    }
  }, [countries, initialValues.country, form, level]);

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-4 items-start gap-3"
        onSubmit={form.handleSubmit(async (data) => {
          await onSubmit(data, {
            reset: form.reset,
            setSelectedContinent,
            setCountries,
          });
        })}
      >
        <FormField
          className="col-span-1"
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
          className="col-span-1"
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
                <FormControl className="w-full">
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

        {/* Level: continental */}
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
                  <FormControl className="w-full">
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
        )}

        {/* Level: domestic */}
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
                    <FormControl className="w-full">
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
                      onValueChange={field.onChange}
                    >
                      <FormControl className="w-full capitalize">
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

        <div className="col-span-4 mt-3 flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate(-1)}
            type="button"
          >
            Cancel
          </Button>
          {loading ? (
            <Button disabled type="submit">
              <Loader2Icon className="animate-spin" />
              {mode === "edit" ? "Update" : "Submit"}
            </Button>
          ) : (
            <Button type="submit">
              {mode === "edit" ? "Update" : "Submit"}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
