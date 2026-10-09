import Image from 'next/image';
import { assetUrl } from './asset-url';
import PointCloudViewer from './point-cloud-viewer';

function ArxivIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M7 2.75A1.75 1.75 0 0 0 5.25 4.5v15A1.75 1.75 0 0 0 7 21.25h10a1.75 1.75 0 0 0 1.75-1.75V8.56a1.75 1.75 0 0 0-.5-1.22l-3.6-3.81a1.75 1.75 0 0 0-1.27-.53H7Zm6 1.9 3.82 4.04H13V4.65Zm-4.25 7.6h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5Zm0 3.5h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 .5C5.65.5.5 5.66.5 12.03c0 5.1 3.3 9.42 7.88 10.95.58.1.79-.25.79-.57 0-.28-.01-1.2-.02-2.17-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.05-.72.08-.71.08-.71 1.16.08 1.78 1.2 1.78 1.2 1.03 1.78 2.71 1.27 3.37.97.1-.75.4-1.27.73-1.56-2.56-.29-5.24-1.29-5.24-5.76 0-1.27.46-2.32 1.2-3.13-.12-.3-.52-1.5.12-3.13 0 0 .98-.32 3.2 1.2a11.1 11.1 0 0 1 5.82 0c2.22-1.52 3.2-1.2 3.2-1.2.64 1.63.24 2.83.12 3.13.75.81 1.2 1.86 1.2 3.13 0 4.48-2.69 5.47-5.26 5.75.41.36.78 1.08.78 2.18 0 1.57-.01 2.84-.01 3.22 0 .32.21.68.8.57A11.54 11.54 0 0 0 23.5 12.03C23.5 5.66 18.35.5 12 .5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="page-shell">
      <header className="project-header">
        <h1>
          <span>RIGOR:</span> Rig-Informed Geometry for Omnidirectional
          Reconstruction
        </h1>
        <p className="authors">
          Tingjun Huang<sup>1</sup>, Dmitry Rudshin<sup>1</sup>, Mathieu Meyer
          <sup>1</sup>, Pietro Bonazzi<sup>1</sup>, Marc Pollefeys<sup>1,2</sup>,
          Emilia Szymańska<sup>3</sup>
        </p>
        <p className="affiliations">
          <span>
            <sup>1</sup>ETH Zurich
          </span>
          <span>
            <sup>2</sup>Microsoft
          </span>
          <span>
            <sup>3</sup>Hilti
          </span>
        </p>

        <nav className="project-links" aria-label="Project links">
          <a
            className="project-link"
            href="https://arxiv.org/abs/2609.13504"
            target="_blank"
            rel="noopener noreferrer"
          >
            <ArxivIcon />
            Paper
          </a>
          <a
            className="project-link"
            href="https://github.com/TangentH/RIGOR"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon />
            Code
          </a>
        </nav>

        <figure className="paper-figure">
          <div className="figure-scroll">
            <a href={assetUrl('/media/paper-teaser.pdf')} target="_blank" rel="noopener noreferrer" aria-label="Open the full-resolution teaser figure">
              <Image
                src={assetUrl('/media/paper-teaser.png')}
                width={2400}
                height={662}
                sizes="(min-width: 1128px) 1080px, 960px"
                alt="Paper Teaser Figure: overview of the RIGOR method"
              />
            </a>
          </div>
          
          <figcaption>
            Long-sequence 3D reconstruction from omnidirectional video with a frozen perspective backbone.{' '}
            <a href={assetUrl('/media/paper-pipeline.pdf')} target="_blank" rel="noopener noreferrer">View full resolution</a>.
          </figcaption>
        </figure>
        
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
            Pipeline overview.{' '}
            <a href={assetUrl('/media/paper-pipeline.pdf')} target="_blank" rel="noopener noreferrer">View full resolution</a>.
          </figcaption>
        </figure>
      </section>

      <section className="content-section" id="interactive-result">
        <h2>Interactive reconstruction</h2>
        <p className="section-intro">
          Compare reconstructions of Floor 5, 2 December 2025, Run 1.
          Rotate and zoom the reconstructions together to inspect their geometry.
        </p>
        <PointCloudViewer />
        {/* <details className="paired-video">
          <summary>Watch the corresponding reconstruction</summary>
          <video controls muted preload="none" aria-label="Fly-through of the same floor 1 reconstruction">
            <source src={assetUrl('/media/floor1-0505-run1-flythrough.mp4')} type="video/mp4" />
            <track kind="captions" src={assetUrl('/media/floor1-0505-run1.en.vtt')} srcLang="en" label="Visual description" />
          </video>
        </details> */}
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
            Qualitative comparison. For each sequence,
            trajectories are above the corresponding point clouds.{' '}
            <a href={assetUrl('/media/paper-qualitative.pdf')} target="_blank" rel="noopener noreferrer">View full resolution</a>.
          </figcaption>
        </figure>
      </section>

      <section className="content-section" id="citation">
        <h2>Citation</h2>
        <p className="section-intro">
          If you use RIGOR in your work, please cite the paper as below.
        </p>
        <pre className="citation-block" aria-label="BibTeX citation for RIGOR">
{`@misc{huang2026rigor,
      title={RIGOR: Rig-Informed Geometry for Omnidirectional Reconstruction}, 
      author={Tingjun Huang and Dmitry Rudshin and Mathieu Meyer and Pietro Bonazzi and Marc Pollefeys and Emilia Szymańska},
      year={2026},
      eprint={2609.13504},
      archivePrefix={arXiv},
      primaryClass={cs.CV},
      url={https://arxiv.org/abs/2609.13504}, 
}`}
        </pre>
      </section>

      <footer>
        <p>RIGOR — Rig-Informed Geometry for Omnidirectional Reconstruction</p>
      </footer>
    </main>
  );
}
