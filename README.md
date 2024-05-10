# Cookie

This browser extension is designed to block cookie banners on various websites. The extension works by removing specific elements associated with 
cookie banners from the DOM.

## How it works

There is no generic way to identify cookie banners so the extension relies on a community-driven approach to identify and block cookie banners. 
The community contributes to the [Cookie-Sites](https://github.com/notarisj/Cookie-Sites/blob/main/sites.txt) repository, adding new websites and the 
corresponding elements to be removed.

The extension fetches the data from the Cookie-Sites repository and stores it locally. It then uses this data to remove the specified elements from 
the DOM of the corresponding website.

## File Format

The file in the Cookie-Sites repository follows a specific format:
```
site-url, element or class or tag name to remove
```

Sample:
```
google.com, KjcHPc, CXQnmb, xe7COe
baeldung.com, qc-cmp2-container, zddnuw
youtube.com, ytd-consent-bump-v2-lightbox
instagram.com, x9f619 x1n2onr6 x1ja2u2z
tiktok.com, tiktok-cookie-banner
reddit.com, reddit-cookie-banner
amazon, sp-cc
```

Each line represents a website and the elements to be removed. The first item on the line is the website URL, followed by a comma-separated list of 
element IDs, class names, or tag names to be removed.

## Contributing
To contribute, simply add a new line to the file in the Cookie-Sites repository with the website URL and the elements to be removed. This extension 
relies on the community to keep the list of websites and elements up-to-date.
