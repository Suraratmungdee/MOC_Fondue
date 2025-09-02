import Image from "next/image";
import { Button } from "@/components/ui/button";
import DateRangeFilter from "../ui/DateRangeFilter";
import { useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useDateRange } from "@/contexts/DateRangeContext";
import { useRouter } from 'next/navigation';

interface HeaderProps {
    onLogout: () => void;
    onExport: () => void;
}

export default function Header({ onLogout, onExport }: HeaderProps) {
    const router = useRouter();
    const { value, onChange } = useDateRange();
    const [currentDateTime, setCurrentDateTime] = useState<string>("");

    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const date = now.toLocaleDateString('th-TH', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });

            const time = now.toLocaleTimeString('th-TH', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });

            setCurrentDateTime(`วันที่ ${date} เวลา ${time} น.`);
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const heandleClick = () => {
        router.back();
    }

    return (
        <header className="px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Logo and Title */}
                <div className="flex items-center space-x-4">
                    {/* <div className="flex items-center space-x-4">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={114}
                            height={114}
                            className=""
                        />
                    </div>
                    <div className="text-white text-[40px] font-bold">
                        <p>AI Social Listening</p>
                        <p>on <span className="text-yellow-400">MOC Fondue</span></p>
                    </div> */}

                    <div className="flex items-center gap-1" onClick={heandleClick}>
                        {/* <Button
                            // onClick={handleClick}
                            variant="secondary"
                            size="icon"
                            className="size-6 rounded-full bg-black text-white hover:bg-black">
                            <ChevronLeftIcon />
                        </Button> */}

                        <div className="size-6 rounded-full bg-black text-white hover:bg-black">
                            <ChevronLeftIcon />
                        </div>
                        <label className="text-white text-xl ">กลับ</label>
                    </div>
                </div>

                {/* Right Side Buttons */}
                <div className="flex flex-col items-end space-y-2">
                    {/* <div className="flex items-center space-x-4">
                        <span className="text-white text-[17px]">Super Admin</span>
                        <Image
                            onClick={onLogout}
                            src="/icons/logout.svg"
                            alt="Logout"
                            width={18}
                            height={18}
                            className="cursor-pointer"
                            role="button"
                            tabIndex={0}
                            aria-label="Logout button"
                        />
                    </div> */}
                    <div className="flex items-center justify-center space-x-3">
                        <div className="min-w-[280px]">
                            <DateRangeFilter
                                value={value}
                                onChange={onChange}
                                dropdownPosition="right"
                            />
                        </div>
                        <div className="text-white text-[16px] border-[0.5px] border-white rounded-lg px-4 py-2 min-w-[220px] text-center">
                            {currentDateTime}
                        </div>
                        <span className="text-white text-[17px]">Super Admin</span>
                        <Image
                            onClick={onLogout}
                            src="/icons/logout.svg"
                            alt="Logout"
                            width={18}
                            height={18}
                            className="cursor-pointer"
                            role="button"
                            tabIndex={0}
                            aria-label="Logout button"
                        />
                        {/* <Button
                            onClick={onExport}
                            className="text-[16px] bg-purple-600 hover:bg-purple-700 flex items-center space-x-2 px-4 py-2 min-w-[150px] h-[44px]"
                            aria-label="Export data to Excel file"
                        >
                            <Image
                                src="/icons/export.svg"
                                alt="Export"
                                width={16}
                                height={16}
                            />
                            <span>Export Excel</span>
                        </Button> */}
                    </div>
                </div>
            </div>
        </header>
    );
}
