"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useDateRange } from "@/contexts/DateRangeContext";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import Header from "@/components/list/Heaader";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { NewsDialog } from "@/components/news/";
export interface ProvinceData {
    province_id: number;
    name: string;
    region_id: number;
    province_no: number;
    ids?: number[];           // array ของ id ข่าว
    news_count?: number;      // จำนวนข่าว
    percentage?: number;      // เปอร์เซ็นต์
}

export default function Province() {
    const router = useRouter();
    const { value } = useDateRange();
    const [provinces, setProvinces] = useState<ProvinceData[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<string>("10");
    const [loading, setLoading] = useState({
        regions: true,
        provinces: true,
        statistics: true
    });
    const { toast } = useToast();
    const [selectedSite, setSelectedSite] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);


    useEffect(() => {
        const storedRegion = sessionStorage.getItem('selectedRegion');
        if (storedRegion) {
            setSelectedRegion(storedRegion);
            fetchProvinces(storedRegion);
        } else {
            fetchProvinces();
        }
    }, []);

    const fetchProvinces = async (regionId?: string) => {
        try {
            setLoading(prev => ({ ...prev, provinces: true }));

            // สร้าง URL parameters
            const params = new URLSearchParams();
            if (regionId && regionId !== "ทุกภูมิภาค") {
                params.append('region_id', regionId);
            }
            if (value.startDate) {
                const year = value.startDate.getFullYear();
                const month = String(value.startDate.getMonth() + 1).padStart(2, '0');
                const day = String(value.startDate.getDate()).padStart(2, '0');
                params.append('sdate', `${year}-${month}-${day}`);
            }
            if (value.endDate) {
                const year = value.endDate.getFullYear();
                const month = String(value.endDate.getMonth() + 1).padStart(2, '0');
                const day = String(value.endDate.getDate()).padStart(2, '0');
                params.append('edate', `${year}-${month}-${day}`);
            }

            const url = `/api/provinces${params.toString() ? '?' + params.toString() : ''}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.res_status === '200') {
                setProvinces(data.res_result);
            } else {
                console.error('Error fetching provinces:', data);
            }
        } catch (error) {
            console.error('Error fetching provinces:', error);
        } finally {
            setLoading(prev => ({ ...prev, provinces: false }));
        }
    };

    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        window.location.href = "/login";
    };

    const handleExport = () => {
        toast({
            title: "Export Started",
        });
    };

    const handleNewsProgram = () => {
        toast({
            title: "Export Started",
        });
    };

    const handleClick = () => {
        toast({
            title: "View All News Clicked",
        });
    };

    const handleCardClick = (provinceName: string) => {
        setSelectedSite(provinceName);
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
                                <h2 className="text-white text-3xl font-semibold mr-3 whitespace-nowrap">จังหวัด</h2>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 ">
                        <div className="text-white space-y-4">
                            {provinces && provinces.length > 0 && (
                                <div className="grid grid-cols-6 gap-4">
                                    {provinces.map((item, index) => (
                                        <div
                                            onClick={() => handleCardClick(item.name)}
                                            key={index}
                                            className={`border-[1px] p-3 rounded-xl ${index === 0 ? 'border-[#FDB022] bg-[#FDB02230]' : index === 1 ? 'border-[#36BFFA] bg-[#36BFFA30]' : index === 2 ? 'border-[#FD853A] bg-[#FD853A30]' : 'border-[#5C17D4] bg-transparent'} overflow-hidden`}
                                        >
                                            <div className="flex items-center gap-2 w-full min-w-0">
                                                {/* Icon/Number */}
                                                <div className="w-[30px] h-[30px] flex items-center justify-center flex-shrink-0">
                                                    {index === 0 && <Image src="/icons/one.svg" alt="Province Icon" width={20} height={30} />}
                                                    {index === 1 && <Image src="/icons/two.svg" alt="Province Icon" width={20} height={30} />}
                                                    {index === 2 && <Image src="/icons/three.svg" alt="Province Icon" width={20} height={30} />}
                                                    {index > 2 && <div className="flex items-center justify-center border-4 border-[#AFB5D9] rounded-full bg-[#5C17D4] w-[25px] h-[25px] text-white font-semibold text-[10px]">{index + 1}</div>}
                                                </div>

                                                {/* Province Name */}
                                                <div className="flex-1 min-w-0">
                                                    <span className="text-white text-sm font-semibold truncate block">{item.name}</span>
                                                </div>

                                                {/* Count */}
                                                <div className="flex flex-col items-center justify-center border-r border-white/20 pr-2 flex-shrink-0">
                                                    <div className="text-sm font-bold text-white tabular-nums">{item.news_count || 0}</div>
                                                    <div className="text-xs text-gray-300">ข่าว</div>
                                                </div>

                                                {/* Percent */}
                                                <div className="flex flex-col items-center justify-center pl-2 flex-shrink-0">
                                                    <div className="text-sm font-bold text-white">{item.percentage?.toFixed(2) || '0.00'}</div>
                                                    <div className="text-xs text-gray-300">เปอร์เซ็นต์</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedSite && (
                                <NewsDialog
                                    provinceName={selectedSite}
                                    manu='province'
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