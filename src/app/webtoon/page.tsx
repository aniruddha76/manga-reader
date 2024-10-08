"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";

export default function Webtoon() {
    const searchParams = useSearchParams();

    const name = searchParams.get("name");
    const webtoonName = name ? name.replace(/ /g, "-") : "";
    const chapter = searchParams.get("chapter");

    const [searchTerm, setSearchTerm] = useState(""); // Store the input value
    const [results, setResults] = useState<string[]>([]); // Store the API response
    const [loadingStates, setLoadingStates] = useState<boolean[]>([]); // To track loading state for each image
    const [loading, setLoading] = useState<boolean>(true); // General loading state

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
                setLoading(true); // Start loading
                const response = await fetch(`https://manhwa18-scrape-api.vercel.app/chapters?search=${searchTerm}`, {
                    method: "GET",
                });
                const data = await response.json();
                console.log("API response data:", data);

                if (Array.isArray(data)) {
                    setResults(data);
                    setLoadingStates(new Array(data.length).fill(true)); // Initialize loading states
                } else {
                    console.error("Unexpected data structure:", data);
                    setResults([]);
                    setLoadingStates([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setResults([]);
                setLoadingStates([]);
            } finally {
                setLoading(false); // End loading after data is fetched
            }
        };

        handleSearch();
    }, [searchTerm]);

    const handleImageLoad = (index: number) => {
        setLoadingStates((prevStates) => {
            const newStates = [...prevStates];
            newStates[index] = false; // Set loading state to false once the image has loaded
            return newStates;
        });
    };

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <main>
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 items-center">
                    <div className="p-4">
                        {loading ? (
                            // Show a spinner while data is being fetched
                            <div className="flex justify-center items-center">
                                <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-transparent border-gray-400 rounded-full"></div>
                            </div>
                        ) : (
                            results && Array.isArray(results) && results.length > 0 ? (
                                results.map((url, index) => (
                                    <div key={index} className="relative h-full w-full">
                                        {loadingStates[index] && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-gray-400 rounded-full"></div>
                                            </div>
                                        )}
                                        <Image
                                            width={800}
                                            height={800}
                                            src={url}
                                            alt={`Chapter image ${index + 1}`}
                                            sizes="100%"
                                            className={`rounded object-cover ${loadingStates[index] ? 'invisible' : 'visible'}`} // Hide image until loaded
                                            onLoadingComplete={() => handleImageLoad(index)}
                                        />
                                    </div>
                                ))
                            ) : (
                                // Show spinners if no results but no errors occurred
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-gray-400 rounded-full"></div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </main>
        </Suspense>
    );
}
