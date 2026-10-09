# Displayed result provenance

All media are reconstruction predictions or paper figures. No restricted
reference LiDAR point cloud is distributed. Rendered comparison figures can
contain evaluation-derived errors, but do not contain the reference dataset.

## Interactive Floor 5 comparison

Only `floor_5/2025-12-02/run_1` is included in the interactive viewer. The
scene is an explicitly selected example, not a representative average claim.
The two fixed panels show Ours and PanoVGGT; the third panel selects an actual
baseline from the same run. The old duplicated GT/Ours/PanoVGGT placeholders
and the extra Floor 2 interactive assets are removed. No reference LiDAR is
shipped. All panels share the same origin, proper Z-up to Y-up display rotation,
camera and scale; the viewer does not independently center or normalize methods.

### Archived predictions

Ours, PanoVGGT and DA3-Sequential are the archived final registered predictions
inside the evaluation ROI. Their archived evaluation registration uses
trajectory Sim(3) and ICP. Their CD and F@25 values are full-cloud archive
metrics, not recomputed on the visualization samples.

### Newly rerun baselines

PatchMatch (Stella VSLAM Dense), VGGT-SLAM2, MASt3R-SLAM and VGGT were actually rerun
on the complete official Floor 5 sequence on 2026-10-09, after restoring its
ROS bag and extracting 492 panoramas at the existing stride of 10. Perspective
SLAM receives one fixed yaw-0, IMU-levelled 768x512 crop (95-degree FOV);
PatchMatch receives the corresponding levelled 1036x518 ERP sequence.
The headless runners use the restored historical configuration and official
weights. Local compatibility changes address PyTorch APIs and build/link
paths; they do not add RIGOR repair or replace failed geometry.

Each new SLAM cloud is registered by one global trajectory Umeyama Sim(3)
using actual capture timestamps and the public camera trajectory, then mapped
into the same archived supervisor geometry frame. The full new prediction is
retained, without ICP, piecewise alignment or shape correction. Consequently,
these clouds are qualitative rerun illustrations, not additional scored entries
under the archived ROI/ICP benchmark. No new CD/F@25 is fabricated.

Tracking failures are preserved and labelled: PatchMatch tracks 122 of 492
input captures and yields 67,650 dense points after its dense queue stabilizes;
MASt3R exports 17 reconstructed keyframes. VGGT-SLAM2 processes the full
sequence and accepts seven loop closures. A partial map is not interpreted as
high complete-sequence accuracy.

The VGGT illustration uses the official frozen VGGT model on four independent
fixed-yaw streams (1,968 perspective views of the same 492 captures), with
16-frame windows and four-frame overlaps. Corresponding overlap point maps
estimate sequential Sim(3); each independent stream receives one whole-stream
trajectory alignment for display. No RIGOR repair, pose graph or loop closure
is applied. Up to 6,000 predicted points per view are retained uniformly before
the shared display sampling; no geometry is synthesized. This is a transparent
windowed rerun, not a claim that it exactly reproduces the paper's older run.

### Display sampling

Uniform random sampling (seed 2027) preserves source geometry and RGB. The
initial budget is at most 180,000 points and the detail budget at most 1,000,000
points per method. Source clouds smaller than these caps are not upsampled.
PatchMatch therefore displays all its actual 67,650 points and does not download
a duplicate high-detail file. During interaction, larger clouds draw a uniform
180k prefix, restoring full detail after movement stops. Auto mode upgrades on
desktop devices with sufficient reported memory and without data-saving
mode; mobile defaults to lightweight detail. Users can choose detail manually.

`public/media/comparison/manifest.json` records source/export SHA-256 values,
counts and the common display frame. `scripts/export-comparison.py` reproduces
the sampling from a private input JSON and restored registered predictions;
private source paths are not shipped.

The old Floor 1 preview and fly-through remain original overview assets, not
interactive comparison cases. The interactive viewer has one freely orbitable
camera setup with reset controls, without Top view/3D view or scene switches.

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
