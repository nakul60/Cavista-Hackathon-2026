import React from "react";
import "../App.css";

export function DesignSystemShowcase() {
  return (
    <div
      className="p-8 max-w-6xl mx-auto"
      style={{ backgroundColor: "var(--bg-page)" }}
    >
      <h1 className="heading-page mb-8">MedScript Design System Showcase</h1>

      {/* COLORS SECTION */}
      <section className="mb-12">
        <h2 className="heading-section mb-6">Colour Palette</h2>

        {/* Base Colors */}
        <div className="mb-8">
          <h3 className="heading-card mb-4">Background & Base</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch name="Clinical Linen" hex="#F5F2EE" />
            <ColorSwatch name="Warm White" hex="#FDFCFB" />
            <ColorSwatch name="Parchment" hex="#EDE9E3" />
            <ColorSwatch name="Divider" hex="#D8D2C8" />
          </div>
        </div>

        {/* Text Colors */}
        <div className="mb-8">
          <h3 className="heading-card mb-4">Text Hierarchy</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch name="Ink" hex="#1A1410" isDark />
            <ColorSwatch name="Slate" hex="#4A4540" isDark />
            <ColorSwatch name="Ash" hex="#8C867E" isDark />
            <div className="app-card"></div>
          </div>
        </div>

        {/* Brand Green */}
        <div className="mb-8">
          <h3 className="heading-card mb-4">Forest Green (Brand)</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorSwatch name="Forest Deep" hex="#1B4332" isDark />
            <ColorSwatch name="Forest" hex="#2D6A4F" isDark />
            <ColorSwatch name="Forest Mid" hex="#40916C" isDark />
            <ColorSwatch name="Forest Tint" hex="#D8F3DC" />
          </div>
        </div>

        {/* Semantic Colors */}
        <div className="mb-8">
          <h3 className="heading-card mb-4">Semantic Colours</h3>
          <div className="space-y-4">
            <div>
              <p className="label-field mb-3">Critical (Alert Red)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ColorSwatch name="Alert Red" hex="#9B2226" isDark />
                <ColorSwatch name="Alert Red Light" hex="#F8D7D7" />
                <ColorSwatch name="Alert Red Border" hex="#E8AAAA" />
              </div>
            </div>
            <div>
              <p className="label-field mb-3">Warning (Amber)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ColorSwatch name="Amber" hex="#7D4E00" isDark />
                <ColorSwatch name="Amber Light" hex="#FDF0DC" />
                <ColorSwatch name="Amber Border" hex="#F0CFA0" />
              </div>
            </div>
            <div>
              <p className="label-field mb-3">Success (Vital Green)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ColorSwatch name="Vital Green" hex="#1B4332" isDark />
                <ColorSwatch name="Vital Green Light" hex="#D8F3DC" />
                <ColorSwatch name="Vital Green Border" hex="#A8D5B5" />
              </div>
            </div>
            <div>
              <p className="label-field mb-3">System/AI (Gold)</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <ColorSwatch name="Gold" hex="#B7791F" isDark />
                <ColorSwatch name="Gold Light" hex="#FEF9EE" />
                <ColorSwatch name="Gold Border" hex="#E9C97A" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TYPOGRAPHY SECTION */}
      <section className="mb-12">
        <h2 className="heading-section mb-6">Typography</h2>

        <div className="space-y-8">
          <div className="app-card">
            <p className="label-field mb-2">Patient Name Header</p>
            <p className="heading-patient">Roshni Sharma</p>
            <p className="text-timestamp text-xs mt-2">
              Lora 600 • 32px • Line-height 1.2
            </p>
          </div>

          <div className="app-card">
            <p className="label-field mb-2">Page Title</p>
            <p className="heading-page">Morning Dashboard</p>
            <p className="text-timestamp text-xs mt-2">
              Lora 400 • 26px • Line-height 1.3
            </p>
          </div>

          <div className="app-card">
            <p className="label-field mb-2">Section Header</p>
            <p className="heading-section">EMR Record</p>
            <p className="text-timestamp text-xs mt-2">
              Lora 600 • 18px • Line-height 1.4
            </p>
          </div>

          <div className="app-card">
            <p className="label-field mb-2">Card Title</p>
            <p className="heading-card">Patient Vitals</p>
            <p className="text-timestamp text-xs mt-2">
              DM Sans 600 • 14px • Line-height 1.4 • +0.2px spacing
            </p>
          </div>

          <div className="app-card">
            <p className="label-field">Duration</p>
            <p className="text-field-value">5 days</p>
            <p className="text-timestamp text-xs mt-2">
              DM Sans | 400 value / 500 label • 11-13px
            </p>
          </div>

          <div className="app-card">
            <p className="label-field mb-2">Body / Summary Text</p>
            <p className="text-body">
              This is body text used for descriptions, summaries, and
              longer-form content. It uses DM Sans at 300 weight with 1.75
              line-height for optimal readability in medical contexts.
            </p>
            <p className="text-timestamp text-xs mt-2">
              DM Sans 300 • 15px • Line-height 1.75
            </p>
          </div>

          <div className="app-card">
            <p className="label-field mb-2">Data / Code Display</p>
            <p className="text-code">
              ICD-10: I20.9 | Patient ID: RSH-0221-001
            </p>
            <p className="text-timestamp text-xs mt-2">
              IBM Plex Mono • 12px • Line-height 1.4
            </p>
          </div>

          <div className="app-card">
            <p className="label-field mb-2">Vital Numbers</p>
            <p className="text-vital">120/80</p>
            <p className="text-timestamp text-xs mt-2">
              IBM Plex Mono 500 • 20px • Line-height 1.4
            </p>
          </div>
        </div>
      </section>

      {/* COMPONENTS SECTION */}
      <section className="mb-12">
        <h2 className="heading-section mb-6">Components</h2>

        {/* Buttons */}
        <div className="mb-8">
          <h3 className="heading-card mb-4">Buttons</h3>
          <div className="flex flex-wrap gap-4">
            <button className="app-button app-button-primary">
              Primary Action
            </button>
            <button className="app-button app-button-secondary">
              Secondary Action
            </button>
            <button className="app-button app-button-danger">
              Dangerous Action
            </button>
            <button
              className="app-button app-button-primary opacity-50 cursor-not-allowed"
              disabled
            >
              Disabled
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-8">
          <h3 className="heading-card mb-4">Status Badges</h3>
          <div className="flex flex-wrap gap-3">
            <span className="app-badge app-badge-success">✓ Stable</span>
            <span className="app-badge app-badge-warning">
              ⚠ Pending Review
            </span>
            <span className="app-badge app-badge-danger">✕ Critical</span>
            <span className="app-badge app-badge-info">⊙ AI Generated</span>
          </div>
        </div>

        {/* Status Pills */}
        <div className="mb-8">
          <h3 className="heading-card mb-4">Status Indicators</h3>
          <div className="flex flex-wrap gap-3">
            <span className="app-status app-status-stable">Stable</span>
            <span className="app-status app-status-pending">
              Pending Review
            </span>
            <span className="app-status app-status-critical">Critical</span>
          </div>
        </div>

        {/* Alerts */}
        <div className="mb-8">
          <h3 className="heading-card mb-4">Alert Messages</h3>
          <div className="space-y-3">
            <div className="app-alert app-alert-success">
              ✓ Patient vitals within normal range. Last checked 2 hours ago.
            </div>
            <div className="app-alert app-alert-warning">
              ⚠ Follow-up appointment recommended. Refer to cardiologist within
              2 weeks.
            </div>
            <div className="app-alert app-alert-critical">
              ✕ Blood pressure reading critically high. Immediate action
              required.
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="mb-8">
          <h3 className="heading-card mb-4">Form Inputs</h3>
          <div className="space-y-4 max-w-md">
            <div>
              <label htmlFor="name" className="app-label">
                Patient Name
              </label>
              <input
                id="name"
                type="text"
                className="app-input w-full"
                placeholder="Enter patient name"
              />
            </div>
            <div>
              <label htmlFor="diagnosis" className="app-label">
                Chief Complaint
              </label>
              <textarea
                id="diagnosis"
                className="app-textarea w-full"
                rows="3"
                placeholder="Enter chief complaint"
              ></textarea>
            </div>
            <div>
              <label htmlFor="status" className="app-label">
                Status
              </label>
              <select id="status" className="app-select w-full">
                <option>Select status...</option>
                <option>Stable</option>
                <option>Pending Review</option>
                <option>Critical</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* LAYOUT PATTERNS */}
      <section className="mb-12">
        <h2 className="heading-section mb-6">Example Layout</h2>
        <div className="app-card">
          <div className="border-b border-border pb-4 mb-4">
            <h2 className="heading-patient text-2xl">Rachel Martinez</h2>
            <p className="text-timestamp">Patient ID: RAM-0221-042</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="label-field mb-1">AGE</p>
              <p className="text-field-value">56</p>
            </div>
            <div>
              <p className="label-field mb-1">GENDER</p>
              <p className="text-field-value">Female</p>
            </div>
            <div>
              <p className="label-field mb-1">BLOOD TYPE</p>
              <p className="text-field-value">O+</p>
            </div>
            <div>
              <p className="label-field mb-1">STATUS</p>
              <div className="mt-1">
                <span className="app-status app-status-stable">Stable</span>
              </div>
            </div>
          </div>

          <div className="app-divider"></div>

          <div className="mt-6">
            <p className="label-field mb-3">RECENT VITALS</p>
            <table className="app-table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th>Reading</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Blood Pressure</td>
                  <td>
                    <span className="text-code">120/80 mmHg</span>
                  </td>
                  <td>
                    <span className="app-badge app-badge-success text-sm">
                      Normal
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Heart Rate</td>
                  <td>
                    <span className="text-code">72 bpm</span>
                  </td>
                  <td>
                    <span className="app-badge app-badge-success text-sm">
                      Normal
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>Temperature</td>
                  <td>
                    <span className="text-code">37.2°C</span>
                  </td>
                  <td>
                    <span className="app-badge app-badge-success text-sm">
                      Normal
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* USAGE GUIDE */}
      <section>
        <h2 className="heading-section mb-6">Implementation Guide</h2>
        <div className="app-card bg-clinical-parchment">
          <h3 className="heading-card mb-4">Using the Design System</h3>
          <pre className="text-code text-xs overflow-auto bg-white p-4 rounded border border-border">
            {`// CSS Variables
background: var(--bg-page);
color: var(--text-ink);
border: 1px solid var(--border);

// Tailwind Classes
<div className="bg-clinical-linen text-text-ink">
<button className="bg-forest-deep text-white">
<span className="border border-forest-border">

// Utility Classes (from App.css)
<div className="app-card">
<button className="app-button app-button-primary">
<span className="app-badge app-badge-success">
<input className="app-input">
<span className="label-field">LABEL</span>`}
          </pre>
        </div>
      </section>
    </div>
  );
}

function ColorSwatch({ name, hex, isDark = false }) {
  return (
    <div className="app-card">
      <div
        className="w-full h-24 rounded-md mb-3 border border-border"
        style={{ backgroundColor: hex }}
      ></div>
      <p className="text-field-value font-medium">{name}</p>
      <p className="text-code text-xs">{hex}</p>
    </div>
  );
}

export default DesignSystemShowcase;
