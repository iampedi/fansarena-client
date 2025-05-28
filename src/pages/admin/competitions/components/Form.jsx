// src/pages/admin/competitions/components/Form.jsx
import { API_URL } from "@/config/api";
import { continents } from "@/constants/continents";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AwardIcon, Loader2Icon, MedalIcon, TrashIcon } from "lucide-react";
import { toast } from "sonner";

/* ---------- Form Schema ---------- */
const currentYear = new Date().getFullYear();

const winnerSchema = z.object({
  club: z.string({ required_error: "Club is required" }),
  year: z
    .number()
    .min(1800, "Year must be after 1800")
    .max(currentYear, `Year cannot be after ${currentYear}`)
    .optional(),
  season: z.string().optional(),
  rank: z.enum(["1st", "2nd", "3rd"], {
    required_error: "Rank is required",
  }),
});

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
    winners: z.array(winnerSchema).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.level === "continental" && !data.continent) {
      ctx.addIssue({
        path: ["continent"],
        code: z.ZodIssueCode.custom,
        message: "Continent is required for continental level.",
      });
    }
    if (data.level === "domestic") {
      if (!data.continent) {
        ctx.addIssue({
          path: ["continent"],
          code: z.ZodIssueCode.custom,
          message: "Continent is required for domestic level.",
        });
      }
      if (!data.country) {
        ctx.addIssue({
          path: ["country"],
          code: z.ZodIssueCode.custom,
          message: "Country is required for domestic level.",
        });
      }
    }
  });

