# Turfingo Tournaments

React + Vite app for Turfingo Tournament registration and community pages.

## Cloudinary Images

Shared image assets are now loaded from Cloudinary when these env vars are set:

- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_IMAGE_FOLDER` - optional, defaults to `turfingo`

Upload the site images with the same filenames used in the app:

- `onlylogo.png`
- `pic1.jpeg` through `pic18.jpeg`

The app falls back to the local `/public` files if the Cloudinary env vars are not present, which keeps local development working while you migrate the assets.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
