"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
import { useWebtoon } from "@/context/WebtoonContext";

export default function Webtoon() {
    const searchParams = useSearchParams();
    const { chapters } = useWebtoon();

    const name = searchParams.get("name");
    const webtoonName = name ? name.replace(/ /g, "-") : ""; // Handle case where name is null
    const chapter = searchParams.get("chapter");

    const [searchTerm, setSearchTerm] = useState(""); // Store the input value
    const [results, setResults] = useState([]); // Store the API response
    const [selectedChapter, setSelectedChapter] = useState(chapter || ""); // Store selected chapter

    useEffect(() => {
        if (webtoonName && selectedChapter) {
            const newSearchTerm = `${webtoonName} ${selectedChapter}`;
            setSearchTerm(newSearchTerm);
            console.log("Constructed search term:", newSearchTerm);
        }
    }, [webtoonName, selectedChapter]);

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
    }, [searchTerm]); // this fetch images when searchTerm changes

    const handleChapterSelect = (chapter) => {
        setSelectedChapter(chapter); // Updating selected chapter
        const newSearchTerm = `${webtoonName} ${chapter}`;
        setSearchTerm(newSearchTerm); 
    };

    return (
        <main>
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 items-center">
                <header className="sticky top-0 z-30 flex h-14 items-center justify-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <Select onValueChange={handleChapterSelect}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Select chapter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Chapters</SelectLabel>
                                {chapters && chapters.length > 0 ? (
                                    chapters.map((chapter, index) => (
                                        <SelectItem key={index} value={chapter}>
                                            {chapter}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="no-chapters" disabled>
                                        No chapters available
                                    </SelectItem>
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </header>

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