/* ---------- Main Component ---------- */
export default function CompetitionForm({
  initialValues = {
    name: "",
    level: "",
    continent: "",
    country: "",
    winners: [],
  },
  _id,
  mode,
  onSubmit,
}) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  const [selectedContinent, setSelectedContinent] = useState(
    initialValues.continent || "",
  );
  const [countries, setCountries] = useState([]);
  const [winners, setWinners] = useState(initialValues.winners || []);
  const [winnerDialogOpen, setWinnerDialogOpen] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState(null);
  const navigate = useNavigate();

  // Winner Dialog Form State
  const [winnerForm, setWinnerForm] = useState({
    club: "",
    year: "",
    season: "",
    rank: "",
  });
  const [winnerFormErrors, setWinnerFormErrors] = useState({});

  // Form Reset
  useEffect(() => {
    form.reset(initialValues);
    setSelectedContinent(initialValues.continent || "");
    setWinners(initialValues.winners || []);
  }, [initialValues, form]);

  // Get Countries
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

  // Get Clubs
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/clubs`);
        setClubs(res.data);
      } catch (err) {
        console.error("Failed to fetch clubs:", err);
        setClubs([]);
      }
    };
    fetchClubs();
  }, []);

  // Set Selected Country
  useEffect(() => {
    if (
      form.watch("level") === "domestic" &&
      initialValues.country &&
      countries.some((c) => c._id === initialValues.country)
    ) {
      form.setValue("country", initialValues.country);
    } else if (form.watch("level") === "domestic") {
      form.setValue("country", "");
    }
  }, [countries, initialValues.country, form]);

  /* ---------- Handle Form Submit ---------- */
  async function handleFormSubmit(data) {
    setLoading(true);
    if (data.level === "domestic") {
      data.continent = "";
    }
    const formData = { ...data, winners };
    await onSubmit(formData, {
      // reset: form.reset,
      // setSelectedContinent,
      // setCountries,
    });

    setLoading(false);
    // navigate("/admin/competitions");
  }

  /* ---------- Handle Add Winner ---------- */
  async function handleAddWinner() {
    // Zod validation
    // const parsed = winnerSchema.safeParse({
    //   ...winnerForm,
    //   year: winnerForm.year ? Number(winnerForm.year) : undefined,
    // });
    // if (!parsed.success) {
    //   const errors = {};
    //   parsed.error.errors.forEach((err) => {
    //     errors[err.path[0]] = err.message;
    //   });
    //   setWinnerFormErrors(errors);
    //   return;
    // }
    // Find club name for display
    const clubName = clubs.find((c) => c._id === winnerForm.club)?.name;

    const winners = form.getValues("winners") || [];
    if (winners.length > 0) {
      const body = winners[winners.length - 1];
      if (body) delete body._id;
    }

    const newWinner = await axios.put(
      `${API_URL}/api/competitions/winners/${_id}`,
      winnerForm,
    );

    setWinners((prev) => [...prev, winnerForm]);

    setWinnerDialogOpen(false);
    setWinnerForm({ club: "", year: "", season: "", rank: "" });
    setWinnerFormErrors({});
  }

  /* ---------- Handle Delete Winner ---------- */
  async function handleDeleteWinner(winner) {
    console.log(_id, winner._id);
    await axios.delete(
      `${API_URL}/api/competitions/${_id}/winners/${winner._id}`,
    );
    setWinners((prev) => prev.filter((w) => w._id !== winner._id));
    toast.success("Winner Deleted Successfully.");
    setModalOpen(false);
  }

  // Display Club Name Helper
  const displayClub = (clubId, clubName) =>
    clubName || clubs.find((c) => c._id === clubId) || clubId;

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-4 items-start gap-3"
        onSubmit={form.handleSubmit(handleFormSubmit)}
      >
        {/* Name */}
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

        {/* Level */}
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
                  if (value === "global") {
                    setSelectedContinent("");
                    form.setValue("continent", "");
                    form.setValue("country", "");
                  } else if (value === "continental") {
                    setSelectedContinent("");
                    form.setValue("continent", "");
                    form.setValue("country", "");
                  } else if (value === "domestic") {
                    form.setValue("country", "");
                  }
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

        {/* Continent & Country */}
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

        {/* ---------- Winners Section ---------- */}
        {mode === "edit" && (
          <div className="col-span-4 mt-3 w-full rounded-md border bg-gray-50 p-4">
            {winners.length === 0 ? (
              <p className="text-center">There is no Winner.</p>
            ) : (
              <div className="col-span-2 mb-4 space-y-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Club</TableHead>
                      <TableHead>Rank</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Season</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...winners]
                      .sort((a, b) => b.year - a.year)
                      .map((winner, i) => (
                        <TableRow
                          key={`${winner.club}-${winner.year}-${winner.rank}-${i}`}
                        >
                          <TableCell>
                            <img
                              src={
                                displayClub(winner.club, winner.clubName)
                                  ?.logoUrl
                              }
                              className="h-6 w-6"
                            />
                          </TableCell>
                          <TableCell className="capitalize">
                            {displayClub(winner.club, winner.clubName)?.name}
                          </TableCell>
                          <TableCell>{winner.rank}</TableCell>
                          <TableCell>{winner.year}</TableCell>
                          <TableCell>{winner.season}</TableCell>
                          <TableCell>
                            <div>
                              {/* <Button size={"icon"} variant={"ghost"}>
                              <FilePenLineIcon
                                style={{ width: "18px", height: "18px" }}
                              />
                            </Button> */}
                              <Button
                                type="button"
                                size={"icon"}
                                variant={"ghost"}
                                onClick={() => {
                                  setSelectedWinner(winner);
                                  setModalOpen(true);
                                }}
                              >
                                <TrashIcon
                                  style={{ width: "18px", height: "18px" }}
                                />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>

                <DeleteConfirmDialog
                  open={modalOpen}
                  onOpenChange={setModalOpen}
                  title="Item"
                  item="winner record"
                  onConfirm={() => {
                    if (selectedWinner && selectedWinner._id) {
                      handleDeleteWinner(selectedWinner);
                    }
                    setModalOpen(false);
                    setSelectedWinner(null);
                  }}
                  isLoading={isLoading}
                />
              </div>
            )}
            <Button
              type="button"
              onClick={() => setWinnerDialogOpen(true)}
              variant="outline"
            >
              <AwardIcon />
              Add Winner
            </Button>

            {/* ---------- Winners Dialog ---------- */}
            <Dialog open={winnerDialogOpen} onOpenChange={setWinnerDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 capitalize">
                    <MedalIcon /> Add new Winner
                  </DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 flex-col gap-3">
                  <FormItem>
                    <FormLabel>Club</FormLabel>
                    <Select
                      value={winnerForm.club}
                      onValueChange={(value) =>
                        setWinnerForm((prev) => ({ ...prev, club: value }))
                      }
                    >
                      <FormControl className="w-full capitalize">
                        <SelectTrigger>
                          <SelectValue placeholder="Select club" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="capitalize">
                        {[...clubs]
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((club) => (
                            <SelectItem key={club._id} value={club._id}>
                              {club.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {winnerFormErrors.club && (
                      <span className="text-xs text-red-600">
                        {winnerFormErrors.club}
                      </span>
                    )}
                  </FormItem>

                  <FormItem>
                    <FormLabel>Rank</FormLabel>
                    <Select
                      value={winnerForm.rank}
                      onValueChange={(value) =>
                        setWinnerForm((prev) => ({ ...prev, rank: value }))
                      }
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select rank" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1st">1st</SelectItem>
                        <SelectItem value="2nd">2nd</SelectItem>
                        <SelectItem value="3rd">3rd</SelectItem>
                      </SelectContent>
                    </Select>
                    {winnerFormErrors.rank && (
                      <span className="text-xs text-red-600">
                        {winnerFormErrors.rank}
                      </span>
                    )}
                  </FormItem>

                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Input
                      type="number"
                      min={1800}
                      max={currentYear}
                      value={winnerForm.year}
                      onChange={(e) =>
                        setWinnerForm((prev) => ({
                          ...prev,
                          year: e.target.value,
                        }))
                      }
                    />
                    {winnerFormErrors.year && (
                      <span className="text-xs text-red-600">
                        {winnerFormErrors.year}
                      </span>
                    )}
                  </FormItem>

                  <FormItem>
                    <FormLabel>Season</FormLabel>
                    <Input
                      placeholder="e.g. 2023/2024"
                      value={winnerForm.season}
                      onChange={(e) =>
                        setWinnerForm((prev) => ({
                          ...prev,
                          season: e.target.value,
                        }))
                      }
                    />
                    {winnerFormErrors.season && (
                      <span className="text-xs text-red-600">
                        {winnerFormErrors.season}
                      </span>
                    )}
                  </FormItem>

                  <DialogFooter className="col-span-2 mt-2 gap-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="button" onClick={handleAddWinner}>
                      Save
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
