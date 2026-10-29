# Rohan Ramesh Portfolio

Static portfolio website. The deployable site is in `dist/`; it has no build step.

## Deploy to GitHub Pages

The GitHub Actions workflow publishes `dist/` whenever changes are pushed to `main`.

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Push to `main` or run the **Deploy to GitHub Pages** workflow manually from the Actions tab.

GitHub will show the published URL in the Pages settings and in the deployment workflow.

## Preview locally

Run a static server from the repository root:

```sh
python3 -m http.server 8000 --directory dist
```

Then open `http://localhost:8000`.
