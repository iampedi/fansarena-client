import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Dummy data for continents & countries (در عمل از API یا کانستنتس خودت جایگزین کن)
const continents = [
  { value: "europe", label: "Europe" },
  { value: "asia", label: "Asia" },
  { value: "africa", label: "Africa" },
];

const countriesList = {
  europe: [
    { _id: 1, name: "Germany" },
    { _id: 2, name: "France" },
    { _id: 3, name: "Italy" },
  ],
  asia: [
    { _id: 4, name: "Japan" },
    { _id: 5, name: "China" },
    { _id: 6, name: "Iran" },
  ],
  africa: [
    { _id: 7, name: "Egypt" },
    { _id: 8, name: "South Africa" },
  ],
};

export default function ProfilePage() {
  const form = useForm({
    defaultValues: {
      name: "",
      gender: "",
      continent: "",
      country: "",
      city: "",
    },
  });

  const [countries, setCountries] = useState([]);
  const continent = form.watch("continent");

  // هر بار قاره عوض شد لیست کشورها رو آپدیت کن
  useEffect(() => {
    if (!continent) {
      setCountries([]);
      form.setValue("country", "");
      return;
    }
    setCountries(countriesList[continent] || []);
    // اگر country قبلی در لیست نبود پاک کن
    const currCountry = form.getValues("country");
    if (
      currCountry &&
      !countriesList[continent].some(
        (c) => c.name.toLowerCase() === currCountry.toLowerCase(),
      )
    ) {
      form.setValue("country", "");
    }
  }, [continent]);

  // فقط برای تست! در عمل مقادیر رو با user پر کن و reset بزن
  useEffect(() => {
    // فرم اولیه پر شده (مثلاً با دیتا کاربر)
    form.reset({
      name: "Ali",
      gender: "male",
      continent: "asia",
      country: "Iran",
      city: "Tehran",
    });
  }, [form]);

  const onSubmit = (data) => {
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 bg-white p-6 rounded-xl shadow"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="gender"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="continent"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Continent</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue("country", "");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select continent" />
                    </SelectTrigger>
                    <SelectContent>
                      {continents.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="country"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={countries.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c._id} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="city"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your city" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
}
