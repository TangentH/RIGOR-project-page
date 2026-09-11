# RIGOR project page

A lightweight research project page with an overview video, method figures,
qualitative results, and a mouse-controlled reconstruction preview.

## Run locally

Use Node.js 22.13 or newer.

```bash
npm ci
npm run dev -- --host 127.0.0.1 --port 59061
```

Open `http://localhost:59061`. For a remote machine, forward this port through
SSH: `ssh -L 59061:127.0.0.1:59061 user@server`.

`npm run build` creates a static export in `dist/client`. Building or running
locally does not publish the site.

## Deploy to GitHub Project Pages

Create a repository for the page, for example `RIGOR-project-page`, and push
this source to its `main` branch. In the repository, open **Settings → Pages**
and select **GitHub Actions** as the source. The included workflow builds the
site with the repository name as its URL prefix and publishes the matching
static-export directory automatically.

The resulting project URL has the form:

```text
https://OWNER.github.io/RIGOR-project-page/
```

Before publishing during anonymous review, verify that the repository owner,
commit history, visible author list, and linked assets comply with the venue's
anonymity policy. Do not add restricted reference LiDAR data.

## Content

- `app/page.tsx`: project text and media placement.
- `app/point-cloud-viewer.tsx`: Three.js viewer with orbit, pan, zoom and reset.
- `app/globals.css`: typography and responsive layout.
- `public/media/`: figures, videos, captions and a compact predicted point cloud.
- `ASSET_PROVENANCE.md`: result identifiers and asset checksums.

The Code link points to the public
[RIGOR repository](https://github.com/TangentH/RIGOR). The Paper link remains
inactive until a public paper URL is available. Author affiliations and contact
details are not supplied. The deployment workflow supplies the public site
origin for metadata, while local previews use the documented localhost address.

The 3D preview contains predicted geometry only, not the restricted reference
LiDAR data. No reference-cloud download link is included. The viewer loads
approximately 2.7 MB when its section approaches the viewport; the paired video
loads only when requested.
