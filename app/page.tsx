"use client";

import { useState } from "react";

export default function Home() {
    const [text, setText] = useState<string>("Haven't called API yet");

    async function getString() {
        const response = await fetch("/api/hello");
        const data = await response.json();
        setText(data.message);
    }

    return (
        <div className="m-auto">
            <div className="m-4 text-6xl">Wow look at this app!</div>
            <div className="flex gap-2">
                <span className="grow py-2 px-4 rounded-2xl border border-gray-400">
                    {text}
                </span>
                <button
                    onClick={getString}
                    className="py-2 px-4 rounded-2xl bg-gray-200 active:bg-gray-400"
                >
                    Call API
                </button>
            </div>
        </div>
    );
}
