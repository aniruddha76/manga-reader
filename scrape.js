import axios from "axios";

export default async function getManhwaChapters(searchQuery) {
    const decodeHtmlEntities = (text) => {
        return text
          .replace(/&rsquo;/g, "’") // right single quotation mark
          .replace(/&lsquo;/g, "‘") // left single quotation mark
          .replace(/&ldquo;/g, "“") // left double quotation mark
          .replace(/&rdquo;/g, "”") // right double quotation mark
          .replace(/&hellip;/g, "…") // ellipsis
          .replace(/&amp;/g, "&") // ampersand
          .replace(/&lt;/g, "<") // less than symbol
          .replace(/&gt;/g, ">"); // greater than symbol
      };

    var nameToSearch = searchQuery.replace(/ /g, "-");
    // console.log(nameToSearch);

    var mangaResponse = [];

    try {
        const response = await axios.get(`https://manhwa18.cc/webtoon/${nameToSearch}`);
        const mangaData = response.data;

        // console.log(mangaData);

        // Regular expression to extract manga data
        const mangaTitle = /<h1>\s*<span>.*?<\/span>\s*([^<]+)\s*<\/h1>/;
        const mangaImage = /<div class="summary_image">\s*<a href=".*?" title=".*?">\s*<img[^>]+src="([^"]+)"[^>]*>\s*<\/a>\s*<\/div>/;
        const mangaSummary = /<div class="panel-story-description">\s*<h2 class="manga-panel-title wleft">.*?<\/h2>\s*<div class="dsct">\s*<p>(.*?)<\/p>\s*<\/div>\s*<\/div>/;
        const mangaChapters = /<a class="chapter-name text-nowrap" href=".*?" title=".*?">(Chapter \d+)<\/a>/g;
        const mangaAuthor = /<div class="author-content">\s*<a href=".*?" rel="tag">(.*?)<\/a>\s*<\/div>/;
        const mangaArtist = /<div class="artist-content">\s*<a href=".*?" rel="tag">(.*?)<\/a>\s*<\/div>/;

        const titleMatch = mangaData.match(mangaTitle);
        const imageMatch = mangaData.match(mangaImage);
        const authorMatch = mangaData.match(mangaAuthor);
        const artistMatch = mangaData.match(mangaArtist);
        const summaryMatch = mangaData.match(mangaSummary);
        const chaptersMatch = [...mangaData.matchAll(mangaChapters)];

        if (titleMatch) {
            const title = titleMatch[1].trim(); 
            const image = imageMatch[1].trim(); 
            const author = authorMatch[1].trim(); 
            const artist = artistMatch[1].trim();
            const summary = summaryMatch[1].trim(); 
            const chapters = chaptersMatch.map(match => match[1].trim()); 
            
            let modifiedSummary = decodeHtmlEntities(summary);

            mangaResponse.push(title, image, author, artist, modifiedSummary, chapters)
            // console.log(title)
            // console.log(summary)
            // console.log(image)
        }
        
        // const imgRegex = /<img[^>]+src="(https?:\/\/img05\.mnhwa002\.xyz[^">]+)"/g;
        // let match;

        // while ((match = imgRegex.exec(mangaData)) !== null) {
        //     chapterPages.push(match[1]);
        // }

        return mangaResponse;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            mangaResponse.push("Yo! Whatever you're searching ain't here!");
            return mangaResponse; 
        } else {
            console.error("Error fetching the webpage:", error);
            mangaResponse.push("An error occurred while fetching data.");
            return mangaResponse; 
        }

    }
} 
