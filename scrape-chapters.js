import axios from "axios";

export default async function getManhwaChapters(manhwaName, chapter) {
    let chapterPages = [];
    
    try {
        const response = await axios.get(`https://manhwa18.cc/webtoon/${manhwaName}/chapter-${chapter}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
            }
        });
        
        const mangaData = response.data;

        // Regex to capture both src and data-src
        const imgRegex = /<img[^>]+src="(https:\/\/img\d{2}\.mnhwa002\.xyz\/uploads\/[^">]+)"/g;
        let match;

        while ((match = imgRegex.exec(mangaData)) !== null) {
            chapterPages.push(match[1]); // Push the URL into the array
        }

        return chapterPages;

    } catch (error) {
        console.error("Error fetching the webpage:", error);

        if (error.response && error.response.status === 404) {
            return ["Yo! Whatever you're searching ain't here!"];
        } else {
            return ["An error occurred while fetching data."];
        }
    }
}
