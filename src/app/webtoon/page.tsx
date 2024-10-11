"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select";

interface Manhwa {
  chapterPages: string[];
  availableChapters: string[];
}

export default function Webtoon() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name");
  const webtoonName = name ? name.replace(/ /g, "-") : "";
  const chapter = searchParams.get("chapter");

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Manhwa | null>(null);
  const [loadingStates, setLoadingStates] = useState<boolean[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
        setLoading(true);
        const response = await fetch(
          `https://manhwa18-scrape-api.vercel.app/chapters?search=${searchTerm}`,
          {
            method: "GET",
          }
        );
        const data: Manhwa = await response.json();
        console.log("API response data:", data);

        if (data && data.chapterPages) {
          setResults(data);
          setLoadingStates(new Array(data.chapterPages.length).fill(true));
        } else {
          console.error("Unexpected data structure:", data);
          setResults(null);
          setLoadingStates([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setResults(null);
        setLoadingStates([]);
      } finally {
        setLoading(false);
      }
    };

    handleSearch();
  }, [searchTerm]);

  const handleImageLoad = (index: number) => {
    setLoadingStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = false;
      return newStates;
    });
  };

  //added last chapter limiter to test
  const handleNextChapter = () => {
    const lastChapter = results?.availableChapters[0];
  
    if (chapter && lastChapter && parseInt(chapter, 10) < parseInt(lastChapter, 10)) {
      const nextChapter = parseInt(chapter, 10) + 1;
      router.push(`?name=${name}&chapter=${nextChapter}`);
    } else {
      router.push(`/`);
    }
  };
  

  const handlePreviousChapter = () => {
    if (chapter && parseInt(chapter, 10) > 1) {
      const prevChapter = parseInt(chapter, 10) - 1;
      router.push(`?name=${name}&chapter=${prevChapter}`);
    }
  };

  const handleChapterChange = (selectedChapter: string) => {
    router.push(`?name=${name}&chapter=${selectedChapter.replace("Chapter ", "")}`);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main>
        <div className="flex flex-col gap-4 py-4 justify-center items-center">

          <Select onValueChange={handleChapterChange}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select chapter" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Available Chapters</SelectLabel>
                {results?.availableChapters.map((chapter, index) => (
                  <SelectItem key={index} value={chapter}>
                    {chapter}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <div className="flex justify-between w-64 sm:w-96">
            <Button variant="secondary" className="w-[7rem] sm:w-44" onClick={handlePreviousChapter}>
              Previous
            </Button>
            <Button variant="secondary" className="w-[7rem] sm:w-44" onClick={handleNextChapter}>
              Next
            </Button>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="flex justify-center items-center">
                <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 border-t-transparent border-gray-400 rounded-full"></div>
              </div>
            ) : results && results.chapterPages.length > 0 ? (
              results.chapterPages.map((url, index) => (
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
                    className={`rounded object-cover ${loadingStates[index] ? "invisible" : "visible"}`}
                    onLoadingComplete={() => handleImageLoad(index)}
                  />
                </div>
              ))
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-transparent border-gray-400 rounded-full"></div>
              </div>
            )}
          </div>

          <div className="flex justify-between w-64 sm:w-96">
            <Button variant="secondary" className="w-[7rem] sm:w-44" onClick={handlePreviousChapter}>
              Previous
            </Button>
            <Button variant="secondary" className="w-[7rem] sm:w-44" onClick={handleNextChapter}>
              Next
            </Button>
          </div>
        </div>
      </main>
    </Suspense>
  );
}
