# Umair Farooqui Portfolio

A static portfolio built with HTML, CSS, and JavaScript. The website and its assets are in `MY PORTFOLIO ADV/`.

## Netlify deployment

Connect this repository to Netlify and select the `main` branch. The root `netlify.toml` sets `MY PORTFOLIO ADV` as the publish directory and leaves the build command empty because the website does not require a build step or package installation.

Keep `index.html`, `style.css`, `script.js`, images, and `MY_Resume.pdf` together in that directory so their relative links continue to work. Push website changes to the connected branch to trigger deployment.

## Local preview

Serve the website with a static HTTP server, for example:

```sh
python3 -m http.server 8889 --directory "MY PORTFOLIO ADV"
```

Open `http://localhost:8889` in a browser.
