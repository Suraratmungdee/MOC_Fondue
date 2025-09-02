"use client";
import { useState, useEffect } from 'react';

interface UseSessionStorageReturn<T> {
    data: T | null;
    setData: (data: T) => void;
    clearData: () => void;
}

export function useSessionStorage<T>(key: string): UseSessionStorageReturn<T> {
    const [data, setStoredData] = useState<T | null>(null);

    // useEffect(() => {
    //     // อ่านข้อมูลจาก sessionStorage เมื่อ component mount
    //     const stored = sessionStorage.getItem(key);
    //     if (stored) {
    //         try {
    //             const parsed = JSON.parse(stored);
    //             setStoredData(parsed);
    //             console.log(`${key} loaded from sessionStorage:`, parsed);
    //         } catch (error) {
    //             console.error(`Error parsing ${key} from sessionStorage:`, error);
    //         }
    //     }
    // }, [key]);

    const setData = (newData: T) => {
        try {
            sessionStorage.setItem(key, JSON.stringify(newData));
            setStoredData(newData);
            console.log(`${key} saved to sessionStorage:`, newData);
        } catch (error) {
            console.error(`Error saving ${key} to sessionStorage:`, error);
        }
    };

    const clearData = () => {
        sessionStorage.removeItem(key);
        setStoredData(null);
        console.log(`${key} cleared from sessionStorage`);
    };

    return { data, setData, clearData };
}
