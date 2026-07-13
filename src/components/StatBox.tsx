// import React from "react";

interface StatBoxProps {
    label: string;
    value: string | number;
    primary?: boolean;
}

export default function StatBox({ label, value, primary = false }: StatBoxProps) {
    return (
        <div className="flex flex-col select-all">
            <span className="text-[#646669] text-sm uppercase font-bold tracking-wider mb-1">
                {label}
            </span>
            <span className={`text-5xl font-extrabold tracking-tight ${primary ? "text-[#e2b714]" : "text-[#d1d0c5]"
                }`}>
                {value}
            </span>
        </div>
    );
}