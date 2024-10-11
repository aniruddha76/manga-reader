# Ad-Free Manhwa Reader

This project is an ad-free manhwa reader designed to provide a seamless reading experience for users. Built using Next.js and TypeScript, it fetches webtoon details and chapters via APIs. 

## Features

- **Ad-free reading**: Enjoy your favorite manhwa without interruptions.
- **Search functionality**: Find any manhwa and jump into its chapters easily.
- **Clean UI**: A distraction-free interface for a better reading experience.

## Known Issues

1. ~~After searching for a manhwa and reading a chapter, if the user hits the back button, the searched manhwa disappears, and random manhwa loads instead.~~ - Fixed.
2. ~~CORS issue: If the user tries to change chapters in the `/webtoon` route, they may encounter CORS errors.~~ - Fixed.
3. ~~If there is a " ' " in chapter name then fetch error in the `/webtoon` route (e.g. "Benefactor's Daughters")~~ - Fixed.
4. ~~Chapter selection is not working in the `/webtoon` route.~~ - Fixed.
5. There is no limiter for previous and next buttons in `/webtoon`
6. ~~Last chapter is not listed in chapter list `/webtoon`~~ - Fixed.
7. ~~Selected Chapter gets disappeared after selection from chapter list in `/webtoon`~~ - Fixed.
8. Mid chapters like `36.5` throwing 500 chapter not found error
9. There is still cors issue here and there while fetching chapter in `/webtoon`