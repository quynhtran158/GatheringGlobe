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
import { categoriesList, eventTypesList } from "@/utils/categoriesEventList";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { createEvent, editEvent } from "@/services/api";
import Tiptap from "../tiptap";
import { EventDetails } from "@/types/eventDetails";
import { LocationType } from "@/types/event";

const formSchema = z
  .object({
    title: z
      .string()
      .min(10, { message: "Title must be at least 10 characters long" }),
    description: z
      .string()
      .min(50, { message: "Description must be at least 50 characters long" }),
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
    location: z.object({
      city: z
        .string()
        .min(2, { message: "City must be at least 2 characters" }),
      country: z
        .string()
        .min(2, { message: "Country must be at least 2 characters" }),
      postalCode: z
        .string()
        .min(2, { message: "Postal code must be at least 2 characters" }),
      state: z
        .string()
        .min(2, { message: "state must be at least 2 characters" }),
    }),
    category: z
      .string()
      .min(2, { message: "Please select an event category to display." }),
    eventType: z
      .string()
      .min(2, { message: "Please select an event type to display." }),
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

export type EventFormData = z.infer<typeof formSchema>;

interface EventFormProps {
  initialData?: EventDetails | undefined;
}

const EventForm = ({ initialData }: EventFormProps) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const form = useForm<EventFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          startTime: format(
            new Date(initialData.startTime),
            "yyyy-MM-dd'T'HH:mm",
          ),
          endTime: format(new Date(initialData.endTime), "yyyy-MM-dd'T'HH:mm"),
        }
      : {
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
          location: {
            city: "",
            country: "",
            postalCode: "",
            state: "",
          },
        },
  });

  const onSubmit = async (values: EventFormData) => {
    try {
      setLoading(true);
      console.log(values);

      if (initialData) {
        const event = await editEvent(
          {
            ...values,
            startTime: new Date(values.startTime).toISOString(),
            endTime: new Date(values.endTime).toISOString(),
          },
          initialData._id,
        );
        if (event?.updated) {
          navigate(`/dashboard/${initialData.organizerId.username}`);
          toast.success("Event updated successfully!");
        }
      } else {
        const event = await createEvent({
          ...values,
          startTime: new Date(values.startTime).toISOString(),
          endTime: new Date(values.endTime).toISOString(),
        });
        console.log(event);
        navigate(`/${event._id}/tickets`);
        toast.success("Event created successfully!");
      }

      form.reset();
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

  const cardTitle = initialData ? "Edit Event" : "Create New Event";
  const cardDescription = initialData
    ? "Edit the form below to update the event."
    : "Fill out the form below to schedule a new event.";
  const buttonText = initialData ? "Update Event" : "Create Event";
  const loadingText = initialData ? "Updating..." : "Creating...";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="max-w-4xl mx-auto p-5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{cardTitle}</CardTitle>
            <CardDescription className="text-lg">
              {cardDescription}
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

              <div className="space-y-1 w-full">
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time* </FormLabel>
                      <FormControl className="w-full">
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
                      <Tiptap
                        description={field.value}
                        onChange={field.onChange}
                        width="810px"
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
                render={({}) => (
                  <FormItem>
                    <EventLocation
                      initialValues={{
                        city: initialData?.location?.city || "",
                        country: initialData?.location?.country || "",
                        postalCode: initialData?.location?.postalCode || "",
                        state: initialData?.location?.state || "",
                      }}
                      onChange={(value: LocationType) => {
                        form.setValue("location.city", value.city || "");
                        form.setValue("location.country", value.country || "");
                        form.setValue(
                          "location.postalCode",
                          value.postalCode || "",
                        );
                        form.setValue("location.state", value.state || "");
                      }}
                    />
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
                {loading ? loadingText : buttonText}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default EventForm;
