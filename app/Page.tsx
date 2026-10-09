
"use client";

import { useRef, useState } from "react";

type Category = {
  name: string;
  icon: string;
};

const categories: Category[] = [
  { name: "Pothole", icon: "🕳️" },
  { name: "Streetlight", icon: "💡" },
  { name: "Graffiti", icon: "🎨" },
  { name: "Sidewalk", icon: "🚶" },
  { name: "Traffic", icon: "🚦" },
  { name: "Other", icon: "📋" },
];

const steps = [
  {
    number: "01",
    title: "Spot an issue",
    description:
      "Tell us what needs attention in your neighborhood. Add a location and photo if available.",
  },
  {
    number: "02",
    title: "Create your report",
    description:
      "Turn your observations into a clear, structured civic report that officials can act on.",
  },
  {
    number: "03",
    title: "Reach the right people",
    description:
      "Find the relevant department and elected representatives, then take the next step.",
  },
];

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState("");
  const [showDemo, setShowDemo] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const fileInput = useRef<HTMLInputElement>(null);
  const reportSection = useRef<HTMLDivElement>(null);

  function scrollToReport() {
    reportSection.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setMenuOpen(false);
  }

  function useLocation() {
    if (!navigator.geolocation) {
      setError("Your browser does not support location detection.");
      return;
    }

    setLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation(
          `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`
        );
        setLocating(false);
      },
      () => {
        setError(
          "Location unavailable. You can enter an address manually."
        );
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }

  function handlePhoto(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Please select an image smaller than 8 MB.");
      return;
    }

    if (photoPreview) URL.revokeObjectURL(photoPreview);

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setError("");
  }

  function removePhoto() {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhoto(null);
    setPhotoPreview("");
    if (fileInput.current) fileInput.current.value = "";
  }

  function generateReport() {
    if (description.trim().length < 15) {
      setError("Please describe the issue in at least 15 characters.");
      return;
    }

    if (!location.trim()) {
      setError("Please enter a location or use your current location.");
      return;
    }

    setError("");

    // Next milestone:
    // Send description, category, location, and photo
    // to the AI report-generation backend.
    // Never put an AI API key directly in this file.
    setShowDemo(true);

    setTimeout(() => {
      document.getElementById("report-preview")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  }

  return (
    <main className="min-h-screen bg-[#F7F9FC] text-slate-900">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-200">
              D<span className="text-sky-300">.</span>
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight">
                District<span className="text-blue-600">Pulse</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Civic action platform
              </div>
            </div>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-blue-600">
              How it works
            </a>
            <a href="#example" className="text-sm font-medium text-slate-600 hover:text-blue-600">
              Example
            </a>
            <a href="#mission" className="text-sm font-medium text-slate-600 hover:text-blue-600">
              Our mission
            </a>
            <button
              onClick={scrollToReport}
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Report an Issue →
            </button>
          </div>

          <button
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </nav>

        {menuOpen && (
          <div className="space-y-4 border-t bg-white px-6 py-5 md:hidden">
            <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="block">
              How it works
            </a>
            <a href="#example" onClick={() => setMenuOpen(false)} className="block">
              Example
            </a>
            <a href="#mission" onClick={() => setMenuOpen(false)} className="block">
              Our mission
            </a>
            <button onClick={scrollToReport} className="font-bold text-blue-600">
              Report an Issue →
            </button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden px-5 pb-16 pt-20 md:pb-24 md:pt-28">
        <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -left-32 top-40 h-80 w-80 rounded-full bg-cyan-100/70 blur-3xl" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-5 py-2 text-sm font-semibold text-blue-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            A smarter way to improve your community
          </div>

          <h1 className="text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl md:text-7xl">
            Your neighborhood.
            <br />
            <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Your voice.
            </span>
            <br />
            Real change.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
            From broken streetlights to dangerous potholes,
            DistrictPulse helps turn everyday problems into
            actionable civic reports — and helps you find
            the people responsible for fixing them.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <button
              onClick={scrollToReport}
              className="rounded-2xl bg-blue-600 px-8 py-4 font-bold text-white shadow-xl shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
            >
              Report a Problem →
            </button>
            <a
              href="#how-it-works"
              className="rounded-2xl border border-slate-200 bg-white px-8 py-4 font-bold text-slate-700 transition hover:border-blue-300"
            >
              See How It Works
            </a>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-5 text-sm font-medium text-slate-500">
            <span>✓ No account needed</span>
            <span>✓ Free to get started</span>
            <span>✓ Built for communities</span>
          </div>
        </div>
      </section>

      {/* REPORT FORM */}
      <section
        ref={reportSection}
        id="report"
        className="scroll-mt-28 px-5 pb-24"
      >
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-2xl shadow-slate-200/70">
          <div className="border-b border-slate-100 bg-gradient-to-r from-blue-600 to-sky-500 px-7 py-8 text-white md:px-10">
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
              Community issue reporter
            </div>
            <h2 className="text-2xl font-extrabold md:text-3xl">
              Let's make something better.
            </h2>
            <p className="mt-2 text-blue-50">
              Tell us what you noticed. We'll help you take the next step.
            </p>
          </div>

          <div className="space-y-8 p-6 md:p-10">
            <div>
              <label htmlFor="description" className="text-base font-bold">
                What happened? <span className="text-red-500">*</span>
              </label>
              <p className="mt-1 text-sm text-slate-500">
                Describe the issue with as much detail as you can.
              </p>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={2000}
                placeholder="Example: There's a large pothole near the intersection of Birch Street and Brea Boulevard. Cars are swerving to avoid it, and it could cause an accident..."
                className="mt-4 min-h-40 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 p-5 text-base leading-7 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
              <div className="mt-2 text-right text-xs text-slate-400">
                {description.length} / 2000 characters
              </div>
            </div>

            <div>
              <p className="text-base font-bold">Choose a category</p>
              <p className="mt-1 text-sm text-slate-500">
                Optional — we'll help classify it later.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {categories.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    aria-pressed={category === item.name}
                    onClick={() =>
                      setCategory(category === item.name ? "" : item.name)
                    }
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-5 transition ${
                      category === item.name
                        ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-3xl">{item.icon}</span>
                    <span className="text-sm font-semibold">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="location" className="text-base font-bold">
                Where is the problem? <span className="text-red-500">*</span>
              </label>
              <p className="mt-1 text-sm text-slate-500">
                Enter an address, intersection, or landmark.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Street address or intersection"
                  className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={useLocation}
                  disabled={locating}
                  className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 text-sm font-bold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
                >
                  {locating ? "Locating..." : "⌖ Use My Location"}
                </button>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Location access is optional. Coordinates are used only if you grant permission.
              </p>
            </div>

            <div>
              <p className="text-base font-bold">
                Add a photo <span className="font-normal text-slate-400">(optional)</span>
              </p>
              <p className="mt-1 text-sm text-slate-500">
                A clear photo can help explain the issue.
              </p>

              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhoto(e.target.files?.[0])}
              />

              {photoPreview ? (
                <div className="relative mt-4 overflow-hidden rounded-2xl border border-slate-200">
                  {/* Local preview only; no photo is uploaded yet */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview}
                    alt="Selected issue"
                    className="max-h-72 w-full object-contain bg-slate-100"
                  />
                  <div className="flex items-center justify-between gap-3 p-4">
                    <span className="truncate text-sm text-slate-600">
                      {photo?.name}
                    </span>
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="font-bold text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  className="mt-4 flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 transition hover:border-blue-400 hover:bg-blue-50"
                >
                  <span className="text-3xl">📷</span>
                  <span className="font-bold text-slate-700">
                    Click to upload a photo
                  </span>
                  <span className="text-xs text-slate-400">
                    Image files up to 8 MB
                  </span>
                </button>
              )}
            </div>

            {error && (
              <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div className="border-t border-slate-100 pt-7">
              <button
                type="button"
                onClick={generateReport}
                className="w-full rounded-2xl bg-blue-600 px-6 py-5 text-lg font-extrabold text-white shadow-xl shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.99]"
              >
                Generate My Civic Report →
              </button>
              <p className="mt-4 text-center text-xs text-slate-400">
                Preview mode — AI generation will be connected in the next development phase.
              </p>
            </div>
          </div>
        </div>

        {showDemo && (
          <div
            id="report-preview"
            className="mx-auto mt-8 max-w-4xl rounded-3xl border border-blue-200 bg-white p-7 shadow-xl md:p-10"
          >
            <div className="mb-4 inline-block rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700">
              Draft preview — not AI-generated
            </div>
            <h3 className="text-2xl font-extrabold">
              Community Issue Report
            </h3>
            <div className="mt-6 space-y-4 text-sm leading-7">
              <p><strong>Category:</strong> {category || "Unclassified"}</p>
              <p><strong>Location:</strong> {location}</p>
              <p className="whitespace-pre-wrap">
                <strong>Issue description:</strong> {description}
              </p>
              <p><strong>Photo:</strong> {photo ? "Attached locally" : "None"}</p>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const report = [
                    "DistrictPulse Community Issue Report",
                    `Category: ${category || "Unclassified"}`,
                    `Location: ${location}`,
                    "",
                    description,
                  ].join("\n");
                  navigator.clipboard.writeText(report).catch(() => {
                    setError("Unable to copy. Please select the text manually.");
                  });
                }}
                className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700"
              >
                Copy Draft
              </button>
              <button
                onClick={() => setShowDemo(false)}
                className="rounded-xl border border-slate-200 px-6 py-3 font-bold"
              >
                Close Preview
              </button>
            </div>
            <p className="mt-5 text-xs text-slate-400">
              This is a local draft preview. No report has been submitted to a government agency.
            </p>
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="scroll-mt-24 bg-white px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              Simple by design
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight md:text-5xl">
              Three steps. One stronger community.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-slate-500">
              Civic participation shouldn't require navigating a maze of government websites.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="group rounded-3xl border border-slate-200 bg-white p-8 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-xl font-black text-blue-600">
                  {step.number}
                </div>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="mt-4 leading-8 text-slate-500">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXAMPLE */}
      <section id="example" className="scroll-mt-24 px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
              See the difference
            </p>
            <h2 className="mt-4 text-4xl font-extrabold">
              From observation to action.
            </h2>
            <p className="mt-4 text-slate-500">
              An illustrative example of what DistrictPulse is being built to do.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <div className="mb-6 inline-block rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
                BEFORE
              </div>
              <h3 className="text-xl font-bold">A resident notices a problem</h3>
              <div className="mt-7 rounded-2xl bg-slate-50 p-6 text-lg leading-8 text-slate-600">
                "There's a huge pothole on my street. People keep swerving around it, and someone might get hurt."
              </div>
              <p className="mt-6 text-sm text-slate-400">
                The problem is real, but where should the resident start?
              </p>
            </div>

            <div className="rounded-3xl border border-blue-200 bg-white p-8 shadow-xl shadow-blue-100/60">
              <div className="mb-6 inline-block rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
                AFTER — EXAMPLE OUTPUT
              </div>
              <h3 className="text-xl font-bold">
                Roadway Safety and Maintenance Request
              </h3>
              <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
                <p><strong>Issue:</strong> Road surface deterioration</p>
                <p><strong>Category:</strong> Public Works / Road Maintenance</p>
                <p><strong>Concern:</strong> A significant pothole may create a hazard for motorists and cyclists, particularly when drivers attempt to avoid the damaged roadway.</p>
                <p><strong>Requested action:</strong> Inspect the affected road surface and determine whether repair or temporary safety measures are necessary.</p>
              </div>
              <div className="mt-7 rounded-xl bg-blue-50 p-4 text-sm font-semibold text-blue-700">
                Next step: Identify the correct jurisdiction and official reporting channel.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROUTING PREVIEW */}
      <section className="bg-[#0B1730] px-5 py-24 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-400">
              Beyond reporting
            </p>
            <h2 className="mt-5 text-4xl font-extrabold leading-tight md:text-5xl">
              Know who can
              <span className="text-sky-400"> make a difference.</span>
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
              One of the hardest parts of reporting a local problem is knowing
              which government office actually handles it. DistrictPulse is
              being designed to help identify relevant departments, official
              reporting channels, and elected representatives.
            </p>
            <p className="mt-6 text-sm text-slate-400">
              Government lookup and jurisdiction verification are upcoming features.
            </p>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold">Routing preview</h3>
              <span className="rounded-full bg-sky-400/15 px-3 py-1 text-xs font-bold text-sky-300">
                Illustrative
              </span>
            </div>

            {[
              {
                icon: "🏛️",
                title: "Responsible Department",
                subtitle: "Public Works — example for a city road",
              },
              {
                icon: "📨",
                title: "Official Reporting Channel",
                subtitle: "Verified agency submission link — planned",
              },
              {
                icon: "👥",
                title: "Your Representatives",
                subtitle: "Location-based elected official lookup — planned",
              },
            ].map((item) => (
              <div key={item.title} className="mb-3 flex gap-4 rounded-2xl border border-white/10 bg-white/10 p-5">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-bold">{item.title}</div>
                  <div className="mt-1 text-sm text-slate-300">
                    {item.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section id="mission" className="scroll-mt-24 bg-white px-5 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Why DistrictPulse?
          </p>
          <h2 className="mt-5 text-4xl font-extrabold leading-tight md:text-5xl">
            Better communities begin with people who care.
          </h2>
          <p className="mt-7 text-lg leading-9 text-slate-600">
            Every community has problems worth solving. But knowing how to
            communicate those problems effectively — and who to contact —
            can be frustrating. DistrictPulse aims to make civic engagement
            more accessible, organized, and actionable for everyone.
          </p>

          <div className="mt-12 grid gap-5 text-left sm:grid-cols-3">
            {[
              ["Accessible", "Clear forms and a mobile-friendly experience."],
              ["Transparent", "Users review reports before choosing how to submit them."],
              ["Community-first", "Built to help residents participate in local problem-solving."],
            ].map(([title, description]) => (
              <div key={title} className="rounded-2xl border border-slate-200 p-6">
                <div className="mb-3 text-2xl text-blue-600">✓</div>
                <h3 className="font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl rounded-[36px] bg-gradient-to-r from-blue-700 to-sky-500 px-8 py-16 text-center text-white md:px-16">
          <h2 className="text-4xl font-extrabold md:text-5xl">
            Your voice can start a change.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-blue-50">
            A safer road. A working streetlight. A better neighborhood.
            Every improvement starts somewhere.
          </p>
          <button
            onClick={scrollToReport}
            className="mt-9 rounded-2xl bg-white px-9 py-4 font-extrabold text-blue-700 shadow-lg transition hover:-translate-y-1"
          >
            Start a Report <ArrowIcon />
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white px-5 py-12">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row">
          <div>
            <div className="text-xl font-extrabold">
              District<span className="text-blue-600">Pulse</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-7 text-slate-500">
              Making civic participation easier, one community issue at a time.
            </p>
          </div>
          <div className="text-sm leading-8 text-slate-500">
            <p>Independent civic technology project.</p>
            <p>Not affiliated with or endorsed by a government agency.</p>
            <p>Reports are not automatically submitted.</p>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-slate-100 pt-6 text-xs text-slate-400">
          © {new Date().getFullYear()} DistrictPulse. Built for stronger communities.
        </div>
      </footer>
    </main>
  );
}

