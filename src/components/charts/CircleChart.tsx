'use client'

import React, { useState } from 'react'
import { getCategoryColor } from "@/lib/getCategoryColor";
import { NewsDialog } from "@/components/news/";
import { useDateRange } from "@/contexts/DateRangeContext";


interface CircleChartData {
    name: string
    value: number
    color: string
    percentage?: number
}

interface CategoryData {
    category: string;
    count_category: number;
    percent: string;
}

interface CircleChartProps {
    data: CategoryData[],
    total?: number,
    size?: number
    strokeWidth?: number
    showPercentage?: boolean
    centerText?: string
    centerSubText?: string
    className?: string
}

export default function CircleChart({
    data,
    total,
    size = 320,
    strokeWidth = 40,
    showPercentage = true,
    centerText,
    centerSubText,
    className = ''
}: CircleChartProps) {
    const center = size / 2
    const radius = (size - strokeWidth) / 2
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [selectedSite, setSelectedSite] = useState<string | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
        const { value } = useDateRange();
    

    const data_total = data.reduce((sum, item) => sum + item.count_category, 0)
    const dataWithPercentage = data.map(item => ({
        ...item,
        percentage: (item.count_category / data_total) * 100
    }))

    const createDonutArcPath = (startAngle: number, endAngle: number) => {
        const startRadians = (startAngle * Math.PI) / 180
        const endRadians = (endAngle * Math.PI) / 180

        const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

        const x1 = center + radius * Math.cos(startRadians)
        const y1 = center + radius * Math.sin(startRadians)
        const x2 = center + radius * Math.cos(endRadians)
        const y2 = center + radius * Math.sin(endRadians)

        // round coordinates to fixed decimals so server and client produce identical strings
        const fmt = (n: number) => n.toFixed(3)
        const x1s = fmt(x1)
        const y1s = fmt(y1)
        const x2s = fmt(x2)
        const y2s = fmt(y2)
        const rs = fmt(radius)

        if (endAngle - startAngle >= 360) {
            return `M ${x1s} ${y1s} A ${rs} ${rs} 0 1 1 ${(+x2s - 0.01).toFixed(3)} ${y2s} A ${rs} ${rs} 0 1 1 ${x1s} ${y1s}`
        } else {
            return `M ${x1s} ${y1s} A ${rs} ${rs} 0 ${largeArcFlag} 1 ${x2s} ${y2s}`
        }
    }

    let currentAngle = -90
    const gapBetweenSlices = 0
    const slices = dataWithPercentage.slice(0, 8).map(item => {
        const sliceAngle = (item.percentage! / 100) * 360 - gapBetweenSlices
        const slice = {
            ...item,
            startAngle: currentAngle,
            endAngle: currentAngle + sliceAngle
        }
        currentAngle += sliceAngle + gapBetweenSlices
        return slice
    })

    // console.log(slices);

    const handleCardClick = (category: string) => {
        setSelectedSite(category);
        setDialogOpen(true);
    };


    return (
        <div className={`flex items-center gap-6 ${className} p-4`}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                    {slices.reverse().map((slice, index) => {
                        const isHovered = hoveredIndex === index
                        // คำนวณ vector สำหรับ translate เวลา hover
                        const midAngle = (slice.startAngle + slice.endAngle) / 2
                        const translateDistance = isHovered ? 10 : 0
                        const dx = translateDistance * Math.cos((midAngle * Math.PI) / 180)
                        const dy = translateDistance * Math.sin((midAngle * Math.PI) / 180)

                        return (
                            <path
                                key={index}
                                d={createDonutArcPath(slice.startAngle, slice.endAngle)}
                                fill="none"
                                // stroke={slice.color}
                                stroke={getCategoryColor(slice.category)}
                                strokeWidth={strokeWidth}
                                strokeLinecap="round"
                                className="transition-all duration-300 cursor-pointer"
                                style={{
                                    filter: isHovered
                                        ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))'
                                        : 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))',
                                    transform: `translate(${dx}px, ${dy}px)`
                                }}
                            // onMouseEnter={() => setHoveredIndex(index)}
                            // onMouseLeave={() => setHoveredIndex(null)}
                            />
                        )
                    })}
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                        <div className="text-4xl font-bold mb-1">{total} <p className="text-2xl font-semibold text-gray-500">ข่าว</p> </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 min-w-[200px]">
                {dataWithPercentage.slice(0, 8).map((item, index) => (
                    <div
                        key={index}
                        className="border-2 border-white/10 p-2 rounded-lg bg-transparent"
                        style={{ display: 'grid', gridTemplateColumns: '28px 1fr 72px 96px', alignItems: 'center', gap: '12px' }}
                        onClick={() => handleCardClick(item.category)}
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
    )
}
