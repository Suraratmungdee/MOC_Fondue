import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Image from "next/image";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useDateRange } from "@/contexts/DateRangeContext";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";

interface NewsDialogProps {
    siteName?: string;
    category?: string;
    provinceName?: string;
    ids?: number[];
    manu?: string;
    sdate?: Date;
    edate?: Date;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

interface NewsDialogData {
    title: string;
    link_href: string;
    province: string;
}

export function NewsDialog({ siteName, category, provinceName, ids, manu, sdate, edate, open, onOpenChange }: NewsDialogProps) {
    const router = useRouter();
    const { toast } = useToast();
    const { value } = useDateRange();
    const [data, setData] = useState<NewsDialogData[]>([]);
    const [loading, setLoading] = useState(false);
        
    const fetchNewsData = async (sdate?: Date, edate?: Date) => {
        setLoading(true);
        setData([]);
        try {
            let url = '/api/program';
            const params = new URLSearchParams();
            
            if (manu === 'news') {
                params.append('manu', 'news');
                params.append('site_name', siteName || '');
            }

            if (manu === 'category') {
                params.append('manu', 'category');
                params.append('category', category || '');
            }

            
            if (manu === 'province') {
                params.append('manu', 'province');
                params.append('provinces', provinceName || '');
            }

            if (manu === 'category-list') {
                params.append('manu', 'category-list');
                params.append('ids', ids ? ids.join(',') : '');
            }

            // If date is provided, add it as query parameter
            if (sdate && edate) {
                // Use local date formatting to avoid timezone issues
                const start_date = sdate.getFullYear() + '-' + String(sdate.getMonth() + 1).padStart(2, '0') + '-' + String(sdate.getDate()).padStart(2, '0');
                const end_date = edate.getFullYear() + '-' + String(edate.getMonth() + 1).padStart(2, '0') + '-' + String(edate.getDate()).padStart(2, '0');

                params.append('sdate', start_date);
                params.append('edate', end_date);
            }
            
            // Build final URL
            if (params.toString()) {
                url += `?${params.toString()}`;
            }
            

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            // console.log('API Response:', result);

            if (result.res_status === '200') {
                const data = result.res_result.map((item: any) => ({
                    title: item.title,
                    link_href: item.link_href,
                    province: item.province
                }));

                setData(data);
            }
        } catch (error) {
            console.error('Error fetching news data:', error);
            toast({
                title: "Error",
                description: `Failed to fetch news data: ${error instanceof Error ? error.message : 'Unknown error'}`,
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch data when component mounts or when props change
    useEffect(() => {
        if (sdate && edate) {            
            fetchNewsData(sdate, edate);
        } else if (value?.startDate && value?.endDate) {
            // Fallback to context values if props are not provided
            fetchNewsData(value.startDate, value.endDate);
        }
    }, [sdate, edate, manu, siteName, category, provinceName, value]);

    const handleClick = (link_href: string) => {
        console.log('Clicked news:', link_href);
        if (link_href) {
            // เปิด URL ในแท็บใหม่
            window.open(link_href, '_blank', 'noopener,noreferrer');
        }
    };

    React.useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    return (
        <>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                [data-radix-dialog-overlay] {
                    backdrop-filter: blur(60px) !important;
                    background-color: rgba(52, 64, 84, 0.7) !important;
                }
                .rdx-dialog-overlay {
                    backdrop-filter: blur(60px);
                    background-color: rgba(52, 64, 84, 0.7);
                }
            `}</style>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="bg-[#147CD5] border-[#0A9ACA] text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-white text-[32px] font-semibold">รายการข่าว</DialogTitle>
                        <DialogDescription className="hidden">
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div
                            className="space-y-2 max-h-96 overflow-y-scroll hide-scrollbar"
                            style={{
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none'
                            }}
                        >
                            {data.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleClick(item.link_href)}
                                    className="flex items-center justify-between p-4 bg-[#1E5A8A] rounded-lg hover:bg-[#1E5A8A]/80 cursor-pointer transition-colors"
                                >
                                    <div className="flex-1 pr-4">
                                        <p className="text-white text-base font-semibold">
                                            {item.title}
                                        </p>
                                        <p className="text-white text-xs">
                                            {item.province}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center">
                                        <Image
                                            src="/icons/corner-up-right.svg"
                                            alt="corner-up-right"
                                            width={24}
                                            height={24}
                                            className=""
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
