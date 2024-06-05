import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function DatePickerWithRange({
  setDateFromParent,
  dateFromParent,
}: {
  setDateFromParent: (value: DateRange | undefined) => void;
  dateFromParent?: DateRange | undefined; //allow dateFromParent to be optional
}) {
  const [date, setDate] = React.useState<DateRange | undefined>(dateFromParent);
  const onSubmit = (data: DateRange | undefined) => {
    setDateFromParent(data);
    setDate(data);
  };
  return (
    <div className="grid gap-2 ">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            size={"sm"}
            className={cn(
              "w-auto justify-start text-left font-normal rounded-none bg-white text-green-800 hover:bg-white border-none",
              !date && "text-green-800",
            )}
          >
            <CalendarIcon className="mr-2 h-6 w-6 text-black" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span className="font-normal text-lg">All dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onSubmit}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePickerWithRange;
