"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function Webtoon() {
    const searchParams = useSearchParams();
    
    const name = searchParams.get("name");
    const webtoonName = name ? name.replace(/ /g, "-") : ""; 
    const chapter = searchParams.get("chapter");

    const [searchTerm, setSearchTerm] = useState(""); // Store the input value
    const [results, setResults] = useState<string[]>([]); // Store the API response

    useEffect(() => {
        if (webtoonName && chapter) {
            const newSearchTerm = `${webtoonName} ${chapter}`;
            setSearchTerm(newSearchTerm);
            console.log("Constructed search term:", newSearchTerm);
        }
    }, [webtoonName, chapter]);

    useEffect(() => {
        const handleSearch = async () => {
            if (!searchTerm) return;

            console.log("Calling API with search term:", searchTerm); 

            try {
                const response = await fetch(`https://manhwa18-scrape-api.vercel.app/chapters?search=${searchTerm}`, {
                    method: "GET",
                });
                const data = await response.json();
                console.log("API response data:", data); 

                if (Array.isArray(data)) {
                    setResults(data);
                } else {
                    console.error("Unexpected data structure:", data);
                    setResults([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setResults([]);
            }
        };

        handleSearch();
    }, [searchTerm]); 

    return (
        <main>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 items-center">
                <div className="p-4">
                    {results && Array.isArray(results) && results.length > 0 ? (
                        results.map((url, index) => (
                            <div key={index} className="relative h-full w-full">
                                <Image
                                    width={800}
                                    height={800}
                                    src={url}
                                    alt={`Chapter image ${index + 1}`}
                                    sizes="100%"
                                    className="rounded object-cover"
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-sm">No chapters available.</div>
                    )}
                </div>
            </div>
        </main>
    );
}
