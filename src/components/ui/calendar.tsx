import * as React from "react"
import { cn } from "@/lib/utils"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"
import { ptBR } from "react-day-picker/locale"

import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  // português do Brasil por padrão (nomes de meses e dias, semana começando no domingo)
  locale = ptBR,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-background-5 p-md [--cell-radius:var(--aurora-radius-sm)] [--cell-size:32px] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-flip`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-flip`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-lg md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-lg", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-none top-none flex w-full items-center justify-between gap-xs",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-none select-none aria-disabled:opacity-disabled",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-none select-none aria-disabled:opacity-disabled",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-xs typo-body-md-bold",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-none bg-background-6 opacity-hidden",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "select-none",
          captionLayout === "label"
            ? "typo-body-md-bold"
            : "flex items-center gap-xs rounded-(--cell-radius) typo-body-md-bold [&>svg]:size-[14px] [&>svg]:text-text-3",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-(--cell-radius) typo-body-sm-regular text-text-3 select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-sm flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "typo-body-sm-regular text-text-3 select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-none text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate z-base rounded-l-(--cell-radius) bg-background-4 after:absolute after:inset-y-none after:right-none after:w-[16px] after:bg-background-4",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-base rounded-r-(--cell-radius) bg-background-4 after:absolute after:inset-y-none after:left-none after:w-[16px] after:bg-background-4",
          defaultClassNames.range_end
        ),
        today: cn(
          // hoje: fundo leve; se hoje for o dia selecionado, só a marcação da seleção aparece
          // (no intervalo o fundo continua, porque é a faixa que liga início e fim)
          "rounded-(--cell-radius) bg-background-4 text-text-1 data-[selected=true]:rounded-none",
          String.raw`[&[data-selected=true]:not(.rdp-range\_start,.rdp-range\_middle,.rdp-range\_end)]:bg-transparent`,
          defaultClassNames.today
        ),
        outside: cn(
          "text-text-3 aria-selected:text-text-3",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-text-3 opacity-disabled",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-[16px]", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon className={cn("size-[16px]", className)} {...props} />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-[16px]", className)} {...props} />
          )
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size={null}
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-raised flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-xs border-(length:--aurora-stroke-none) leading-none group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-raised group-data-[focused=true]/day:border-focus group-data-[focused=true]/day:ring-(length:--aurora-stroke-focus) group-data-[focused=true]/day:ring-focus/focus-ring data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-r-(--cell-radius) data-[range-end=true]:bg-link-1 data-[range-end=true]:text-link-10 data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-link-2 data-[range-middle=true]:text-text-1 data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-l-(--cell-radius) data-[range-start=true]:bg-link-1 data-[range-start=true]:text-link-10 data-[selected-single=true]:bg-link-1 data-[selected-single=true]:text-link-10 [&>span]:typo-body-sm-regular [&>span]:opacity-muted",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
