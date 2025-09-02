"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDateRange } from "@/contexts/DateRangeContext";
import Header from "@/components/list/Heaader";
import { useRouter } from 'next/navigation';
import { NewsDialog } from "@/components/news/";

interface NewsData {
    site_name: string;
    count_site: number;
    percent: string;
}

export default function News() {
    const router = useRouter();
    const { toast } = useToast();
    const { value } = useDateRange();
    const [data, setData] = useState<NewsData[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSite, setSelectedSite] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // Function to fetch category data from API
    const fetchNewsData = async (sdate?: Date, edate?: Date) => {

        setLoading(true);
        try {
            let url = '/api/news';

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
                const total = result.res_result.reduce((sum: number, item: any) => sum + item.count_site, 0);
                const data = result.res_result.map((item: any) => ({
                    site_name: item.site_name,
                    count_site: item.count_site,
                    percent: ((item.count_site / total) * 100).toFixed(2)
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
        if (value) {
            fetchNewsData(value.startDate, value.endDate);
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

    const handleCardClick = (siteName: string) => {
        setSelectedSite(siteName);
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
                        <div className="flex items-center justify-between space-x-4 flex-nowrap">
                            <div className="flex items-center gap-1 min-w-0">
                                <h2 className="text-white text-3xl font-semibold mr-3 whitespace-nowrap">สำนักข่าว</h2>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 ">
                        <div className="text-white space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                {data.map((item, index) => (
                                    <div 
                                        key={index} 
                                        className="border-[1px] border-[#0A9ACA] p-4 bg-[#FFFFFF1A] rounded-2xl cursor-pointer hover:bg-[#FFFFFF2A] transition-colors duration-200"
                                        onClick={() => handleCardClick(item.site_name)}
                                    >
                                        <div className="flex items-center justify-between space-x-4 flex-nowrap">
                                            <div className="flex items-center gap-1 min-w-0">
                                                <span className="text-white text-2xl font-semibold">{item.site_name}</span>
                                            </div>
                                            <div className="flex items-end space-x-4">
                                                <div className="flex flex-col items-center justify-center">
                                                    <div className="text-3xl font-bold text-white tabular-nums">{item.count_site}<span className="text-xl text-gray-300"> ข่าว</span></div>
                                                </div>

                                                <div className="flex flex-col items-center justify-center border-l border-white/20 pl-4">
                                                    <div className="text-3xl text-white font-bold">{item.percent}<span className="text-xl text-gray-300"> %</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* NewsDialog placed outside the map */}
                            {selectedSite && (
                                <NewsDialog 
                                    siteName={selectedSite}
                                    manu='news' 
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
        </div>
    )
}