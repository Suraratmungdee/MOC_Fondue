import { ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { DonutChart, CircleChart } from '@/components/charts'
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast";
import { useDateRange } from "@/contexts/DateRangeContext";
import { useRouter } from 'next/navigation';

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
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

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
                // console.log('API URL with dates:', url);
            }

            const response = await fetch(url);
            const result = await response.json();
            // console.log('API Response:', result);

            if (result.res_status === '200') {
                const total = result.res_result.reduce((sum: number, item: any) => sum + item.count_category, 0);
                const data = result.res_result.map((item: any) => ({
                    category: item.category,
                    count_category: item.count_category,
                    percent: ((item.count_category / total) * 100).toFixed(2)
                }));
                setTotal(total);
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

    // Fetch data when component mounts or date changes
    useEffect(() => {
        // Always use date range from context, even on initial load
        if (value && value.startDate && value.endDate) {
            fetchCategoryData(value.startDate, value.endDate);
        }
    }, [value]);

    const handleClick = () => {
        // window.location.href = "/category";
        router.push('/category');
    };

    return (
        <div className="border-2 border-[#004D8F] rounded-3xl overflow-hidden">
            <div className="border-b-2 border-[#004D8F] p-4">
                <div className="flex items-center space-x-4 ">
                    <div className="flex items-center gap-1">
                        <h2 className="text-white text-3xl font-semibold mr-3">หมวดหมู่</h2>
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
                <CircleChart
                    data={data}
                    total={total}
                    size={320}
                    strokeWidth={40}
                    centerText="118"
                    showPercentage={true}
                />
            </div>
        </div>
    );
}
