# Displayed result provenance

All media are reconstruction predictions or paper figures. No restricted
reference LiDAR point cloud is distributed. Rendered comparison figures can
contain evaluation-derived errors, but do not contain the reference dataset.

## Interactive result

`floor1-0505-run1-preview.ply` is a deterministic 180,000-point subset (seed
2027) of the final Ours reconstruction for `floor_1/2025-05-05/run_1`.
The source has 7,956,098 points. XYZ coordinates and RGB colors are retained;
no synthetic points, denoising or geometric edits are applied to the preview.

- Source reconstruction SHA-256: `b0bc43147da58fac77665591443974a59a92c3bcae7d490d862a64f8503598af`.
- Preview SHA-256: `0004f1c1160b83ccaf53f2c42c5b180c84e9c2caf77bfa3bd6f5890367faddc3`.

`floor1-0505-run1-flythrough.mp4` shows the same sequence and method. It is a
10-second fly-through excerpt of the existing dense render, transcoded to
H.264 for browser playback; reconstruction inference was not rerun.

## Overview and figures

`rigor-results-overview.mp4` is the 41-second results-first overview, version 6.
It includes the selected floor-1 reconstruction, local repair and retrieval
illustrations, and a separate long-sequence underground fly-through. It is not
a quantitative comparison or a claim that every sequence has the same quality.

The static figures are taken directly from the paper:
- `paper-pipeline.pdf`: Figure 2, identical to `figures/pipeline_v2.pdf`
  (SHA-256 `24a7618909d10cd12a15f8e6b0e623b23aac6f8adb434618843922e78cffdb1f`).
- `paper-qualitative.pdf`: Figure 4, identical to `figures/baseline_combined.pdf`
  (SHA-256 `388dd78c768d0c8edd69605018f505ea47aedb0c1accd6efd272f17be0871508`).
  It compares two sequences, `floor_1/2025-05-05/run_1` and
  `floor_2/2025-10-28/run_2`, not the earlier single underground-run figure.

Their PNG previews are direct 2400-pixel-wide PDF rasterizations. No labels,
numbers, point clouds, curves, or scientific content are redrawn or modified.
Each figure links to its original PDF and remains scrollable on narrow screens.
The separate overview video and interactive prediction are demonstrations,
not additional quantitative evidence or reference LiDAR data.

See `public/media/SHA256SUMS` for checksums of every distributed media asset.
