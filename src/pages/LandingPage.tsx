import {
  ArrowRight,
  Braces,
  FlaskConical,
  Layers3,
  RadioTower,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PRODUCT } from "../app/config/product";
import { achievements } from "../content/achievements";
import { tracks } from "../content/registry";
import { useProgress } from "../features/progress/ProgressContext";
import { selectTrackProgress } from "../features/progress/progressSelectors";
import { AchievementCard } from "../components/achievements/AchievementCard";
import { TrackCard } from "../components/tracks/TrackCard";

function ArchiveOrrery() {
  return (
    <div className="archive-orrery" aria-label="Diagram of the living code archive">
      <div className="orrery-grid" aria-hidden="true" />
      <div className="orbit orbit-one" aria-hidden="true">
        <span />
      </div>
      <div className="orbit orbit-two" aria-hidden="true">
        <span />
      </div>
      <div className="orbit orbit-three" aria-hidden="true">
        <span />
      </div>
      <div className="archive-core">
        <span className="core-pulse" />
        <strong>NX</strong>
        <small>CORE / 01</small>
      </div>
      <div className="orrery-readout readout-a">
        <span>NEURAL PATH</span>
        <strong>RESTORABLE</strong>
      </div>
      <div className="orrery-readout readout-b">
        <span>SIGNAL ENERGY</span>
        <strong>000 / 180</strong>
      </div>
      <div className="orrery-readout readout-c">
        <span>ACTIVE SECTOR</span>
        <strong>SERPENTINE</strong>
      </div>
      <div className="specimen-tag">
        <span>SPECIMEN</span>
        <strong>PY–01</strong>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { state } = useProgress();
  const python = tracks[0];
  if (!python) return null;

  return (
    <main id="main-content">
      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow">
            <span aria-hidden="true">●</span> Bio-digital learning system / Archive online
          </p>
          <h1>
            Recover the logic.
            <em>Rebuild the signal.</em>
          </h1>
          <p className="hero-description">
            NEXUS is a programming platform found inside a dormant computational organism.
            Learn Python by restoring fragments, reconnecting neural paths, and cataloging
            rare logic relics.
          </p>
          <div className="button-row">
            <Link className="button button-primary" to="/tracks/python">
              Begin Python expedition <ArrowRight aria-hidden="true" />
            </Link>
            <Link className="button button-secondary" to="/tracks">
              Inspect all expeditions
            </Link>
          </div>
          <dl className="hero-metrics">
            <div>
              <dt>Recovered fragments</dt>
              <dd>15</dd>
            </div>
            <div>
              <dt>Archive sectors</dt>
              <dd>03</dd>
            </div>
            <div>
              <dt>Execution core</dt>
              <dd>Python / WASM</dd>
            </div>
          </dl>
        </div>
        <ArchiveOrrery />
      </section>

      <section className="manifesto-band">
        <div className="section-shell manifesto-grid">
          <div>
            <span className="eyebrow">The living code archive</span>
            <h2>Knowledge is not consumed. It is reconstructed.</h2>
          </div>
          <p>
            Every lesson is a dormant logic fragment. Every correct program carries Signal
            Energy through a damaged path. Your progress turns a sealed archive into a
            working system.
          </p>
        </div>
      </section>

      <section className="section-shell feature-section">
        <header className="section-intro">
          <span className="section-number">01 / INSTRUMENTS</span>
          <div>
            <p className="eyebrow">A serious learning workspace</p>
            <h2>Field equipment for learning by doing</h2>
            <p>
              Theory, executable specimens, input channels, validation, and durable
              progress operate as one coherent system.
            </p>
          </div>
        </header>
        <div className="feature-grid">
          {[
            {
              icon: Braces,
              label: "Live execution",
              title: "Python inside the browser",
              text: "A dedicated Web Worker runs code with Pyodide, captures output, and interrupts runaway loops.",
            },
            {
              icon: FlaskConical,
              label: "Active recovery",
              title: "Validation beyond “it ran”",
              text: "Seven validation strategies check output and code structure before a task is stabilized.",
            },
            {
              icon: Layers3,
              label: "Extensible archive",
              title: "Content-first architecture",
              text: "Add lessons as typed data files without rebuilding route or progress components.",
            },
            {
              icon: ShieldCheck,
              label: "Local continuity",
              title: "Progress stays on your device",
              text: "Versioned storage, corruption recovery, export, import, and duplicate-XP protection preserve work.",
            },
          ].map(({ icon: Icon, label, title, text }, index) => (
            <article className="feature-instrument" key={title}>
              <div className="instrument-index">0{index + 1}</div>
              <Icon aria-hidden="true" />
              <span>{label}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell journey-preview">
        <header className="section-intro">
          <span className="section-number">02 / EXPEDITION</span>
          <div>
            <p className="eyebrow">Python Core / Active</p>
            <h2>Three sectors. One restored reasoning system.</h2>
          </div>
        </header>
        <div className="journey-line">
          {python.worlds.map((world, index) => (
            <article key={world.id}>
              <div className="journey-node">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div>
                <small>{world.landmark}</small>
                <h3>{world.title}</h3>
                <p>{world.description}</p>
                <strong>{world.lessons.length} fragments</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell track-preview-section">
        <header className="section-intro">
          <span className="section-number">03 / LANGUAGES</span>
          <div>
            <p className="eyebrow">Archive sectors</p>
            <h2>One architecture, five language expeditions</h2>
          </div>
        </header>
        <div className="track-preview-grid">
          {tracks.slice(0, 3).map((track, index) => (
            <TrackCard
              featured={index === 0}
              key={track.id}
              track={track}
              progress={selectTrackProgress(track, state.progress)}
            />
          ))}
        </div>
        <Link className="text-link" to="/tracks">
          View all five expeditions <ArrowRight aria-hidden="true" />
        </Link>
      </section>

      <section className="relic-preview-section">
        <div className="section-shell">
          <header className="section-intro">
            <span className="section-number">04 / RELICS</span>
            <div>
              <p className="eyebrow">Gamification with meaning</p>
              <h2>Rare artifacts record real mastery</h2>
              <p>
                Signal Energy measures recovered work. Pulse Chains reward continuity.
                Relics mark specific accomplishments instead of decorative clicks.
              </p>
            </div>
          </header>
          <div className="relic-preview-grid">
            {achievements.slice(0, 3).map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                unlocked={index === 0}
                compact
              />
            ))}
          </div>
          <div className="gamification-readout">
            <RadioTower aria-hidden="true" />
            <div>
              <span>Signal Energy</span>
              <strong>Task +25 / Bonus +40 / Fragment +60</strong>
            </div>
            <Sparkles aria-hidden="true" />
            <div>
              <span>Relic catalog</span>
              <strong>{achievements.length} recoverable specimens</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="final-cta section-shell">
        <div className="cta-core" aria-hidden="true">
          NX
        </div>
        <div>
          <span className="eyebrow">{PRODUCT.metaphor}</span>
          <h2>The first signal is waiting.</h2>
          <p>Open the Serpentine Archive and write the program that wakes it.</p>
        </div>
        <Link className="button button-primary" to="/tracks/python">
          Start recovering <ArrowRight aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
