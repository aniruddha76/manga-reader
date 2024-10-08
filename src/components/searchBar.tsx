"use client";
// Usual Imports
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

// Components imports
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "./theme-button";

interface Webtoon {
  title: string;
  image: string;
  slug: string;
  author: string;
  artist: string;
  summary: string;
  chapters: string[];
}

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Webtoon | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const manhwaNames = ["Quest-supremacy", "A-wonderful-new-world", "Queen-bee", "my-kingdom-silent-war-01", "reality-quest", "the-extra-is-too-strong"];

  const fetchRandomManhwa = async () => {
    const randomManhwa = manhwaNames[Math.floor(Math.random() * manhwaNames.length)];

    try {
      setIsLoading(true);
      const response = await fetch(`https://manhwa18-scrape-api.vercel.app/webtoon?search=${randomManhwa}`, {
        method: "GET",
      });
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching random manhwa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch the random manhwa on component mount
  useEffect(() => {
    const storedResults = sessionStorage.getItem("searchResults");

    if (storedResults) {
      setResults(JSON.parse(storedResults)); // Load the stored search results
    } else {
      fetchRandomManhwa(); // Fetch random manhwa if no stored results
    }
  }, []);

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      setIsLoading(true);
      const response = await fetch(`https://manhwa18-scrape-api.vercel.app/webtoon?search=${searchTerm}`, {
        method: "GET",
      });
      const data = await response.json();
      setResults(data);

      //store results in session to survive nevigation
      sessionStorage.setItem("searchResults", JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-end gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="relative flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

            <div className="flex space-x-2">
              <Input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              />

              <Button type="button" onClick={handleSearch} disabled={isLoading}>
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
          <ModeToggle />
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
              <Card className="sm:col-span-2 sm:flex" x-chunk="dashboard-05-chunk-0">
                <Card className="p-2 border-none shadow-none">
                  <center>
                    <div className="relative h-[280px] w-[200px]">
                      {isLoading ? (
                        <Skeleton className="h-[280px] w-[200px] rounded-xl" />
                      ) : results && results.image ? (
                        <Image
                          className="rounded object-cover"
                          src={results.image}
                          alt="Image"
                          fill
                          sizes="500px"
                        />
                      ) : (
                        <Skeleton className="h-[280px] w-[200px] rounded-xl" />
                      )}
                    </div>
                  </center>
                </Card>

                <div>
                  <CardHeader className="pb-3 px-2">
                    <CardDescription>Manga / Manhwa</CardDescription>
                    <CardTitle className="text-4xl">{isLoading ? "Loading..." : results?.title}</CardTitle>
                    <CardDescription>Description</CardDescription>
                    <CardContent className="text-m p-0">{isLoading ? "Loading..." : results?.summary}</CardContent>
                  </CardHeader>
                  <CardFooter className="space-x-2 px-2">
                    {results && results.chapters && results.chapters.length > 0 && !isLoading ? (
                      <>
                        <Link href={`/webtoon?name=${results?.slug}&chapter=${results?.chapters[results.chapters.length - 1].split(" ")[1]}`}>
                          <Button>Read First</Button>
                        </Link>
                        <Link href={`/webtoon?name=${results?.slug}&chapter=${results?.chapters[0].split(" ")[1]}`}>
                          <Button>Read Last</Button>
                        </Link>
                      </>
                    ) : null}
                  </CardFooter>
                </div>
              </Card>

              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription>Author</CardDescription>
                  <CardTitle className="text-2xl">{isLoading ? "Loading..." : results?.author}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    *Extracted from external website
                  </div>
                </CardContent>
              </Card>

              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription>Artist</CardDescription>
                  <CardTitle className="text-2xl">{isLoading ? "Loading..." : results?.artist}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    *Extracted from external website
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-2xl">
                  Chapters
                </CardTitle>
                <CardDescription>{results?.title}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
              <ScrollArea className="h-[22rem]">
                {results && results.chapters && Array.isArray(results.chapters) && results.chapters.length > 0 ? (
                  results.chapters.map((chapter, index) => (
                    <div key={index}>
                      <Link href={`/webtoon?name=${results?.slug}&chapter=${chapter.split(" ")[1]}`}>
                        {chapter}
                      </Link>
                      <Separator className="my-2" />
                    </div>
                  ))
                ) : (
                  <div className="text-sm">No chapters available.</div>
                )}
              </ScrollArea>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
              <div className="text-xs text-muted-foreground">
                Author notes chapters are not included in this list
              </div>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
}
