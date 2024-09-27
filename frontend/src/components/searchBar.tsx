"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Home,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export const description =
  "An orders dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. The main area has a list of recent orders with a filter and export button. The main area also has a detailed view of a single order with order details, shipping information, billing information, customer information, and payment information."

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState(""); // store the input value
  const [results, setResults] = useState(null); // store the API response

  const handleSearch = async () => {
    if (!searchTerm) return;

    try {
      const response = await fetch(`http://localhost:3001/chapters?search=${searchTerm}`, {
        method: "GET",
      });
      const data = await response.json();
      setResults(data); // Store the API response
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">

      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Home className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Acme Inc</span>
          </Link>
        </nav>
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">

        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <div className="flex space-x-2">
              <Input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
              />
              <Button type="submit" onClick={handleSearch}>Search</Button>
            </div>
          </div>
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
              <Card
                className="sm:col-span-2 flex" x-chunk="dashboard-05-chunk-0"
              >
                <CardDescription className="p-2">
                  <Image 
                    className="rounded overflow-hidden bg-cover"
                    height={100}
                    width={100}
                    src={results ? results[1] : "/"}
                    alt="Image"
                  />
                </CardDescription>

                <div>
                  <CardHeader className="pb-3 px-2">
                    <CardDescription>Manga / Manhwa</CardDescription>
                    <CardTitle className="text-4xl">{results ? results[0] : 'Loading...'}</CardTitle>
                    {/* <CardDescription className="text-balance max-w-lg leading-relaxed">
                      
                    </CardDescription> */}
                  </CardHeader>
                  <CardFooter className="space-x-2  px-2">
                    <Button>Read First</Button>
                    <Button>Read Last</Button>
                  </CardFooter>
                </div>

              </Card>

              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription>Description</CardDescription>
                  <CardContent className="text-m p-0">{results ? results[2] : "Loading..."}</CardContent>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    *Extracted from external website
                  </div>
                </CardContent>
              </Card>

              {/* <Card x-chunk="dashboard-05-chunk-2">
                <CardHeader className="pb-2">
                  <CardDescription>This Month</CardDescription>
                  <CardTitle className="text-4xl">$5,329</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    +10% from last month
                  </div>
                </CardContent>
              </Card> */}

            </div>

          </div>
          <div>
            <Card
              className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
            >
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-2xl">
                    Chapters
                  </CardTitle>
                  <CardDescription>Date: November 23, 2023</CardDescription>
                </div>

              </CardHeader>
              <CardContent className="p-6 text-sm">
                <ScrollArea className="h-72">
                  {results && results[3] && Array.isArray(results[3]) && results[3].length > 0 ? (
                    results[3].map((chapter, index) => (
                      <div key={index}>
                        {chapter}
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
                  Updated <time dateTime="2023-11-23">November 23, 2023</time>
                </div>

              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
