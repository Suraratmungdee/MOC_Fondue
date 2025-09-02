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
import { useRouter } from 'next/navigation';
import ProvinceList, { ProvinceData } from "@/components/list/ProvinceList";
import { useDateRange } from "@/contexts/DateRangeContext";


interface Region {
    region_id: number;
    name: string;
}

interface Statistics {
    region_id: number;
    region_name: string;
    province_count: number;
}

export default function Province() {
    const router = useRouter();
    const { value } = useDateRange();
    const [regions, setRegions] = useState<Region[]>([]);
    const [provinces, setProvinces] = useState<ProvinceData[]>([]);
    const [statistics, setStatistics] = useState<Statistics[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<string>("10");
    const [loading, setLoading] = useState({
        regions: true,
        provinces: true,
        statistics: true
    });

    // ฟังก์ชันดึงข้อมูลภูมิภาค
    const fetchRegions = async () => {
        try {
            const response = await fetch('/api/regions');
            const data = await response.json();

            if (data.res_status === '200') {
                setRegions(data.res_result);
            } else {
                console.error('Error fetching regions:', data);
            }
        } catch (error) {
            console.error('Error fetching regions:', error);
        } finally {
            setLoading(prev => ({ ...prev, regions: false }));
        }
    };

    // ฟังก์ชันดึงข้อมูลจังหวัด
    const fetchProvinces = async (regionId?: string) => {
        try {
            setLoading(prev => ({ ...prev, provinces: true }));

            // สร้าง URL parameters
            const params = new URLSearchParams();
            if (regionId && regionId !== "10") {
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

    // โหลดข้อมูลเริ่มต้น
    useEffect(() => {
        fetchRegions();
        fetchProvinces();
        // fetchStatistics();
    }, []);

    // เมื่อเปลี่ยนภูมิภาค ให้ดึงข้อมูลจังหวัดใหม่
    useEffect(() => {
        const selectedRegionData = regions.find(r => r.region_id.toString() === selectedRegion);
        const regionId = selectedRegionData ? selectedRegionData.region_id.toString() : "10";
        fetchProvinces(regionId);
    }, [selectedRegion, regions]);

    // เมื่อ date range เปลี่ยน ให้ดึงข้อมูลจังหวัดใหม่
    useEffect(() => {
        if (value.startDate && value.endDate) {
            const selectedRegionData = regions.find(r => r.region_id.toString() === selectedRegion);
            const regionId = selectedRegionData ? selectedRegionData.region_id.toString() : "10";
            fetchProvinces(regionId);
        }
    }, [value.startDate, value.endDate]);

    const handleClick = () => {
        // ใช้ sessionStorage เพื่อไม่ให้เห็นข้อมูลใน URL
        // sessionStorage.setItem('provinces', JSON.stringify(provinces));

        sessionStorage.setItem('selectedRegion', selectedRegion);
        router.push('/province');
    };

    return (
        <div className="border-2 border-[#004D8F] rounded-3xl h-full">
            <div className="border-b-2 border-[#004D8F] p-4">
                <div className="flex items-center justify-between space-x-4 flex-nowrap">
                    <div className="flex items-center gap-1 min-w-0">
                        <h2 className="text-white text-3xl font-semibold mr-3 whitespace-nowrap">จังหวัด</h2>
                        <label className="text-white text-2xl whitespace-nowrap">ดูทั้งหมด</label>
                        <Button
                            onClick={handleClick}
                            variant="secondary"
                            size="icon"
                            className="size-6 rounded-full bg-black text-white hover:bg-black">
                            <ChevronRightIcon />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <label className="text-white text-xl whitespace-nowrap mr-2">ภูมิภาค</label>
                        <div className="whitespace-nowrap">
                            <Select
                                value={selectedRegion}
                                onValueChange={setSelectedRegion}
                                disabled={loading.regions}
                            >
                                <SelectTrigger className="w-60 text-base font-semibold text-white">
                                    <SelectValue placeholder={loading.regions ? "กำลังโหลด..." : "ทุกภูมิภาค"} />
                                </SelectTrigger>
                                <SelectContent className="text-base font-semibold">
                                    {regions.map((region) => (
                                        <SelectItem key={region.region_id} value={region.region_id.toString()}>
                                            {region.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <div className="text-white space-y-4">

                    <ProvinceList
                        data={provinces}
                    />

                </div>
            </div>
        </div>
    );
}
