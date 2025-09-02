"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DateRangeValue {
    startDate: Date;
    endDate: Date;
}

interface DateRangeContextType {
    value: DateRangeValue;
    onChange: (value: DateRangeValue) => void;
}

const DateRangeContext = createContext<DateRangeContextType | undefined>(undefined);

interface DateRangeProviderProps {
    children: ReactNode;
}

// Helper functions for localStorage
const saveToLocalStorage = (value: DateRangeValue) => {
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem('dateRange', JSON.stringify({
                startDate: value.startDate.toISOString(),
                endDate: value.endDate.toISOString()
            }));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }
};

const loadFromLocalStorage = (): DateRangeValue | null => {
    if (typeof window !== 'undefined') {
        try {
            const saved = localStorage.getItem('dateRange');
            if (saved) {
                const parsed = JSON.parse(saved);
                return {
                    startDate: new Date(parsed.startDate),
                    endDate: new Date(parsed.endDate)
                };
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
    }
    return null;
};

export function DateRangeProvider({ children }: DateRangeProviderProps) {
    const [value, setValue] = useState<DateRangeValue>({
        startDate: new Date(),
        endDate: new Date(),
    });

    // Load saved date range on mount
    useEffect(() => {
        const savedValue = loadFromLocalStorage();
        if (savedValue) {
            setValue(savedValue);
        }
    }, []);

    const onChange = (newValue: DateRangeValue) => {
        setValue(newValue);
        saveToLocalStorage(newValue);
    };

    return (
        <DateRangeContext.Provider value={{ value, onChange }}>
            {children}
        </DateRangeContext.Provider>
    );
}

export function useDateRange() {
    const context = useContext(DateRangeContext);
    if (context === undefined) {
        throw new Error('useDateRange must be used within a DateRangeProvider');
    }
    return context;
}
