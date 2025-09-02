import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateValue {
  startDate: Date;
  endDate: Date;
}

interface DateRangeFilterProps {
  value: DateValue;
  onChange: (value: DateValue) => void;
  className?: string;
  dropdownPosition?: 'left' | 'right';
}

export default function DateRangeFilter({ value, onChange, className = "", dropdownPosition = 'left' }: DateRangeFilterProps) {
  const [selectedRange, setSelectedRange] = useState({
    start: value.startDate,
    end: value.endDate
  });

  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedRange.start.getFullYear(), selectedRange.start.getMonth(), 1)
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectingStart, setSelectingStart] = useState(true);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  };

  const isDateInRange = (date: Date, start: Date, end: Date) => {
    return date >= start && date <= end;
  };

  const handlePresetClick = (presetValue: string) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newRange = { ...selectedRange };

    switch (presetValue) {
      case 'today':
        newRange = { start: today, end: today };
        break;
      case 'yesterday':
        newRange = { start: yesterday, end: yesterday };
        break;
      case 'thisWeek':
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + 1);
        newRange = { start: startOfWeek, end: today };
        break;
      case 'lastWeek':
        const lastWeekStart = new Date(today);
        lastWeekStart.setDate(today.getDate() - today.getDay() - 6);
        const lastWeekEnd = new Date(lastWeekStart);
        lastWeekEnd.setDate(lastWeekStart.getDate() + 6);
        newRange = { start: lastWeekStart, end: lastWeekEnd };
        break;
      case 'thisMonth':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        newRange = { start: startOfMonth, end: today };
        break;
      case 'lastMonth':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        newRange = { start: lastMonthStart, end: lastMonthEnd };
        break;
    }

    setSelectedRange(newRange);
    setCurrentMonth(new Date(newRange.start.getFullYear(), newRange.start.getMonth(), 1));
    onChange({ startDate: newRange.start, endDate: newRange.end });
  };

  const handleDateClick = (date: Date) => {
    let newRange;
    if (selectingStart) {
      newRange = { start: date, end: date };
      setSelectedRange(newRange);
      setSelectingStart(false);
    } else {
      if (date >= selectedRange.start) {
        newRange = { ...selectedRange, end: date };
      } else {
        newRange = { start: date, end: selectedRange.start };
      }
      setSelectedRange(newRange);
      setSelectingStart(true);
      onChange({ startDate: newRange.start, endDate: newRange.end });
    }
  };

  const handleApply = () => {
    onChange({ startDate: selectedRange.start, endDate: selectedRange.end });
    setIsOpen(false);
  };

  const presets = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'This week', value: 'thisWeek' },
    { label: 'Last week', value: 'lastWeek' },
    { label: 'This month', value: 'thisMonth' },
    { label: 'Last month', value: 'lastMonth' }
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const renderCalendar = (monthOffset = 0) => {
    const displayMonth = new Date(currentMonth);
    displayMonth.setMonth(displayMonth.getMonth() + monthOffset);

    const daysInMonth = getDaysInMonth(displayMonth);
    const firstDay = getFirstDayOfMonth(displayMonth);
    const days = [];

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Previous month days
    const prevMonth = new Date(displayMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthDays = getDaysInMonth(prevMonth);

    for (let i = 0; i < firstDay; i++) {
      const dayNumber = prevMonthDays - firstDay + i + 1;
      days.push(
        <div key={`prev-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm cursor-pointer hover:bg-gray-100 rounded-full">
          {dayNumber}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(displayMonth.getFullYear(), displayMonth.getMonth(), day);
      const isStart = isSameDay(date, selectedRange.start);
      const isEnd = isSameDay(date, selectedRange.end);
      const isInRange = isDateInRange(date, selectedRange.start, selectedRange.end);
      const isHovered = hoveredDate && isSameDay(date, hoveredDate);

      let className = 'w-8 h-8 flex items-center justify-center text-sm cursor-pointer rounded-full transition-all';

      if (isStart || isEnd) {
        className += ' bg-blue-500 text-white';
      } else if (isInRange) {
        className += ' bg-blue-100 text-blue-700';
      } else if (isHovered) {
        className += ' bg-gray-100';
      } else {
        className += ' hover:bg-gray-100';
      }

      days.push(
        <div
          key={day}
          className={className}
          onClick={() => handleDateClick(date)}
          onMouseEnter={() => setHoveredDate(date)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          {day}
        </div>
      );
    }

    // Next month days
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
    const nextMonthDays = totalCells - (firstDay + daysInMonth);
    const nextMonth = new Date(displayMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    for (let day = 1; day <= nextMonthDays; day++) {
      days.push(
        <div key={`next-${day}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm cursor-pointer hover:bg-gray-100 rounded-full">
          {day}
        </div>
      );
    }

    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">
            {monthNames[displayMonth.getMonth()]} {displayMonth.getFullYear()}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(day => (
            <div key={day} className="w-8 h-8 flex items-center justify-center text-xs text-gray-500 font-medium">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <span className="text-white text-[16px]">วันที่ </span>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 border border-gray-300 rounded-lg flex items-center gap-2 bg-white hover:border-gray-400 transition-colors text-[20px]"
        >
          <Calendar size={20} className="text-gray-500" />
          <span className="text-sm text-gray-700">
            {selectedRange.start ?
              `${formatDate(selectedRange.start)} - ${formatDate(selectedRange.end)}`
              : "Select date range..."
            }
          </span>
        </button>

        {isOpen && (
          <div className={`absolute top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max ${dropdownPosition === 'right' ? 'right-0' : 'left-0'
            }`}>
            <div className="flex">
              {/* Presets Sidebar */}
              <div className="w-40 border-r border-gray-200 p-2">
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => handlePresetClick(preset.value)}
                    className="w-full text-left px-3 py-2 rounded text-sm transition-colors hover:bg-gray-50 text-gray-700"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Calendar - Two months side by side */}
              <div className="flex">
                {renderCalendar(0)}
                {renderCalendar(1)}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formatDate(selectedRange.start)}
                  readOnly
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-28"
                />
                <span className="text-gray-400">–</span>
                <input
                  type="text"
                  value={formatDate(selectedRange.end)}
                  readOnly
                  className="px-2 py-1 border border-gray-300 rounded text-sm w-28"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApply}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

