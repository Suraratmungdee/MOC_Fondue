"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDateRange } from "@/contexts/DateRangeContext";
import Header from "@/components/list/Heaader";
import { getCategoryColor } from "@/lib/getCategoryColor";
import { useRouter } from 'next/navigation';
import { NewsDialog } from "@/components/news/";


interface CategoryData {
    category: string;
    count_category: number;
    percent: string;
}

export default function Category() {
    const router = useRouter();
    const { toast } = useToast();
    const { value } = useDateRange();
    const [data, setData] = useState<CategoryData[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSite, setSelectedSite] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Function to fetch category data from API
    const fetchCategoryData = async (sdate?: Date, edate?: Date) => {

        setLoading(true);
        try {
            let url = '/api/category';

            // If date is provided, add it as query parameter
            if (sdate && edate) {
                // Use local date formatting to avoid timezone issues
                const start_date = sdate.getFullYear() + '-' + String(sdate.getMonth() + 1).padStart(2, '0') + '-' + String(sdate.getDate()).padStart(2, '0');
                const end_date = edate.getFullYear() + '-' + String(edate.getMonth() + 1).padStart(2, '0') + '-' + String(edate.getDate()).padStart(2, '0');

                url += `?sdate=${start_date}&edate=${end_date}`;
            }

            const response = await fetch(url);
            const result = await response.json();

            if (result.res_status === '200') {
                const total = result.res_result.reduce((sum: number, item: any) => sum + item.count_category, 0);
                const data = result.res_result.map((item: any) => ({
                    category: item.category,
                    count_category: item.count_category,
                    percent: ((item.count_category / total) * 100).toFixed(2)
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

    // Fetch data when component mounts
    // useEffect(() => {
    //     fetchCategoryData();
    // }, []);

    // Fetch data when date changes
    useEffect(() => {
        if (value) {
            fetchCategoryData(value.startDate, value.endDate);
        }
    }, [value]);

    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        router.push('/login');
    };

    const handleCardClick = (category: string) => {
        setSelectedSite(category);
        setDialogOpen(true);
    };

    const handleExport = () => {

    };

    const handleOpenClick = (category: string) => {
        sessionStorage.setItem('selectedCategory', category);
        router.push(`/category/list`);
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
                        <div className="flex items-center justify-between space-x-4 flex-nowrap">
                            <div className="flex items-center gap-1 min-w-0">
                                <h2 className="text-white text-3xl font-semibold mr-3 whitespace-nowrap">หมวดหมู่</h2>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 ">
                        <div className="text-white space-y-4">
                            {loading ? (
                                <div className="text-center text-white">Loading...</div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    {data.map((item, index) => (
                                        <div
                                            // onClick={() => handleCardClick(item.category)}
                                            onClick={() => handleOpenClick(item.category)}
                                            key={index}
                                            className="border-2 border-white/10 p-2 rounded-lg bg-transparent"
                                            style={{ display: 'grid', gridTemplateColumns: '28px 1fr 72px 96px', alignItems: 'center', gap: '12px' }}
                                        >
                                            {/* color swatch */}
                                            <div
                                                className="w-5 h-5 rounded-md"
                                                style={{ backgroundColor: getCategoryColor(item.category) }}
                                            />

                                            {/* name (truncates) */}
                                            <div className="min-w-0">
                                                <span className="text-white truncate block">{item.category}</span>
                                            </div>

                                            {/* count */}
                                            <div className="flex flex-col items-center justify-center border-r border-white/20">
                                                <div className="text-lg font-bold text-white tabular-nums">{item.count_category}</div>
                                                <div className="text-xs text-gray-300">ข่าว</div>
                                            </div>

                                            {/* percent */}
                                            <div className="flex flex-col items-center justify-center ">
                                                <div className="text-lg text-white">{item.percent}%</div>
                                                <div className="text-xs text-gray-300">เปอร์เซ็นต์ (%)</div>
                                            </div>
                                        </div>

                                    ))}
                                </div>
                            )}
                        </div>

                        {selectedSite && (
                            <NewsDialog
                                category={selectedSite}
                                manu='category'
                                sdate={value.startDate}
                                edate={value.endDate}
                                open={dialogOpen}
                                onOpenChange={setDialogOpen}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}