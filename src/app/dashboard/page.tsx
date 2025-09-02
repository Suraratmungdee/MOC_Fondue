"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDateRange } from "@/contexts/DateRangeContext";
import Header from "@/components/dashboard/Header";
import Province from "@/components/dashboard/Province";
import News from "@/components/dashboard/News";
import Category from "@/components/dashboard/Category";
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { value } = useDateRange();
    
    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        window.location.href = "/login";
    };

    const handleExport = () => {
        toast({
            title: "Export Started",
        });
    };

    const handleClick = () => {
        router.push('/news');

    };

    return (
        <div className="min-h-screen bg-indigo-950">
            {/* Header Navigation */}
            <Header
                onLogout={handleLogout}
                onExport={handleExport}
            />

            {/* Main Content */}
            <div className="p-6">
                {/* Layout: ซ้าย 1 ช่อง, ขวาบน 1 ช่อง, ขวาล่าง 1 ช่อง */}
                <div className="grid grid-cols-2 gap-6">
                    {/* ช่องซ้าย */}
                    <div className="h-auto">
                        <Province />
                    </div>

                    <div className="grid gap-2">
                        {/* ช่องขวาบน */}
                        <div className="h-auto">
                            <News />
                        </div>

                        {/* ช่องขวาล่าง */}
                        <div className="h-auto">
                            <Category />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}