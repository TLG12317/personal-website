import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Playpen.css';

// Each line: { text, delay (ms before it appears), glitch (optional) }
const bootSequence = [
  { text: '> PLAYPEN.EXE', delay: 150 },
  { text: '', delay: 100 },
  { text: 'Establishing connection...', delay: 400 },
  { text: 'Environment  ......... OK', delay: 350 },
  { text: 'Physics      ......... OK', delay: 300 },
  { text: 'SIGRUNA AI   ......... OK', delay: 300 },
  { text: 'Access level ......... DENIED', delay: 500, warn: true },
];

const finalLines = [
  { text: '' },
  { text: 'STATUS: Closed for renovations.' },
  { text: "LAST LOG: Sigruna wants her privacy" },
  { text: 'while she rearranges the furniture.' },
  { text: '' },
  { text: 'Please visit again in a future update.' },
];

const inventory = [
  { icon: '🧂', label: 'Salt' },
  { icon: '🎨', label: 'Paint' },
  { icon: '🍪', label: 'Cookie' },
  { icon: '🧸', label: 'Teddy' },
];

const features = [
  { label: 'Sigruna', done: false },
  { label: 'Interactive toys', done: false },
  { label: 'Physics sandbox', done: false },
  { label: 'Coffee machine installed', done: true },
];

export default function Playpen() {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(0);
  const [glitching, setGlitching] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showPanels, setShowPanels] = useState(false);
  const timeouts = useRef([]);

  useEffect(() => {
    let elapsed = 0;

    bootSequence.forEach((line, i) => {
      elapsed += line.delay;
      const t = setTimeout(() => setVisibleCount(i + 1), elapsed);
      timeouts.current.push(t);
    });

    // signature moment: brief signal glitch right after "ACCESS DENIED"
    const glitchStart = setTimeout(() => setGlitching(true), elapsed + 200);
    const glitchEnd = setTimeout(() => {
      setGlitching(false);
      setShowFinal(true);
    }, elapsed + 900);

    const panelsIn = setTimeout(() => setShowPanels(true), elapsed + 1500);

    timeouts.current.push(glitchStart, glitchEnd, panelsIn);

    return () => timeouts.current.forEach(clearTimeout);
  }, []);

  return (
    <div className="playpen-screen">
      <div className="crt-scanlines" />
      <div className="crt-vignette" />

      <div className={`playpen-terminal ${glitching ? 'is-glitching' : ''}`}>
        <div className="terminal-titlebar">
          <span>PLAYPEN.EXE</span>
          <span className="terminal-version">v0.2 ALPHA</span>
        </div>

        <div className="terminal-body">
          {bootSequence.slice(0, visibleCount).map((line, i) => (
            <div
              key={i}
              className={`terminal-line ${line.warn ? 'line-warn' : ''}`}
            >
              {line.text}
            </div>
          ))}

          {showFinal &&
            finalLines.map((line, i) => (
              <div key={`f-${i}`} className="terminal-line line-fade-in">
                {line.text}
              </div>
            ))}

          {showFinal && (
            <button
              className="terminal-exit"
              onClick={() => navigate('/')}
            >
              &gt; [ EXIT ]<span className="cursor-blink">_</span>
            </button>
          )}
        </div>
      </div>

      {showPanels && (
        <div className="side-panels">
          <div className="panel">
            <div className="panel-title">Inventory</div>
            {inventory.map((item) => (
              <div className="panel-row" key={item.label}>
                <span>{item.icon} {item.label}</span>
                <span className="locked-tag">LOCKED</span>
              </div>
            ))}
          </div>

          <div className="panel">
            <div className="panel-title">Upcoming features</div>
            {features.map((f) => (
              <div className="panel-row" key={f.label}>
                <span className={`checkbox ${f.done ? 'checked' : ''}`}>
                  {f.done ? '☑' : '☐'}
                </span>
                <span className={f.done ? 'feature-done' : ''}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
