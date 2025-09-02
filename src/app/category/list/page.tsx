"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDateRange } from "@/contexts/DateRangeContext";
import Header from "@/components/list/Heaader";
import { useRouter } from 'next/navigation';
import { NewsDialog } from "@/components/news/";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { getCategoryColor } from "@/lib/getCategoryColor";


interface ProvinceData {
    province_id: number;
    name: string;
    region_id: number;
    province_no: number;
    ids?: number[];           // array ของ id ข่าว
    news_count?: number;      // จำนวนข่าว
    percentage?: number;      // เปอร์เซ็นต์
}

export default function News() {
    const router = useRouter();
    const { toast } = useToast();
    const { value } = useDateRange();
    const [data, setData] = useState<ProvinceData[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectedProvinceName, setSelectedProvinceName] = useState<string>("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [storedCategory, setStoredCategory] = useState<string>("");

    // Function to fetch category data from API
    const fetchCategoryData = async (sdate?: Date, edate?: Date, category?: string) => {
        setLoading(true);
        try {
            // Create URL with proper parameter handling
            const params = new URLSearchParams();
            
            // If date is provided, add it as query parameter
            if (sdate && edate) {
                // Use local date formatting to avoid timezone issues
                const start_date = sdate.getFullYear() + '-' + String(sdate.getMonth() + 1).padStart(2, '0') + '-' + String(sdate.getDate()).padStart(2, '0');
                const end_date = edate.getFullYear() + '-' + String(edate.getMonth() + 1).padStart(2, '0') + '-' + String(edate.getDate()).padStart(2, '0');

                params.append('sdate', start_date);
                params.append('edate', end_date);
            }

            if (category) {
                params.append('category', category);
            }

            const url = `/api/category-list?${params.toString()}`;
            console.log('API URL:', url); // For debugging - แสดง URL ที่เรียกใช้

            const response = await fetch(url);
            const result = await response.json();

            if (result.res_status === '200') {
                const total = result.res_result.reduce((sum: number, item: any) => sum + item.news_count, 0);
                const data = result.res_result.map((item: any) => ({
                    name: item.name,
                    news_count: item.news_count,
                    ids: item.ids || [],
                    percentage: ((item.news_count / total) * 100).toFixed(2)
                }));

                setData(data);
            }
        } catch (error) {
            console.error('Error fetching category data:', error);
            toast({
                title: "Error",
                description: "Failed to fetch category data",
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when date changes
    useEffect(() => {
        const storedCategory = sessionStorage.getItem('selectedCategory');
        setStoredCategory(storedCategory || "");
        if (value) {
            fetchCategoryData(value.startDate, value.endDate, storedCategory || "");
        }
    }, [value]);

    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        window.location.href = "/login";
    };

    const handleExport = () => {
        toast({
            title: "Export Started",
        });
    };

    const handleCardClick = (ids: number[]) => {
        setSelectedIds(ids);
        // setSelectedProvinceName(provinceName);
        setDialogOpen(true);
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
                <div className="border-[1px] border-[#0A9ACA] rounded-3xl h-full bg-[#0A416F80]">
                    <div className="border-b-[1px] border-[#004D8F] p-4">
                        <div className="flex items-center justify-start min-h-[60px]">
                            <div className="flex items-center gap-2">
                                <h2 className="text-white text-3xl font-semibold whitespace-nowrap">หมวดหมู่</h2>
                                <ChevronRightIcon className="size-6 text-white" />
                                <div
                                    className="w-5 h-5 rounded-md"
                                    style={{ backgroundColor: getCategoryColor(storedCategory) }}
                                />
                                <div className="text-white text-2xl font-semibold">{storedCategory}</div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 ">
                        <div className="text-white space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                {data.filter(item => item.news_count && item.news_count > 0).map((item, index) => (
                                    <div
                                        key={index}
                                        className="border-[1px] border-[#0A9ACA] p-4 bg-[#FFFFFF1A] rounded-2xl cursor-pointer hover:bg-[#FFFFFF2A] transition-colors duration-200"
                                        onClick={() => handleCardClick(item.ids || [])}
                                    >
                                        <div className="flex items-center justify-between space-x-4 flex-nowrap">
                                            <div className="flex items-center gap-1 min-w-0">
                                                <span className="text-white text-2xl font-semibold">{item.name}</span>
                                            </div>
                                            <div className="flex items-end space-x-4">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="text-3xl font-bold text-white tabular-nums">{item.news_count}<span className="text-xl text-gray-300"> ข่าว</span></div>
                                                </div>

                                                <div className="flex flex-col items-center justify-center border-l border-white/20 pl-4">
                                                    <div className="text-3xl text-white font-bold">{item.percentage}<span className="text-xl text-gray-300"> %</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* NewsDialog placed outside the map */}
                            {selectedIds.length > 0 && (
                                <NewsDialog
                                    ids={selectedIds}
                                    // provinceName={selectedProvinceName}
                                    manu='category-list'
                                    sdate={value?.startDate}
                                    edate={value?.endDate}
                                    open={dialogOpen}
                                    onOpenChange={setDialogOpen}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}