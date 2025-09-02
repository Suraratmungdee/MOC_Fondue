'use client'

import React, { useState } from 'react'
import { Progress } from "@/components/ui/progress"
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useDateRange } from "@/contexts/DateRangeContext";
import { NewsDialog } from "@/components/news/";

export interface ProvinceData {
    province_id: number;
    name: string;
    region_id: number;
    province_no: number;
    ids?: number[];
    news_count?: number;
    percentage?: number;
}

interface ProvinceListProps {
    data: ProvinceData[]
}

export default function ProvinceList({
    data,
}: ProvinceListProps) {
    // หาจำนวนข่าวสูงสุดเพื่อใช้เป็น scale สำหรับหลอด
    const maxNewsCount = Math.max(...data.map(item => item.news_count || 0));
    const { value } = useDateRange();
    const [selectedSite, setSelectedSite] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleCardClick = (provinceName: string) => {
        setSelectedSite(provinceName);
        setDialogOpen(true);
    };

    return (
        <div className="grid grid-cols-1 gap-2 min-w-[200px]">
            {data.slice(0, 10).map((item, index) => (
                <div
                    key={index}
                    onClick={() => handleCardClick(item.name)}
                    className={`border-[1px] p-3 rounded-xl ${index === 0 ? 'border-[#FDB022] bg-[#FDB02230]' : index === 1 ? 'border-[#36BFFA] bg-[#36BFFA30]' : index === 2 ? 'border-[#FD853A] bg-[#FD853A30]' : 'border-[#5C17D4] bg-transparent'} justify-center items-center`}
                    style={{ display: 'grid', gridTemplateColumns: '28px 1fr 72px 96px', alignItems: 'center', gap: '12px' }}
                >
                    {/* color swatch */}
                    <div className="w-[30px] h-[30px] flex items-center justify-center">
                        {index === 0 && <Image src="/icons/one.svg" alt="Province Icon" width={30} height={40} />}
                        {index === 1 && <Image src="/icons/two.svg" alt="Province Icon" width={30} height={40} />}
                        {index === 2 && <Image src="/icons/three.svg" alt="Province Icon" width={30} height={40} />}
                        {index > 2 && <div className="flex items-center justify-center border-4 border-[#AFB5D9] rounded-full bg-[#5C17D4] w-[30px] h-[30px] text-white font-semibold text-sm">{index + 1}</div>}
                    </div>

                    {/* name (truncates) */}
                    <div className="flex items-center">
                        <span className="text-white text-lg font-semibold">{item.name}</span>
                    </div>

                    {/* count with tube visualization */}
                    <div className="flex flex-col items-center justify-center border-r border-white/20">
                        <div className="text-lg font-bold text-white tabular-nums">{item.news_count || 0}</div>
                        <div className="text-xs text-gray-300">ข่าว</div>

                    </div>

                    {/* percent */}
                    <div className="flex flex-col items-center justify-center ">
                        <div className="text-lg font-bold text-white">{item.percentage?.toFixed(2) || '0.00'}</div>
                        <div className="text-xs text-gray-300">เปอร์เซ็นต์ (%)</div>
                    </div>

                    {/* หลอดแสดงสัดส่วน - ขยายเต็มความกว้าง */}
                    <div className="col-span-4">
                        <div className="flex items-center gap-x-3 whitespace-nowrap">
                            <div className="flex w-full h-3 border-none rounded-full overflow-hidden dark:bg-neutral-700" role="progressbar" aria-valuenow={maxNewsCount > 0 ? ((item.news_count || 0) / maxNewsCount) * 100 : 0} aria-valuemin={0} aria-valuemax={100}>
                                <div className="flex flex-col justify-center rounded-full overflow-hidden bg-[#00FFFF] text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-[#00FFFF]" style={{ width: `${maxNewsCount > 0 ? ((item.news_count || 0) / maxNewsCount) * 100 : 25}%` }}></div>
                            </div>
                        </div>

                    </div>
                </div>
            ))}

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
    )
}