// src/pages/admin/competitions/components/AddWinnerDialog.jsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

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

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MedalIcon } from "lucide-react";
import { API_URL } from "@/config/api";

const currentYear = new Date().getFullYear();

const winnerSchema = z.object({
  club: z.string().min(1, "Club is required"),
  year: z
    .number({
      required_error: "Year is required",
      invalid_type_error: "Year must be a number",
    })
    .min(1800, "Year cannot be before 1800")
    .max(currentYear, `Year cannot be after ${currentYear}`),
  season: z.string().optional(),
  rank: z.enum(["1st", "2nd", "3rd"], {
    required_error: "Rank is required",
  }),
});

export default function AddWinnerDialog({
  open,
  onOpenChange,
  cName,
  onSubmit,
}) {
  const [clubs, setClubs] = useState([]);
  const [loadingClubs, setLoadingClubs] = useState(true);

  useEffect(() => {
    if (!open) return;
    setLoadingClubs(true);
    axios
      .get(`${API_URL}/api/clubs`)
      .then((res) => setClubs(res.data))
      .catch(() => setClubs([]))
      .finally(() => setLoadingClubs(false));
  }, [open]);

  const form = useForm({
    resolver: zodResolver(winnerSchema),
    defaultValues: {
      club: "",
      year: currentYear,
      season: "",
      rank: "",
    },
  });

  async function handleFormSubmit(values) {
    await onSubmit?.(values);
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 capitalize">
            <MedalIcon /> {`Add new Winner for ${cName}`}
          </DialogTitle>
          <DialogDescription>
            Please fill out the details to add a new winner.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="flex flex-col gap-4">
            {/* Club */}
            <FormField
              control={form.control}
              name="club"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Club</FormLabel>
                  <Select
                    disabled={loadingClubs}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            loadingClubs ? "Loading..." : "Select club"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clubs.map((club) => (
                        <SelectItem key={club._id} value={club._id}>
                          {club.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Year */}
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1800}
                      max={currentYear}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Season */}
            <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Season</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2023/2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rank */}
            <FormField
              control={form.control}
              name="rank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rank</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-2 gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={form.handleSubmit(handleFormSubmit)}
              >
                Save
              </Button>
            </DialogFooter>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
