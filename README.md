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
anonymity policy.

## Content

- `app/page.tsx`: project text and media placement.
- `app/point-cloud-viewer.tsx`: Three.js viewer with orbit, pan, zoom and reset.
- `app/globals.css`: typography and responsive layout.
- `public/media/`: figures, videos, captions and sampled comparison point clouds.
- `ASSET_PROVENANCE.md`: result identifiers and asset checksums.

The Code link points to the public
[RIGOR repository](https://github.com/TangentH/RIGOR). The Paper link points to [the arXiv paper](https://arxiv.org/abs/2609.13504).
The header shows the author affiliations (ETH Zurich, Microsoft and Hilti),
the teaser and the BibTeX citation added in the supervisor update. The deployment workflow supplies the public site
origin for metadata, while local previews use the documented localhost address.

The interactive comparison includes coarse reference LiDAR ROI clouds for selected
Floors 2, 4 and 5 alongside actual predictions. Each prediction preview is approximately 2.7 MB.
Only media used by the current page are included in the public directory.

## Interactive comparison

The scene selector offers Floor 5 (2025-12-02/run_1), Floor 2 (2025-05-05/run_1)
and Floor 4 (2025-12-02/run_1). Ground truth and Ours are fixed; the third panel
selects an available same-run baseline. Missing methods are explicitly listed.
All three cameras move together; each new scene resets the shared view.
Previous downloads and GPU buffers are released on switching. There is no Top view/3D view split.
Detail controls select automatic, lightweight or high-density rendering.
GT uses all occupied 30 cm voxel centers, without a further point cap: 34,242
points for Floor 5, 58,148 for Floor 2 and 40,605 for Floor 4. No high-resolution GT asset is shipped.
This downloadable coarse reference is for visualization, not evaluation.
Predictions retain the 180k initial/interactive and 1M settled budgets;
small failed reconstructions retain their actual point count without upsampling.

PatchMatch, VGGT-SLAM2, MASt3R-SLAM and windowed VGGT were rerun on the full 492-capture sequence.
Archived PanoVGGT and DA3-Sequential results are selectable on all three floors;
the four additional SLAM/windowed baselines are currently available only for Floor 5. Partial maps and
tracking loss are labelled. Archived results use ROI/ICP evaluation; new SLAM
illustrations use global trajectory registration and do not claim new
geometry scores. See ASSET_PROVENANCE.md and the manifest for exact sources.

To export reference GT and registered predictions, install Python numpy and plyfile, prepare a
private JSON with scenes (id, label, run, clouds mapping method IDs to local
registered PLY paths, optional metrics and notes), then run:

```bash
python scripts/export-comparison.py /path/to/private-input.json public/media/comparison
```

Each scene requires real GT/Ours clouds. Additional methods must use the
same run and coordinate frame. The exporter rejects unknown method IDs and duplicate source clouds assigned
to different methods. GT is quantized to 30 cm occupied voxel centers, without an additional point cap, and
displayed in uniform gray; exact sub-voxel coordinates are not published.
