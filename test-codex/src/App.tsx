import { useState } from "react";
import { KeycapIntro } from "./components/KeycapIntro";
import "./styles/app.css";

export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <main className="site-shell" data-intro-complete={introComplete}>
      <KeycapIntro onComplete={() => setIntroComplete(true)} />

      <section className="portfolio-home" aria-hidden={!introComplete}>
        <div className="portfolio-kicker">Portfolio 2026</div>
        <h1>yulssem</h1>
        <p>
          A tactile portfolio landing system where interface craft, motion, and
          frontend engineering meet in one quiet product moment.
        </p>
        <a href="mailto:hello@yulssem.dev" className="contact-link">
          Start a conversation
        </a>
      </section>
    </main>
  );
}
