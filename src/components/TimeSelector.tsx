// import React from "react";

interface TimeSelectorProps {
    timeLimit: number;
    onSelectTime: (time: number) => void;
}

export default function TimeSelector({ timeLimit, onSelectTime }: TimeSelectorProps) {
    return (
        <div className="flex items-center gap-4 bg-[#2c2e31] px-3 py-1.5 rounded-md">
            <span className="text-xs text-[#646669] uppercase font-bold tracking-wider mr-1">Time</span>
            {[15, 30, 60].map((time) => (
                <button
                    key={time}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelectTime(time);
                    }}
                    className={`text-sm font-bold transition-colors duration-150 focus:outline-none ${timeLimit === time ? "text-[#e2b714]" : "text-[#646669] hover:text-[#d1d0c5]"
                        }`}
                >
                    {time}s
                </button>
            ))}
        </div>
    );
}