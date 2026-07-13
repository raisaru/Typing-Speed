import React, { useState, useEffect, useRef, useCallback } from "react";
import TimeSelector from "./TimeSelector";
import StatBox from "./StatBox";

const WORD_POOL = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for",
    "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his",
    "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my",
    "one", "all", "would", "there", "their", "what", "so", "up", "out", "if",
    "about", "who", "get", "which", "go", "me", "when", "make", "can", "like",
    "time", "no", "just", "him", "know", "take", "people", "into", "year", "your",
    "good", "some", "could", "them", "see", "other", "than", "then", "now", "look"
];

const generateWords = (count = 45): string => {
    return Array.from(
        { length: count },
        () => WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)]
    ).join(" ");
};

export default function TypingTest() {
    const [targetText, setTargetText] = useState<string>("");
    const [typedText, setTypedText] = useState<string>("");
    const [timeLimit, setTimeLimit] = useState<number>(30);
    const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(true);
    const [isCapsLock, setIsCapsLock] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);

    const resetTest = useCallback((newTime = timeLimit) => {
        setTargetText(generateWords(45));
        setTypedText("");
        setTimeLimit(newTime);
        setTimeLeft(newTime);
        setIsActive(false);
        setIsFinished(false);
        setIsFocused(true);

        setTimeout(() => inputRef.current?.focus(), 0);
    }, [timeLimit]);

    useEffect(() => {
        resetTest();
    }, [resetTest]);

    useEffect(() => {
        // Change line 51 to use standard browser number types
        let interval: number | null = null;

        if (isActive && timeLeft > 0) {
            interval = window.setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setIsActive(false);
            setIsFinished(true);
        }

        return () => {
            if (interval) window.clearInterval(interval);
        };
    }, [isActive, timeLeft]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        if (isFinished) return;

        if (!isActive && value.length === 1) {
            setIsActive(true);
        }

        if (value.length <= targetText.length) {
            setTypedText(value);
        }

        if (value === targetText) {
            setIsActive(false);
            setIsFinished(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        setIsCapsLock(e.getModifierState("CapsLock"));
    };

    const calculateMetrics = () => {
        const timeElapsed = timeLimit - timeLeft || 1;
        const timeInMinutes = timeElapsed / 60;

        let correctChars = 0;
        for (let i = 0; i < typedText.length; i++) {
            if (typedText[i] === targetText[i]) correctChars++;
        }

        const wpm = Math.round((correctChars / 5) / timeInMinutes);
        const accuracy = typedText.length
            ? Math.round((correctChars / typedText.length) * 100)
            : 100;

        return { wpm, accuracy };
    };

    const { wpm, accuracy } = calculateMetrics();

    return (
        <div
            className="min-h-screen bg-[#323437] text-[#d1d0c5] font-mono flex flex-col items-center justify-center select-none cursor-text p-6 relative overflow-hidden transition-all duration-300"
            onClick={() => inputRef.current?.focus()}
        >
            {/* Background Subtle Ambient Glows */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#e2b714]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#ca4754]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl w-full flex flex-col gap-8 z-10">

                {/* Brand Header */}
                <div className="flex justify-between items-center h-12 border-b border-[#444649]/30 pb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[#e2b714] text-xl font-black tracking-wider">⚡ type.io</span>
                    </div>
                    {!isActive && !isFinished ? (
                        <TimeSelector timeLimit={timeLimit} onSelectTime={resetTest} />
                    ) : (
                        <div className="text-[#e2b714] text-3xl font-extrabold tracking-wider animate-pulse">{timeLeft}s</div>
                    )}
                </div>

                {/* Workspace Panel Container */}
                <div className="relative min-h-[180px]">

                    {/* Out of Focus Overlay */}
                    {!isFocused && !isFinished && (
                        <div className="absolute inset-0 bg-[#323437]/80 backdrop-blur-xs z-20 flex items-center justify-center rounded-xl border border-[#444649]/20 transition-all">
                            <span className="text-[#e2b714] text-base font-bold tracking-wide animate-bounce">
                                🔬 Click here to focus and resume typing
                            </span>
                        </div>
                    )}

                    {/* Caps Lock Alert */}
                    {isCapsLock && !isFinished && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 bg-[#ca4754] text-white text-xs font-bold px-4 py-1 rounded-full tracking-wide shadow-md flex items-center gap-1.5 animate-pulse">
                            ⚠️ Caps Lock is ON
                        </div>
                    )}

                    {!isFinished ? (
                        <div className="flex flex-col gap-8">
                            <div className="relative text-2xl leading-relaxed tracking-wide outline-none select-none">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={typedText}
                                    onChange={handleInputChange}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => setIsFocused(true)}
                                    onBlur={() => setIsFocused(false)}
                                    className="absolute opacity-0 pointer-events-none inset-0 w-full h-full z-[-1]"
                                    autoFocus
                                />

                                {/* Character Matrix */}
                                <div className="break-words whitespace-pre-wrap selection:bg-transparent pr-4">
                                    {targetText.split("").map((char, index) => {
                                        let charClass = "text-[#646669]"; // default gray
                                        const isCurrent = index === typedText.length;

                                        if (index < typedText.length) {
                                            charClass = typedText[index] === char
                                                ? "text-[#d1d0c5]"
                                                : "text-[#ca4754] bg-[#ca4754]/15 rounded-xs font-bold";
                                        }

                                        return (
                                            <span
                                                key={index}
                                                className={`${charClass} transition-all duration-100 relative ${isCurrent && isFocused ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[2px] after:h-[1.2em] after:bg-[#e2b714] after:animate-[blink_1s_infinite] after:shadow-[0_0_8px_#e2b714]" : ""
                                                    }`}
                                            >
                                                {char}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Dynamic Bottom Status Dash - ENLARGED & BOLD */}
                            {/* Dynamic Bottom Status Dash - FULLY RESPONSIVE */}
                            <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-center border-t border-[#2c2e31] pt-6 transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-30'}`}>

                                {/* Large Speed Box */}
                                <div className="bg-[#2c2e31] px-6 py-3.5 rounded-xl flex items-baseline justify-between sm:justify-start gap-4 border border-[#444649]/30 shadow-lg w-full sm:min-w-[170px] sm:w-auto">
                                    <span className="text-[#646669] text-xs font-black uppercase tracking-widest">speed</span>
                                    <span className="text-[#e2b714] text-3xl font-black tracking-tight">
                                        {wpm} <span className="text-xs font-bold text-[#e2b714]/70 ml-0.5">WPM</span>
                                    </span>
                                </div>

                                {/* Large Accuracy Box */}
                                <div className="bg-[#2c2e31] px-6 py-3.5 rounded-xl flex items-baseline justify-between sm:justify-start gap-4 border border-[#444649]/30 shadow-lg w-full sm:min-w-[170px] sm:w-auto">
                                    <span className="text-[#646669] text-xs font-black uppercase tracking-widest">accuracy</span>
                                    <span className="text-[#d1d0c5] text-3xl font-black tracking-tight">
                                        {accuracy}<span className="text-sm font-bold text-[#646669] ml-0.5">%</span>
                                    </span>
                                </div>

                            </div>
                        </div>
                    ) : (
                        /* Performance Dashboard Results Grid */
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#2c2e31]/40 border border-[#444649]/20 rounded-2xl p-8 backdrop-blur-md shadow-2xl animate-fade-in">
                            <StatBox label="wpm" value={wpm} primary />
                            <StatBox label="accuracy" value={`${accuracy}%`} />
                        </div>
                    )}
                </div>

                {/* Action Controls */}
                <div className="flex justify-center mt-4">
                    <button
                        onClick={(e) => { e.stopPropagation(); resetTest(); }}
                        className="flex items-center gap-2 bg-[#2c2e31] text-[#646669] hover:text-[#d1d0c5] border border-[#444649]/20 hover:border-[#e2b714]/30 hover:bg-[#36383b] transition-all duration-200 text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl shadow-md cursor-pointer focus:outline-none hover:scale-105 active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18.5" />
                        </svg>
                        Restart Engine
                    </button>
                </div>
            </div>
        </div>
    );
}