import axios from "axios";

export default async function getManhwaChapters(searchQuery) {

    var nameToSearch = searchQuery.replace(/ /g, "-");
    console.log(nameToSearch);

    try {
        const response = await axios.get(`https://manhwa18.cc/webtoon/${nameToSearch}`);
        const mangaData = response.data;

        // console.log(mangaData);

        // Regular expression to extract manga data
        const mangaTitle = /<h1>\s*<span>.*?<\/span>\s*([^<]+)\s*<\/h1>/;
        const mangaImage = /<div class="summary_image">\s*<a href=".*?" title=".*?">\s*<img[^>]+src="([^"]+)"[^>]*>\s*<\/a>\s*<\/div>/;
        const mangaSummary = /<div class="panel-story-description">\s*<h2 class="manga-panel-title wleft">.*?<\/h2>\s*<div class="dsct">\s*<p>(.*?)<\/p>\s*<\/div>\s*<\/div>/;

        const titleMatch = mangaData.match(mangaTitle);
        const imageMatch = mangaData.match(mangaImage);
        const summaryMatch = mangaData.match(mangaSummary);

        if (titleMatch) {
            const title = titleMatch[1].trim(); // Access the captured group and trim whitespace
            const image = imageMatch[1].trim(); // Access the captured group and trim whitespace
            const summary = summaryMatch[1].trim(); // Access the captured group and trim whitespace

            console.log(title)
            console.log(summary)
            console.log(image)
        }
        
        // const imgRegex = /<img[^>]+src="(https?:\/\/img05\.mnhwa002\.xyz[^">]+)"/g;
        // let match;

        // while ((match = imgRegex.exec(mangaData)) !== null) {
        //     chapterPages.push(match[1]);
        // }

        // return chapterPages;
    } catch (error) {
        console.error("Error fetching the webpage:", error);
    }

}
