import express from "express";
import getManhwaChapters from "./scrape.js"; // Your scraping logic

const app = express();
const port = 3001;

app.get('/', (req, res) => {
    res.send("Server is Running OK!");
});

// Update the /chapters route to handle search queries
app.get('/chapters', async (req, res) => {
    const searchQuery = req.query.search; // Get the search term from the query string

    if (!searchQuery) {
        return res.status(400).send({ error: "Search query is required" });
    }

    try {
        const data = await getManhwaChapters(searchQuery); // Pass the search term to your scraper
        res.json(data); // Send the scraped data as a JSON response
    } catch (error) {
        console.error("Error fetching chapters:", error);
        res.status(500).send({ error: "Error fetching chapters" });
    }
});

app.listen(port, () => {
    console.log(`Server: http://localhost:${port}`);
});
