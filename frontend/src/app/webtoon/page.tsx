"use client"

import * as React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function Webtoon() {
    const searchParams = useSearchParams();

    const name = searchParams.get('name');
    const webtoonName = name.replace(/ /g, "-");
    const chapter = searchParams.get('chapter');

    const [searchTerm, setSearchTerm] = useState(""); // Store the input value
    const [results, setResults] = useState([]); // Store the API response

    useEffect(() => {
        if (webtoonName && chapter) {
            setSearchTerm(`${webtoonName} ${chapter}`);
        }
    }, [webtoonName, chapter]);

    useEffect(() => {
        const handleSearch = async () => {
            if (!searchTerm) return;

            try {
                const response = await fetch(`http://localhost:3001/chapters?search=${searchTerm}`, {
                    method: "GET",
                });
                const data = await response.json();

                // Log the response to check its structure
                console.log(data);

                if (Array.isArray(data)) {
                    setResults(data); // Store the API response
                } else {
                    console.error("Unexpected data structure:", data);
                    setResults([]); // Reset results if the structure is invalid
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setResults([]); // Reset results on error
            }
        };

        handleSearch();
    }, [searchTerm]); // Run this effect when searchTerm changes

    return (
        <main>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 items-center">
                <header className="sticky top-0 z-30 flex h-14 items-center justify-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <Select>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select chapter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>North America</SelectLabel>
                                <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
                                <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
                                <SelectItem value="mst">Mountain Standard Time (MST)</SelectItem>
                                <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
                                <SelectItem value="akst">Alaska Standard Time (AKST)</SelectItem>
                                <SelectItem value="hst">Hawaii Standard Time (HST)</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </header>

                <ScrollArea className="h-[35rem] w-[40rem] rounded-md border">
                    <div className="p-4">
                        {results && Array.isArray(results) && results.length > 0 ? (
                            results.map((url, index) => (
                                <div key={index} className="relative h-full w-full"> {/* Set a height and width for the container */}
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
                </ScrollArea>
            </div>
        </main>
    );
}
