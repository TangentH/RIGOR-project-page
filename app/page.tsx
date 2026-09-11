import Image from 'next/image';
import { assetUrl } from './asset-url';
import PointCloudViewer from './point-cloud-viewer';

export default function Home() {
  return (
    <main className="page-shell">
      <header className="project-header">
        <h1>
          <span>RIGOR:</span> Rig-Informed Geometry for Omnidirectional
          Reconstruction
        </h1>
        <p className="authors">Tingjun Huang · Dmitry Rudshin · Mathieu Meyer · Pietro Bonazzi · Marc Pollefeys · Emilia Szymańska</p>
        <p className="tagline">
          Long-sequence 3D reconstruction from omnidirectional video with a
          frozen perspective backbone.
        </p>
        <nav className="project-links" aria-label="Project links">
          <span className="project-link unavailable" aria-label="Paper link coming soon">
            Paper
          </span>
          <a
            className="project-link"
            href="https://github.com/TangentH/RIGOR"
            target="_blank"
            rel="noopener noreferrer"
          >
            Code
          </a>
        </nav>
      </header>

      <section className="hero-media" id="video" aria-label="Project overview video">
        <video controls preload="metadata" poster={assetUrl('/og.png')}>
          <source src={assetUrl('/media/rigor-results-overview.mp4')} type="video/mp4" />
          <track kind="captions" src={assetUrl('/media/rigor-results-overview.en.vtt')} srcLang="en" label="Visual descriptions" />
          Your browser does not support the video element.
        </video>
        <p>
          Each panorama becomes a constrained four-view rig for local
          consistency, capture-level retrieval, and long-range reconstruction.
        </p>
      </section>

      <section className="content-section" id="abstract">
        <h2>Abstract</h2>
        <p>
          Feed-forward 3D reconstruction models recover dense geometry and
          camera motion from image streams, but their predictions can become
          inconsistent over long trajectories. Omnidirectional cameras provide
          wide spatial coverage, while most pretrained reconstructors expect
          perspective images. RIGOR bridges this gap without retraining the
          reconstruction backbone. It treats four perspective views rendered
          from each panorama as a virtual rig with known co-location and
          relative orientation, and uses this structure for validated local
          repair, cyclic multi-view loop retrieval, geometric verification, and
          global pose-graph optimization. The resulting pipeline improves
          trajectory accuracy and reconstructed geometry on challenging long
          construction-site sequences.
        </p>
      </section>

      <section className="content-section" id="method">
        <h2>Method</h2>
        <div className="method-summary">
          <p>
            <strong>Local consistency.</strong> A four-view rig fit identifies
            an isolated pose and pointmap inconsistency. A correction is
            accepted only when the shared-view geometry improves.
          </p>
          <p>
            <strong>Long-range consistency.</strong> Four directional
            descriptors retrieve revisited captures under one cyclic yaw
            shift. Joint prediction verifies the resulting measurement before
            a Sim(3) graph update.
          </p>
        </div>
        <figure className="paper-figure">
          <div className="figure-scroll">
            <a href={assetUrl('/media/paper-pipeline.pdf')} target="_blank" rel="noopener noreferrer" aria-label="Open the full-resolution pipeline figure">
              <Image
                src={assetUrl('/media/paper-pipeline.png')}
                width={2400}
                height={662}
                sizes="(min-width: 1128px) 1080px, 960px"
                alt="Paper Figure 2: four-view decomposition, frozen prediction, rig repair, cyclic loop retrieval, joint verification, and global reconstruction"
              />
            </a>
          </div>
          <figcaption>
            Pipeline overview from the paper (Fig. 2).{' '}
            <a href={assetUrl('/media/paper-pipeline.pdf')} target="_blank" rel="noopener noreferrer">View full resolution</a>.
          </figcaption>
        </figure>
      </section>

      <section className="content-section" id="interactive-result">
        <h2>Interactive reconstruction</h2>
        <p className="section-intro">
          Explore a prediction-only reconstruction from a representative
          sequence. Ground-truth geometry is not included.
        </p>
        <PointCloudViewer />
        <details className="paired-video">
          <summary>Watch the corresponding reconstruction</summary>
          <video controls muted preload="none" aria-label="Fly-through of the same floor 1 reconstruction">
            <source src={assetUrl('/media/floor1-0505-run1-flythrough.mp4')} type="video/mp4" />
            <track kind="captions" src={assetUrl('/media/floor1-0505-run1.en.vtt')} srcLang="en" label="Visual description" />
          </video>
        </details>
      </section>

      <section className="content-section" id="results">
        <h2>Qualitative results</h2>
        <p className="section-intro">
          The paper compares trajectories and reconstructed point clouds on
          two challenging sequences. Each method is shown on the same
          sequence within a row.
        </p>
        <figure className="paper-figure">
          <div className="figure-scroll">
            <a href={assetUrl('/media/paper-qualitative.pdf')} target="_blank" rel="noopener noreferrer" aria-label="Open the full-resolution qualitative comparison">
              <Image
                src={assetUrl('/media/paper-qualitative.png')}
                width={2400}
                height={1326}
                sizes="(min-width: 1128px) 1080px, 960px"
                alt="Paper Figure 4: trajectories and point clouds for Ours, PanoVGGT, VGGT-SLAM2, MASt3R-SLAM, PatchMatch, and VGGT on two construction-site sequences"
              />
            </a>
          </div>
          <figcaption>
            Qualitative comparison from the paper (Fig. 4). For each sequence,
            trajectories are above the corresponding point clouds.{' '}
            <a href={assetUrl('/media/paper-qualitative.pdf')} target="_blank" rel="noopener noreferrer">View full resolution</a>.
          </figcaption>
        </figure>
      </section>

      <footer>
        <p>RIGOR — Rig-Informed Geometry for Omnidirectional Reconstruction</p>
      </footer>
    </main>
  );
}
