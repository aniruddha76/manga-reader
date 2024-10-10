# Ad-Free Manhwa Reader

This project is an ad-free manhwa reader designed to provide a seamless reading experience for users. Built using Next.js and TypeScript, it fetches webtoon details and chapters via APIs. 

## Features

- **Ad-free reading**: Enjoy your favorite manhwa without interruptions.
- **Search functionality**: Find any manhwa and jump into its chapters easily.
- **Clean UI**: A distraction-free interface for a better reading experience.

## Known Issues

1. ~~After searching for a manhwa and reading a chapter, if the user hits the back button, the searched manhwa disappears, and random manhwa loads instead.~~
2. ~~CORS issue: If the user tries to change chapters in the `/webtoon` route, they may encounter CORS errors.~~
3. ~~If there is a " ' " in chapter name then fetch error in the `/webtoon` route (e.g. "Benefactor's Daughters")~~
4. ~~Chapter selection is not working in the `/webtoon` route.~~
5. There is no limiter for previous and next buttons in `/webtoon`
6. Last chapter is not listed in chapter list `/webtoon`
7. Mid chapters like `36.5` throwing 500 chapter not found error
8. There is still cors issue here and there while fetching chapter in `/webtoon`