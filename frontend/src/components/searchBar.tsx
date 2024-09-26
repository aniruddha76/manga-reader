"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function InputWithButton() {
  const [searchTerm, setSearchTerm] = useState(""); // store the input value
  const [results, setResults] = useState(null); // store the API response

  // Handle form submission
  const handleSearch = async () => {
    if (!searchTerm) return; // Don't search if input is empty

    try {
      // Send search term as a query parameter to your API
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
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        placeholder="Enter Name"
        value={searchTerm} // bind input value to state
        onChange={(e) => setSearchTerm(e.target.value)} // update state on input change
      />
      <Button type="submit" onClick={handleSearch}>
        Search
      </Button>

      {results && (
        <div>
          <h3>Results:</h3>
          <pre>{JSON.stringify(results, null, 2)}</pre> {/* Display API response */}
        </div>
      )}
    </div>
  );
}
