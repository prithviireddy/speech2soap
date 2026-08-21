import { useState, useRef, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const QUICK_HOURS = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
const QUICK_MINUTES = ['00', '15', '30', '45'];

export const DateTimePicker = ({
  value = '',
  onChange,
  showTime = true,
  placeholder = 'Select date & time',
  disabled = false,
  className = '',
  minDate = null,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Parse current value
  const parsedDate = useMemo(() => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  }, [value]);

  // View state for the calendar navigation
  const [viewYear, setViewYear] = useState(() => parsedDate ? parsedDate.getFullYear() : new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => parsedDate ? parsedDate.getMonth() : new Date().getMonth());

  // Time state (12-hour format)
  const [selectedHour, setSelectedHour] = useState(() => {
    if (!parsedDate) return 9;
    const h = parsedDate.getHours();
    return h % 12 === 0 ? 12 : h % 12;
  });

  const [selectedMinute, setSelectedMinute] = useState(() => {
    if (!parsedDate) return '00';
    const m = parsedDate.getMinutes();
    return m < 10 ? `0${m}` : `${m}`;
  });

  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    if (!parsedDate) return 'AM';
    return parsedDate.getHours() >= 12 ? 'PM' : 'AM';
  });

  // Sync view when parsedDate changes
  useEffect(() => {
    if (parsedDate) {
      setViewYear(parsedDate.getFullYear());
      setViewMonth(parsedDate.getMonth());
      const h = parsedDate.getHours();
      setSelectedHour(h % 12 === 0 ? 12 : h % 12);
      const m = parsedDate.getMinutes();
      setSelectedMinute(m < 10 ? `0${m}` : `${m}`);
      setSelectedPeriod(h >= 12 ? 'PM' : 'AM');
    }
  }, [parsedDate]);

  // Close on click outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Calendar grid calculations
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

    const days = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: viewMonth - 1,
        year: viewMonth === 0 ? viewYear - 1 : viewYear,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month: viewMonth,
        year: viewYear,
        isCurrentMonth: true,
      });
    }

    // Next month padding to complete 42 cells (6 rows)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        month: viewMonth + 1,
        year: viewMonth === 11 ? viewYear + 1 : viewYear,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const formatValueString = (year, month, day, hour12, minute, period) => {
    const y = year;
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');

    if (!showTime) {
      return `${y}-${m}-${d}`;
    }

    let h24 = Number(hour12);
    if (period === 'PM' && h24 < 12) h24 += 12;
    if (period === 'AM' && h24 === 12) h24 = 0;
    const hStr = String(h24).padStart(2, '0');
    const mStr = String(minute).padStart(2, '0');

    return `${y}-${m}-${d}T${hStr}:${mStr}`;
  };

  const handleDaySelect = (dayObj) => {
    const formatted = formatValueString(
      dayObj.year,
      dayObj.month,
      dayObj.day,
      selectedHour,
      selectedMinute,
      selectedPeriod
    );
    onChange(formatted);
    if (!showTime) {
      setIsOpen(false);
    }
  };

  const handleTimeChange = (hour, minute, period) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    setSelectedPeriod(period);

    if (parsedDate) {
      const formatted = formatValueString(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
        hour,
        minute,
        period
      );
      onChange(formatted);
    }
  };

  const handleSetToday = () => {
    const now = new Date();
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
    const h = now.getHours();
    const hr = h % 12 === 0 ? 12 : h % 12;
    const min = now.getMinutes() < 10 ? `0${now.getMinutes()}` : `${now.getMinutes()}`;
    const per = h >= 12 ? 'PM' : 'AM';

    setSelectedHour(hr);
    setSelectedMinute(min);
    setSelectedPeriod(per);

    const formatted = formatValueString(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hr,
      min,
      per
    );
    onChange(formatted);
    if (!showTime) setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
  };

  // Formatted display text
  const displayLabel = useMemo(() => {
    if (!parsedDate) return placeholder;

    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };

    if (showTime) {
      options.hour = 'numeric';
      options.minute = '2-digit';
      options.hour12 = true;
    }

    return parsedDate.toLocaleString([], options);
  }, [parsedDate, placeholder, showTime]);

  const isSelected = (dayObj) => {
    if (!parsedDate) return false;
    return (
      parsedDate.getFullYear() === dayObj.year &&
      parsedDate.getMonth() === dayObj.month &&
      parsedDate.getDate() === dayObj.day
    );
  };

  const isToday = (dayObj) => {
    const now = new Date();
    return (
      now.getFullYear() === dayObj.year &&
      now.getMonth() === dayObj.month &&
      now.getDate() === dayObj.day
    );
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm transition-all text-left cursor-pointer ${
          isOpen
            ? 'border-brand-primary ring-2 ring-brand-primary/15 bg-bg-secondary'
            : 'border-border-default hover:border-border-strong bg-bg-secondary hover:bg-bg-surface-subtle/40'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <CalendarIcon size={16} className="text-brand-primary shrink-0" />
          <span className={`truncate ${parsedDate ? 'text-text-primary font-medium' : 'text-text-muted'}`}>
            {displayLabel}
          </span>
        </div>
        {showTime && parsedDate && (
          <div className="flex items-center gap-1 text-xs text-text-muted font-mono shrink-0">
            <Clock size={13} />
            <span>
              {selectedHour}:{selectedMinute} {selectedPeriod}
            </span>
          </div>
        )}
      </button>

      {/* Floating Popover Calendar Modal */}
      {isOpen && (
        <div className="absolute z-50 mt-2 p-4 rounded-2xl glass-dropdown border border-border-default shadow-2xl animate-fade-in-scale w-full sm:w-[360px] md:w-[420px] left-0 sm:left-auto">
          {/* Calendar Header Navigation */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-border-subtle">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-sm text-text-primary">
                {MONTH_NAMES[viewMonth]}
              </span>
              <span className="text-sm text-text-muted font-mono">
                {viewYear}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-surface-subtle transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-surface-subtle transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center mb-4">
            {WEEKDAYS.map((wd) => (
              <span key={wd} className="text-[11px] font-semibold text-text-muted py-1 uppercase">
                {wd}
              </span>
            ))}

            {calendarDays.map((d, idx) => {
              const active = isSelected(d);
              const today = isToday(d);

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDaySelect(d)}
                  className={`h-8 w-8 mx-auto rounded-lg text-xs font-medium flex items-center justify-center transition-all cursor-pointer ${
                    active
                      ? 'bg-brand-primary text-white font-bold shadow-md shadow-brand-primary/25 scale-105'
                      : d.isCurrentMonth
                      ? today
                        ? 'border border-brand-primary text-brand-primary font-bold bg-brand-primary-light/50'
                        : 'text-text-primary hover:bg-bg-surface-subtle'
                      : 'text-text-muted/40 hover:bg-bg-surface-subtle/30'
                  }`}
                >
                  {d.day}
                </button>
              );
            })}
          </div>

          {/* Time Picker Controls (If Enabled) */}
          {showTime && (
            <div className="pt-3 border-t border-border-subtle space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                  <Clock size={13} className="text-brand-primary" />
                  Select Time
                </span>
                <span className="text-xs font-mono font-semibold text-brand-primary bg-brand-primary-light px-2 py-0.5 rounded-md">
                  {selectedHour}:{selectedMinute} {selectedPeriod}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Hours */}
                <select
                  value={selectedHour}
                  onChange={(e) => handleTimeChange(Number(e.target.value), selectedMinute, selectedPeriod)}
                  className="flex-1 px-2.5 py-1.5 bg-bg-base border border-border-default rounded-lg text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary cursor-pointer"
                >
                  {QUICK_HOURS.map((h) => (
                    <option key={h} value={h}>
                      {h < 10 ? `0${h}` : h}
                    </option>
                  ))}
                </select>

                <span className="text-text-muted font-bold">:</span>

                {/* Minutes */}
                <select
                  value={selectedMinute}
                  onChange={(e) => handleTimeChange(selectedHour, e.target.value, selectedPeriod)}
                  className="flex-1 px-2.5 py-1.5 bg-bg-base border border-border-default rounded-lg text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary cursor-pointer"
                >
                  {QUICK_MINUTES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                {/* AM / PM Toggle */}
                <div className="flex rounded-lg border border-border-default p-0.5 bg-bg-base">
                  <button
                    type="button"
                    onClick={() => handleTimeChange(selectedHour, selectedMinute, 'AM')}
                    className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      selectedPeriod === 'AM'
                        ? 'bg-brand-primary text-white shadow-xs'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTimeChange(selectedHour, selectedMinute, 'PM')}
                    className={`px-2 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      selectedPeriod === 'PM'
                        ? 'bg-brand-primary text-white shadow-xs'
                        : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    PM
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions Footer */}
          <div className="flex items-center justify-between pt-3 mt-3 border-t border-border-subtle text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSetToday}
                className="text-brand-primary hover:underline font-medium cursor-pointer"
              >
                {showTime ? 'Now' : 'Today'}
              </button>
              {parsedDate && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-text-muted hover:text-danger hover:underline cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-brand-primary text-white hover:bg-brand-primary-hover font-medium cursor-pointer shadow-xs transition-colors"
            >
              <Check size={12} />
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
