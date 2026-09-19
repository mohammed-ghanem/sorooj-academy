"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const MONTHS_AR = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS_AR = ["ح", "ن", "ث", "ر", "خ", "ج", "س"];
const WEEKDAYS_EN = ["S", "M", "T", "W", "T", "F", "S"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toISO(year: number, monthIndex: number, day: number) {
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
}

function parseISO(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(year, monthIndex, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== day
  ) {
    return null;
  }
  return { year, monthIndex, day };
}

function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function monthStart(year: number, monthIndex: number) {
  return new Date(year, monthIndex, 1);
}

type BirthDatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  isArabic: boolean;
  className?: string;
  cancelLabel: string;
  okLabel: string;
  placeholder: string;
};

const BirthDatePicker = ({
  value,
  onChange,
  isArabic,
  className,
  cancelLabel,
  okLabel,
  placeholder,
}: BirthDatePickerProps) => {
  const today = useMemo(() => startOfToday(), []);
  const maxYear = today.getFullYear();
  const minYear = maxYear - 100;
  const maxMonthStart = monthStart(today.getFullYear(), today.getMonth());

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"calendar" | "year">("calendar");
  const [viewYear, setViewYear] = useState(maxYear - 18);
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [draftDay, setDraftDay] = useState<number | null>(null);
  const selectedYearRef = useRef<HTMLButtonElement>(null);

  const months = isArabic ? MONTHS_AR : MONTHS_EN;
  const weekdays = isArabic ? WEEKDAYS_AR : WEEKDAYS_EN;
  const years = useMemo(() => {
    const list: number[] = [];
    for (let year = maxYear; year >= minYear; year -= 1) list.push(year);
    return list;
  }, [maxYear, minYear]);

  const parsedValue = parseISO(value);

  const displayValue = parsedValue
    ? isArabic
      ? `${parsedValue.day} ${MONTHS_AR[parsedValue.monthIndex]} ${parsedValue.year}`
      : `${MONTHS_EN[parsedValue.monthIndex]} ${parsedValue.day}, ${parsedValue.year}`
    : "";

  const isFutureDay = (day: number) =>
    new Date(viewYear, viewMonth, day).getTime() > today.getTime();

  const canGoPrevMonth =
    viewYear > minYear || (viewYear === minYear && viewMonth > 0);
  const canGoNextMonth =
    monthStart(viewYear, viewMonth + 1).getTime() <= maxMonthStart.getTime();
  const canGoPrevYear = viewYear > minYear;
  const canGoNextYear = viewYear < maxYear;

  const calendarCells = useMemo(() => {
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const total = daysInMonth(viewYear, viewMonth);
    const cells: Array<number | null> = [];
    for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
    for (let day = 1; day <= total; day += 1) cells.push(day);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewYear, viewMonth]);

  const applyView = (year: number, monthIndex: number) => {
    let nextYear = Math.min(maxYear, Math.max(minYear, year));
    let nextMonth = monthIndex;
    if (monthStart(nextYear, nextMonth).getTime() > maxMonthStart.getTime()) {
      nextYear = today.getFullYear();
      nextMonth = today.getMonth();
    }
    setViewYear(nextYear);
    setViewMonth(nextMonth);
    setDraftDay((day) =>
      day == null ? day : Math.min(day, daysInMonth(nextYear, nextMonth)),
    );
  };

  const resetDraftFromValue = () => {
    setMode("calendar");
    if (parsedValue) {
      setViewYear(parsedValue.year);
      setViewMonth(parsedValue.monthIndex);
      setDraftDay(parsedValue.day);
      return;
    }
    const fallback = new Date(today);
    fallback.setFullYear(today.getFullYear() - 18);
    setViewYear(fallback.getFullYear());
    setViewMonth(fallback.getMonth());
    setDraftDay(null);
  };

  const openPicker = () => {
    resetDraftFromValue();
    setOpen(true);
  };

  const closePicker = (nextOpen: boolean) => {
    if (!nextOpen) resetDraftFromValue();
    setOpen(nextOpen);
  };

  const confirmDate = () => {
    if (draftDay == null) return;
    onChange(toISO(viewYear, viewMonth, draftDay));
    setOpen(false);
  };

  useLayoutEffect(() => {
    if (mode !== "year") return;
    const frame = requestAnimationFrame(() => {
      selectedYearRef.current?.scrollIntoView({ block: "center" });
    });
    return () => cancelAnimationFrame(frame);
  }, [mode, viewYear]);

  return (
    <>
      <button
        type="button"
        onClick={openPicker}
        className={cn(
          "relative mt-1 flex w-full items-center justify-between border border-gray-300 rounded-md p-2 text-start",
          "focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:outline-none!",
          value ? "scoundColor font-semibold text-sm" : "text-gray-400",
          className,
        )}
        dir={isArabic ? "rtl" : "ltr"}
      >
        <span className="min-w-0 flex-1 truncate">
          {displayValue || placeholder}
        </span>
        <Calendar size={18} className="shrink-0 text-gray-400" />
      </button>

      <Dialog open={open} onOpenChange={closePicker}>
        <DialogContent
          showCloseButton={false}
          className="w-[min(100%,22rem)] gap-3 overflow-hidden rounded-2xl border-0 bg-[#f6f4f0] p-4 shadow-xl sm:max-w-88"
        >
          <DialogTitle className="sr-only">{placeholder}</DialogTitle>

          <div className="flex items-center justify-between gap-2" dir="ltr">
            <div className="flex min-w-0 flex-1 items-center">
              <button
                type="button"
                onClick={() => applyView(viewYear, viewMonth - 1)}
                disabled={!canGoPrevMonth}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#5f5f5f] transition hover:bg-black/5 disabled:opacity-30"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="relative min-w-0 flex-1">
                <select
                  value={viewMonth}
                  onChange={(e) => applyView(viewYear, Number(e.target.value))}
                  className="w-full cursor-pointer appearance-none bg-transparent py-1 pe-5 text-center text-sm font-semibold text-[#3f3f3f] outline-none"
                  aria-label="Month"
                >
                  {months.map((month, index) => {
                    const disabled =
                      monthStart(viewYear, index).getTime() >
                      maxMonthStart.getTime();
                    return (
                      <option key={month} value={index} disabled={disabled}>
                        {isArabic ? month : month.slice(0, 3)}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-[#6b6b6b]"
                />
              </div>
              <button
                type="button"
                onClick={() => applyView(viewYear, viewMonth + 1)}
                disabled={!canGoNextMonth}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#5f5f5f] transition hover:bg-black/5 disabled:opacity-30"
                aria-label="Next month"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="flex items-center">
              <button
                type="button"
                onClick={() => applyView(viewYear - 1, viewMonth)}
                disabled={!canGoPrevYear}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#5f5f5f] transition hover:bg-black/5 disabled:opacity-30"
                aria-label="Previous year"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() =>
                  setMode((current) =>
                    current === "year" ? "calendar" : "year",
                  )
                }
                className="flex min-w-20 items-center justify-center gap-1 py-1 text-sm font-semibold tabular-nums text-[#3f3f3f]"
                aria-label="Choose year"
                aria-expanded={mode === "year"}
              >
                {viewYear}
                <ChevronDown
                  size={14}
                  className={cn(
                    "text-[#6b6b6b] transition-transform",
                    mode === "year" && "rotate-180",
                  )}
                />
              </button>
              <button
                type="button"
                onClick={() => applyView(viewYear + 1, viewMonth)}
                disabled={!canGoNextYear}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#5f5f5f] transition hover:bg-black/5 disabled:opacity-30"
                aria-label="Next year"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {mode === "year" ? (
            <div
              className="grid max-h-72 grid-cols-3 gap-1 overflow-y-auto py-1 [scrollbar-width:thin] [scrollbar-color:#9F854E_transparent]"
              dir="ltr"
            >
              {years.map((year) => {
                const selected = year === viewYear;
                return (
                  <button
                    key={year}
                    type="button"
                    ref={selected ? selectedYearRef : undefined}
                    onClick={() => {
                      applyView(year, viewMonth);
                      setMode("calendar");
                    }}
                    className={cn(
                      "rounded-full py-2 text-sm transition",
                      selected
                        ? "bg-[#9F854E] font-semibold text-white"
                        : "text-[#3f3f3f] hover:bg-[#9F854E]/15",
                    )}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          ) : (
            <div dir="ltr">
              <div className="grid grid-cols-7 text-center text-xs font-medium text-[#8a8a8a]">
                {weekdays.map((day, index) => (
                  <span key={`${day}-${index}`} className="py-2">
                    {day}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 text-center">
                {calendarCells.map((day, index) => {
                  if (day == null) {
                    return <span key={`empty-${index}`} className="h-10" />;
                  }
                  const selected = draftDay === day;
                  const disabled = isFutureDay(day);
                  return (
                    <button
                      key={`${viewYear}-${viewMonth}-${day}`}
                      type="button"
                      disabled={disabled}
                      onClick={() => setDraftDay(day)}
                      className={cn(
                        "mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm transition",
                        disabled && "cursor-not-allowed text-gray-300",
                        !disabled &&
                          !selected &&
                          "text-[#3f3f3f] hover:bg-[#9F854E]/15",
                        selected && "bg-[#9F854E] font-semibold text-white",
                      )}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-1 flex items-center justify-end gap-6 px-2" dir="ltr">
            <button
              type="button"
              onClick={() => closePicker(false)}
              className="text-sm font-semibold text-[#9F854E]"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={confirmDate}
              disabled={draftDay == null}
              className="text-sm font-semibold text-[#9F854E] disabled:opacity-40"
            >
              {okLabel}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BirthDatePicker;
