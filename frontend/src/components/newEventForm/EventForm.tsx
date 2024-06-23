import { useForm } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import EventLocation from "./eventloc";
import ImageUpload from "../chatRoom/ImageUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const formSchema = z
  .object({
    title: z
      .string()
      .min(10, { message: "Title must be at least 10 characters long" }),
    description: z
      .string()
      .min(50, { message: "Description must be at least 50 characters long" })
      .max(500, {
        message: "Description must be no more than 500 characters long",
      }),
    startTime: z.string().refine((date) => new Date(date) >= new Date(), {
      message: "Start time must be in the future",
    }),
    endTime: z.string().refine((date) => new Date(date) >= new Date(), {
      message: "End time must be in the future",
    }),
    capacity: z
      .number()
      .positive({ message: "Capacity must be a positive number" })
      .int({ message: "Capacity must be an integer" }),
    location: z
      .string()
      .min(5, { message: "Location must be at least 5 characters long" }),
    category: z
      .string()
      .nonempty({ message: "Please select an event category" }),
    eventType: z.string().nonempty({ message: "Please select an event type" }),
    artistName: z.string().optional(),
    imageUrls: z.array(z.string()).nonempty("At least one image is required"),
    roomChatLink: z.union([
      z.string().url({ message: "Room chat link must be a valid URL" }),
      z.literal(""),
    ]),
  })
  .superRefine((data, ctx) => {
    if (new Date(data.endTime) <= new Date(data.startTime)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End time must be after start time",
        path: ["endTime"],
      });
    }
  });

type FormData = z.infer<typeof formSchema>;

const EventForm = () => {
  const navigate = useNavigate();
  const categoriesList = [
    "Music",
    "Movies",
    "Books",
    "Sports",
    "Technology",
    "Travel",
    "Food",
    "Fashion",
    "Art",
    "Science",
    "Politics",
    "History",
    "Education",
    "Health",
    "Finance",
    "Gaming",
    "Lifestyle",
    "Parenting",
    "Pets",
    "Gardening",
  ];
  const eventTypesList = [
    "Party",
    "Conference",
    "Concert",
    "Festival",
    "Seminar",
    "Workshop",
    "Meetup",
    "Networking",
    "Exhibition",
    "Tradeshow",
    "Convention",
    "Summit",
    "Gala",
    "Fundraiser",
    "Awards",
    "Screening",
    "Premiere",
    "Launch",
    "Fair",
    "Expo",
    "Charity",
    "Sports",
    "Competition",
    "Tournament",
    "Hackathon",
    "Webinar",
    "Virtual Event",
    "Livestream",
    "Auction",
    "Sale",
    "Open House",
    "Tour",
    "Tasting",
    "Masterclass",
    "Retreat",
    "Camp",
    "Cruise",
    "Rally",
    "Parade",
    "Marathon",
  ];
  const [loading, setLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      category: "",
      eventType: "",
      description: "",
      startTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      endTime: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      imageUrls: [],
      roomChatLink: "",
      artistName: "",
      capacity: 0,
      location: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      setLoading(true);
      console.log(values);

      const response = await axiosInstance.post("/api/events/", {
        ...values,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString(),
      });

      form.reset();
      toast.success(response.data.message);
      const event = response.data;
      navigate(`/${event._id}/tickets`);
      console.log(event);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Something went wrong");
        console.error("Error details:", error.response?.data.error);
      } else {
        toast.error("Something went wrong");
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="max-w-4xl mx-auto p-5">
          <CardHeader className="text-center">
            <CardTitle>Create New Event</CardTitle>
            <CardDescription>
              Fill out the form below to schedule a new event.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title*</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity* </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time* </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          value={field.value}
                          onChange={(e) =>
                            // Convert the input value to Date here
                            field.onChange(e.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time* </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          value={field.value}
                          onChange={(e) =>
                            // Convert the input value to Date here
                            field.onChange(e.target.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-1">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description* </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <FormField
                control={form.control}
                name="artistName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artist Name </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Event Category*" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoriesList.map((cat, index) => (
                          <SelectItem key={index} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Event Type*" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventTypesList.map((type, index) => (
                          <SelectItem key={index} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <EventLocation name={field.name} />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <FormField
                control={form.control}
                name="imageUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Image*</FormLabel>
                    <FormControl>
                      <ImageUpload
                        name="imageUrls"
                        disabled={loading}
                        multiple={true}
                        iconClassName="text-black"
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-1">
              <FormField
                control={form.control}
                name="roomChatLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Chat Link (optional) </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col w-full">
              <Button
                type="submit"
                className="flex bg-green-500 hover:bg-green-600 text-white w-full"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default EventForm;
