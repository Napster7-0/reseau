"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
};

  export function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    captionLayout = "buttons",
    buttonVariant = "ghost",
    formatters,
    ...props
  }: CalendarProps) {
    return (
      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn(
          "bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
          String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
          String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
          className
        )}
        captionLayout={captionLayout}
        formatters={formatters}
        classNames={{
          root: cn("w-fit"),
          months: cn("flex gap-4 flex-col md:flex-row relative"),
          month: cn("flex flex-col w-full gap-4"),
          nav: cn("flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between"),
          nav_button_previous: cn(buttonVariants({ variant: buttonVariant }), "h-7 w-7 p-0"),
          nav_button_next: cn(buttonVariants({ variant: buttonVariant }), "h-7 w-7 p-0"),
          dropdown: cn("absolute inset-0 opacity-0"),
          caption_label: cn("select-none font-medium text-sm"),
          table: "w-full border-collapse",
    head: cn("flex"),
          weeknumber: cn("text-xs"),
          cell: cn("p-0"),
          day: cn("relative w-full h-full p-0 text-center group/day aspect-square select-none"),
          day_selected: cn("bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"),
          day_today: cn("bg-muted text-muted-foreground"),
          day_outside: cn("text-muted-foreground opacity-50"),
          day_disabled: cn("text-muted-foreground opacity-50"),
          day_range_start: cn("rounded-l-md bg-accent"),
          day_range_end: cn("rounded-r-md bg-accent"),
          day_range_middle: cn("rounded-none"),
          day_hidden: cn("invisible"),
          ...classNames,
        }}
        {...props}
      />
    )
  }
