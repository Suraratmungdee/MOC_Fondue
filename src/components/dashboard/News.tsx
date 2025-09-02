import Image from "next/image";
import { ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDateRange } from "@/contexts/DateRangeContext";
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

    // Fetch data when component mounts
    // useEffect(() => {
    //     fetchCategoryData();
    // }, []);

    // Fetch data when date changes
    useEffect(() => {
        if (value) {
            fetchNewsData(value.startDate, value.endDate);
        }
    }, [value]);

    const handleClick = () => {
        // window.location.href = "/category";
        router.push('/news');
    };

    const handleCardClick = (siteName: string) => {
        setSelectedSite(siteName);
        setDialogOpen(true);
    };

    return (
        <div className="border-2 border-[#004D8F] rounded-3xl overflow-hidden">
            <div className="border-b-2 border-[#004D8F] p-4">
                <div className="flex items-center space-x-4 ">
                    <div className="flex items-center gap-1">
                        <h2 className="text-white text-3xl font-semibold mr-3">สำนักข่าว</h2>
                        <label className="text-white text-2xl">ดูทั้งหมด</label>
                        <Button
                            onClick={handleClick}
                            variant="secondary"
                            size="icon"
                            className="size-6 rounded-full bg-black text-white hover:bg-black">
                            <ChevronRightIcon />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-4 gap-4">

                    {data.slice(0, 8).map((item, index) => (

                        <div
                            key={index}
                            className="border-2 rounded-2xl p-4 flex flex-col h-auto"
                            onClick={() => handleCardClick(item.site_name)}

                        >
                            <h3 className="text-white text-xl font-medium text-center mb-2">{item.site_name}</h3>
                            <div className="flex justify-center items-center gap-4 flex-1">
                                <div className="text-center">
                                    <div className="text-white text-2xl font-bold">{item.count_site} <span className="text-base font-semibold text-gray-500">ข่าว</span></div>
                                </div>
                                <div className="text-center">
                                    <div className="text-white text-2xl font-semibold">{item.percent} <span className="text-base font-semibold text-gray-500">%</span></div>
                                </div>
                            </div>
                        </div>
                    ))}

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
    );
}
