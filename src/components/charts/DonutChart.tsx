'use client'

import React from 'react'
import CircleChart from './CircleChart'

interface DonutChartData {
    name: string
    value: number
    color: string
}

interface DonutChartProps {
    data: DonutChartData[]
    title?: string
    centerText?: string
    width?: string | number
    height?: string | number
    innerRadius?: string
    outerRadius?: string
    showLegend?: boolean
    showLabels?: boolean
    legendPosition?: 'top' | 'bottom' | 'left' | 'right'
}

export default function DonutChart(props: DonutChartProps) {
    // Use the existing CircleChart implementation as a lightweight fallback
    const { data, centerText } = props
    return (
        <div className="w-full">
            <CircleChart data={data.map(d => ({ name: d.name, value: d.value, color: d.color }))} centerText={centerText} />
        </div>
    )
}

// ตัวอย่างการใช้งาน:
export const sampleData: DonutChartData[] = [
    { name: 'เกษตรกรรม', value: 35, color: '#8BC34A' },
    { name: 'อุตสาหกรรม', value: 28, color: '#FF9800' },
    { name: 'บริการ', value: 22, color: '#2196F3' },
    { name: 'การค้า', value: 15, color: '#9C27B0' },
    { name: 'อื่นๆ', value: 8, color: '#00BCD4' },
    { name: 'การท่องเที่ยว', value: 5, color: '#FF5722' }
]
