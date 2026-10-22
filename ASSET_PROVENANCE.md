# Displayed result provenance

Media include reconstruction predictions, paper figures and the selected
Floors 2, 4 and 5 coarse reference LiDAR ROI samples for the user-requested GT comparison.

## Interactive comparison

The interactive viewer offers three explicitly selected examples:

- Floor 5, 2025-12-02, Run 1;
- Floor 2, 2025-05-05, Run 1;
- Floor 4, 2025-12-02, Run 1.

These examples illustrate strong archived Ours versus PanoVGGT reconstructions;
they are not a representative-average claim. GT and Ours occupy fixed panels,
and the third panel selects an available baseline from the same run. Missing
methods are listed rather than filled with clouds from another sequence.
Each scene uses a common origin, proper Z-up to Y-up display rotation, camera
and metric scale. There is no per-method centering, normalization or cleanup.

### Reference ground truth

GT comes from the actual supervisor-provided LiDAR bundle, cropped with the
original evaluation ROI rule. All occupied 30 cm cells are represented by their
centers and shown in uniform gray, with no additional random point cap.
Exact source coordinates and sub-voxel offsets are not exported. Counts are
34,242 for Floor 5, 58,148 for Floor 2 and 40,605 for Floor 4. No high-detail GT
file is distributed. These coarse derived references remain downloadable and
provide no privacy guarantee or substitute for the evaluation reference.

For this export, the restored original float32 GT and the archived ROI function
were used. Current ROI counts differ slightly from recorded historical counts
(Floor 5: -21 points; Floor 4: -12; Floor 2: -6); exact historical crop identity
is not claimed. Exported cloud counts and hashes are recorded in the manifest.
This changes visualization only; archived prediction clouds and metric values
are not recomputed or relabelled as newly validated results.

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

### Additional Floor 2 and Floor 4 reruns

The same four baseline methods have also been run for Floor 2 (2025-05-05,
Run 1; 564 panoramas) and Floor 4 (2025-12-02, Run 1; 587 panoramas).
PatchMatch, VGGT, VGGT-SLAM2 and MASt3R-SLAM results use the same
input sizes and method settings described above. The original RGB source is
the restored official bag; these are fresh runs, not recovered historical
predictions. Each uses the same display origin and rotation as the existing
panels, with global trajectory alignment and no ICP or shape correction.
VGGT-SLAM2 accepts five loop closures on Floor 2 and three on Floor 4.
MASt3R-SLAM exports 92 and 157 reconstructed keyframes respectively, with
tracking losses and relocalization attempts preserved. Keyframe counts are
not counts of all successfully tracked input captures. These reruns have no
new benchmark CD/F@25 scores. PatchMatch returns poses for 508/564 captures on Floor 2 and 290/587 on Floor 4,
producing 26,074 and 572,029 dense points respectively. All four new methods
are available on both floors.

### Display sampling

Uniform random sampling (seed 2027) preserves source geometry and RGB. The
initial budget is at most 180,000 points and the detail budget at most 1,000,000
points per method. Source clouds smaller than these caps are not upsampled.
PatchMatch on Floor 5 (67,650 points) and Floor 2 (26,074 points) needs no
duplicate high-detail file; Floor 4 progressively loads its 572,029 points. During interaction, larger clouds draw a uniform
180k prefix, restoring full detail after movement stops. Auto mode upgrades on
desktop devices with sufficient reported memory and without data-saving
mode; mobile defaults to lightweight detail. Users can choose detail manually.

`public/media/comparison/manifest.json` records source/export SHA-256 values,
counts and the common display frame. `scripts/export-comparison.py` reproduces
the sampling from a private input JSON and restored registered predictions;
private source paths are not shipped.

The unused standalone Floor 1 preview, fly-through and associated captions
are no longer distributed. The overview video itself is unchanged. The interactive
viewer has freely orbitable synchronized cameras with reset controls and a scene
selector, without a Top view/3D view split.

## Overview and figures

`rigor-results-overview.mp4` is the 41-second results-first overview, version 6.
It includes the selected floor-1 reconstruction, local repair and retrieval
illustrations, and a separate long-sequence underground fly-through. It is not
a quantitative comparison or a claim that every sequence has the same quality.

The pipeline and teaser assets are the supervisor's updated 2026-10-06
versions, retained byte-for-byte from commit `0073202`. The qualitative
figure is also unchanged from her branch.

- `paper-pipeline.png`: supervisor's updated pipeline
  (SHA-256 `aa22d8d95545cdbb222ea927bdc444c6221658bfba053caeca60801394b3dc00`).
- `paper-teaser.png`: supervisor's teaser
  (SHA-256 `9f5898d7f90355652eb84629b9769f3122b8c909ad631891a64191defad92d42`).
- `paper-qualitative.png`: unchanged qualitative comparison
  (SHA-256 `ef704a3351f5d5637dada23e6ca21b2276113a0c3083be27783fbb2c4619c179`).

The qualitative figure compares `floor_1/2025-05-05/run_1` and
`floor_2/2025-10-28/run_2`. Interactive Floors 4 and 5 offer different floors,
and the Floor 2 interactive example uses a different date/run. Original figure
PDFs are retained outside the repository and are not distributed with the site.

All corresponding PNGs are retained from the supervisor branch. No labels,
numbers, curves or scientific content in these static assets were changed.
Figures are displayed inline without full-resolution links and remain scrollable on narrow screens.
The separate overview video is unchanged. The interactive section compares
the selected real LiDAR reference with reconstruction predictions; it is a
qualitative demonstration, not additional aggregate quantitative evidence.

See `public/media/SHA256SUMS` for checksums of every distributed media asset.
