"use client";

import React, { useState } from "react";

export default function Home() {
  const [selectedPoll, setSelectedPoll] = useState("A");
  const [searchQuery, setSearchQuery] = useState("");

  const newsItems = [
    {
      cat: "NAV LOG",
      date: "SEP 30",
      title: "Passed Maritime Safety Inspection & Safe Harbor Protocol",
    },
    {
      cat: "DEV LOG",
      date: "SEP 29",
      title: "Refactored Next.js 16 App Router & Responsive Mobile UI",
    },
    {
      cat: "VIBE LOG",
      date: "SEP 28",
      title: "Mastered Nintendo 2001 Console Hardware Design Specs",
    },
  ];

  const featuredSites = [
    {
      name: "GitHub (@tkflrnstk)",
      url: "https://github.com/tkflrnstk",
      caption: "github.com/tkflrnstk",
      bg: "bg-[#206479]", // Systems Teal
      label: "CODE REPO",
    },
    {
      name: "Tech & Sea Blog",
      url: "#",
      caption: "blog.nolink.dev",
      bg: "bg-[#a7282b]", // Games Red
      label: "LOGS",
    },
    {
      name: "Maritime Career",
      url: "#",
      caption: "gov.maritime.kr",
      bg: "bg-[#3d4f97]", // Chrome Indigo
      label: "STORY",
    },
    {
      name: "Contact Email",
      url: "mailto:contact@example.com",
      caption: "contact@example.com",
      bg: "bg-[#60619c]", // Muted Indigo
      label: "INQUIRY",
    },
  ];

  return (
    <div className="min-h-screen bg-[#7a8aba] text-[#21242e] font-sans p-2 sm:p-4 md:p-6 flex flex-col items-center select-none overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          MAIN CHASSIS CONTAINER (~830px Responsive Mobile & Desktop)
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-[830px] flex flex-col gap-2">

        {/* 1. MASTHEAD : Mascot Speech Bubble & Search Module */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 px-1">
          {/* Mascot & Speech Bubble */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#e60012] border-2 border-[#21242e] rounded-full flex items-center justify-center text-white text-lg sm:text-xl shadow-sm shrink-0">
              ⚓
            </div>
            <div className="relative bg-white border-2 border-[#21242e] rounded-xl px-2.5 py-1 shadow-xs text-[11px] sm:text-xs font-bold text-[#21242e] leading-snug">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-8 border-r-[#21242e]" />
              Welcome to Governor Noh's Machine!
            </div>
          </div>

          {/* Search Module */}
          <div className="flex items-center gap-1 bg-[#8ba1d4] p-1 border border-[#3d4f97] rounded-xs text-xs overflow-x-auto">
            <span className="font-bold text-[10px] text-[#3d4f97] uppercase tracking-wider px-1 shrink-0">
              Search:
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Keywords..."
              className="w-24 sm:w-32 bg-white border border-[#3d4f97] px-1.5 py-0.5 text-xs text-[#21242e] focus:outline-none shrink-0"
            />
            <select className="bg-white border border-[#21242e] text-[11px] font-bold px-1 py-0.5 shrink-0">
              <option>All</option>
              <option>Systems</option>
              <option>Games</option>
            </select>
            <button className="bevel-button-amber px-2 py-0.5 font-bold text-[11px] uppercase cursor-pointer shrink-0">
              GO
            </button>
          </div>
        </div>

        {/* 2. DUAL NAVIGATION BARS */}
        <div className="flex flex-col border-2 border-[#21242e] shadow-md overflow-hidden">
          {/* Primary Nav (Carbon Navy Slab with Halftone Texture) */}
          <div className="carbon-halftone px-2 sm:px-3 py-2 flex items-center justify-between border-b border-[#3d4f97] gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            
            {/* Nintendo Racetrack Pill Logo */}
            <div className="bg-white rounded-full px-2.5 py-0.5 border-2 border-[#e60012] flex items-center shadow-xs shrink-0">
              <span className="text-[#e60012] font-black italic tracking-tighter text-xs sm:text-sm">
                Nintendo
              </span>
              <span className="text-[9px] font-bold text-[#21242e] ml-1 uppercase">
                .com
              </span>
            </div>

            {/* Gold Section Navigation Links */}
            <div className="flex items-center gap-3 sm:gap-5 text-xs font-bold tracking-wider uppercase shrink-0">
              <a href="#hero" className="text-[#e48600] hover:text-[#ffb13b] transition-colors">
                GAMES
              </a>
              <a href="#systems" className="text-[#e48600] hover:text-[#ffb13b] transition-colors">
                SYSTEMS
              </a>
              <a href="#news" className="text-[#e48600] hover:text-[#ffb13b] transition-colors">
                NAVIGATOR
              </a>
              <a href="#poll" className="text-[#e48600] hover:text-[#ffb13b] transition-colors">
                NSIDER
              </a>
              <a href="#featured" className="text-[#e48600] hover:text-[#ffb13b] transition-colors">
                DOWNLOADS
              </a>
            </div>

            {/* Amber Utility Chips */}
            <div className="flex items-center gap-1 shrink-0">
              <button className="bevel-button-amber px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase cursor-pointer">
                CODE BANK
              </button>
              <button className="bevel-button-amber px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase cursor-pointer">
                GAME FINDER
              </button>
            </div>
          </div>

          {/* Secondary Nav (Pale Sky Strip) */}
          <div className="bg-[#9fbee7] border-t border-white px-2 sm:px-3 py-1 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-[#21242e] uppercase overflow-x-auto whitespace-nowrap scrollbar-none">
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <a href="#" className="hover:underline">Parents</a>
              <span className="text-[#3d4f97]">|</span>
              <a href="#" className="hover:underline">Customer Service</a>
              <span className="text-[#3d4f97]">|</span>
              <a href="#" className="hover:underline">Gov Navigator</a>
              <span className="text-[#3d4f97]">|</span>
              <a href="#" className="hover:underline">Global</a>
              <span className="text-[#3d4f97]">|</span>
              <a href="#" className="hover:underline">Privacy</a>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-4">
              <a href="#" className="hover:underline text-[#e60012]">Store</a>
              <span className="text-[#3d4f97]">|</span>
              <a href="#" className="hover:underline">Contact</a>
            </div>
          </div>
        </div>

        {/* MOBILE EXTRA RAIL CHIPS (Shown only on small screens) */}
        <div className="flex md:hidden items-center justify-between gap-1 overflow-x-auto bg-[#3d4f97] p-1 border border-[#21242e]">
          <span className="text-white text-[10px] font-bold uppercase tracking-wider px-1 shrink-0">
            TABS:
          </span>
          <div className="flex items-center gap-1 text-[10px] font-bold shrink-0">
            <span className="bg-[#21242e] text-white px-2 py-0.5 rounded-xs border border-[#9fbee7]">TOP TEN</span>
            <span className="bg-[#21242e] text-[#9fbee7] px-2 py-0.5 rounded-xs border border-[#9fbee7]">RENTALS</span>
            <span className="bg-[#21242e] text-[#ecab37] px-2 py-0.5 rounded-xs border border-[#9fbee7]">CHOICE</span>
            <span className="bg-[#21242e] text-[#9fbee7] px-2 py-0.5 rounded-xs border border-[#9fbee7]">ESRB</span>
          </div>
        </div>

        {/* 3. MAIN BODY SECTION WITH ROTATED LEFT RAIL */}
        <div className="flex gap-2">
          
          {/* Left Rail (Rotated Carbon Tabs - Desktop Only) */}
          <div className="hidden md:flex flex-col gap-1 w-7 items-center pt-2 shrink-0">
            <div className="carbon-halftone border border-[#3d4f97] text-white text-[10px] font-bold py-3 px-1 uppercase tracking-widest writing-vertical rotate-180 text-center rounded-xs shadow-xs cursor-pointer hover:bg-[#3d4f97]">
              TOP TEN
            </div>
            <div className="carbon-halftone border border-[#3d4f97] text-[#9fbee7] text-[10px] font-bold py-3 px-1 uppercase tracking-widest writing-vertical rotate-180 text-center rounded-xs shadow-xs cursor-pointer hover:bg-[#3d4f97]">
              RENTALS
            </div>
            <div className="carbon-halftone border border-[#3d4f97] text-[#ecab37] text-[10px] font-bold py-3 px-1 uppercase tracking-widest writing-vertical rotate-180 text-center rounded-xs shadow-xs cursor-pointer hover:bg-[#3d4f97]">
              CHOICE
            </div>
            <div className="carbon-halftone border border-[#3d4f97] text-[#9fbee7] text-[10px] font-bold py-3 px-1 uppercase tracking-widest writing-vertical rotate-180 text-center rounded-xs shadow-xs cursor-pointer hover:bg-[#3d4f97]">
              ESRB
            </div>
          </div>

          {/* Main Content & Right Rail Split */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            
            {/* HERO PANEL (Photographic Field with Box-Art Type) */}
            <div id="hero" className="relative bevel-plate chamfer-card bg-[#206479] circuit-overlay p-4 sm:p-6 text-white flex flex-col justify-between min-h-[180px] sm:min-h-[200px] shadow-md overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-full bg-linear-to-l from-[#38BDF8]/20 to-transparent pointer-events-none" />
              
              {/* Top Tagline */}
              <div className="flex items-center justify-between z-10 gap-2">
                <span className="bg-[#ecab37] text-[#21242e] font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded-xs uppercase tracking-wider border border-[#21242e] shrink-0">
                  FEATURED HARDWARE &amp; PERSONA
                </span>
                <span className="text-[10px] sm:text-xs font-bold tracking-wider text-[#9fbee7] shrink-0">
                  MODEL NOH-2026
                </span>
              </div>

              {/* Box-Art Hero Wordmark */}
              <div className="my-2 sm:my-3 z-10">
                <h2 className="box-art-text text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight sm:leading-none break-words">
                  NOH GI HUN: NAVIGATOR &amp; DEV
                </h2>
                <p className="text-xs sm:text-sm font-bold text-[#c0d5e6] mt-2 drop-shadow-sm max-w-lg leading-snug">
                  Gorgeous graphics, great sound, and safe maritime navigation! 
                  Sailing government vessels by day, building Next.js web applications by night.
                </p>
              </div>

              {/* Bottom Action Strip */}
              <div className="flex items-center justify-between z-10 pt-2 border-t border-white/20 gap-2">
                <span className="text-[10px] sm:text-xs font-bold text-[#9fbee7] truncate">
                  PLAY IT ON: NEXT.JS 16 &amp; NINTENDO Y2K UI
                </span>
                <button className="bevel-button-orange rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-black text-xs sm:text-sm shadow-md cursor-pointer shrink-0 hover:scale-105 transition-transform">
                  ▶
                </button>
              </div>
            </div>

            {/* TWO-COLUMN GRID (Content 2/3 + Right Action Rail 1/3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              
              {/* TWO-THIRDS CONTENT COLUMN */}
              <div className="md:col-span-2 flex flex-col gap-2 min-w-0">
                
                {/* MODULE 1: OFFICIAL NEWS */}
                <div id="news" className="bevel-plate bg-[#7a8aba] p-1.5 flex flex-col gap-1.5">
                  <div className="bg-[#3d4f97] text-white px-2 py-1 text-xs font-bold uppercase tracking-wider flex items-center justify-between border-b border-[#21242e]">
                    <span className="flex items-center gap-1">
                      <span className="text-[#ecab37]">≡</span> OFFICIAL NEWS &amp; LOGS
                    </span>
                    <span className="text-[10px] text-[#9fbee7]">UPDATED DAILY</span>
                  </div>

                  {/* News Platinum Inset Rows */}
                  <div className="flex flex-col gap-1">
                    {newsItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="bevel-inset bg-[#dedede] p-2 flex items-center justify-between gap-2 hover:bg-white transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 overflow-hidden min-w-0">
                          <span className="bg-[#3d4f97] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs shrink-0">
                            {item.cat}
                          </span>
                          <span className="text-xs font-bold text-[#21242e] truncate group-hover:text-[#e60012]">
                            {item.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-bold text-[#60619c]">
                            {item.date}
                          </span>
                          <div className="w-4 h-4 bevel-button-orange rounded-xs flex items-center justify-center text-[9px] font-black">
                            ▶
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* MODULE 2: FEATURED SITES 2x2 GRID */}
                <div id="featured" className="bevel-plate bg-[#7a8aba] p-1.5 flex flex-col gap-1.5">
                  <div className="bg-[#3d4f97] text-white px-2 py-1 text-xs font-bold uppercase tracking-wider flex items-center justify-between border-b border-[#21242e]">
                    <span className="flex items-center gap-1">
                      <span className="text-[#ecab37]">≡</span> FEATURED SITES &amp; LINKS
                    </span>
                    <span className="text-[10px] text-[#9fbee7]">4 STATIONS</span>
                  </div>

                  {/* 2x2 Grid (1col on mobile, 2col on sm+) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {featuredSites.map((site, idx) => (
                      <a
                        key={idx}
                        href={site.url}
                        target={site.url.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="carbon-halftone border-2 border-[#21242e] p-2.5 rounded-xs flex flex-col justify-between hover:border-[#ecab37] transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`${site.bg} text-white font-black text-[9px] px-1.5 py-0.5 rounded-xs uppercase tracking-wider`}>
                            {site.label}
                          </span>
                          <span className="text-[#f68d1f] font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                            ➔
                          </span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white group-hover:text-[#ecab37] transition-colors">
                            {site.name}
                          </div>
                          <div className="text-[10px] font-bold text-[#9fbee7] truncate mt-0.5">
                            {site.caption}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* MODULE 3: PLAYER'S POLL */}
                <div id="poll" className="bevel-plate-raised bg-[#8ba1d4] p-3 flex flex-col gap-2 rounded-xs">
                  <div className="flex items-center justify-between border-b border-[#3d4f97] pb-1">
                    <span className="text-xs font-bold text-[#21242e] uppercase tracking-wider flex items-center gap-1">
                      <span className="text-[#e60012]">●</span> PLAYER'S POLL #2026
                    </span>
                    <span className="bg-[#ecab37] text-[#21242e] text-[9px] font-bold px-1.5 py-0.5 rounded-xs">
                      WEEKLY VOTE
                    </span>
                  </div>

                  <p className="text-xs font-bold text-[#21242e]">
                    Q: Which aspect of Governor Noh's profile is most impressive?
                  </p>

                  <div className="flex flex-col gap-1.5 text-xs font-bold text-[#21242e] my-1">
                    {[
                      { id: "A", text: "A. Government Vessel Navigation ⚓" },
                      { id: "B", text: "B. Vibe Coding & Next.js Stack 💻" },
                      { id: "C", text: "C. Nintendo 2001 Console Hardware Aesthetics 🎮" },
                    ].map((opt) => (
                      <label
                        key={opt.id}
                        onClick={() => setSelectedPoll(opt.id)}
                        className={`flex items-center gap-2 p-1.5 rounded-xs border cursor-pointer transition-colors ${
                          selectedPoll === opt.id
                            ? "bg-white border-[#3d4f97] text-[#e60012]"
                            : "bg-[#7a8aba]/30 border-transparent hover:bg-white/50"
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full border border-[#21242e] flex items-center justify-center shrink-0 ${
                            selectedPoll === opt.id ? "bg-[#e60012]" : "bg-white"
                          }`}
                        >
                          {selectedPoll === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="leading-tight">{opt.text}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1 gap-2">
                    <span className="text-[10px] font-bold text-[#3d4f97] truncate">
                      Total Votes: 1,997–2001
                    </span>
                    <button className="bevel-button-orange px-3 py-1 font-bold text-xs uppercase cursor-pointer shrink-0">
                      SUBMIT VOTE
                    </button>
                  </div>
                </div>

              </div>

              {/* ONE-THIRD RIGHT ACTION RAIL */}
              <div className="flex flex-col gap-2 min-w-0">
                
                {/* CARBON ACTION BUTTONS */}
                <div className="grid grid-cols-2 md:grid-cols-1 gap-1">
                  {["LOGIN / REGISTER", "SUBSCRIBE NEWSLETTER", "HELP & SUPPORT", "SYSTEM SPEC"].map(
                    (btn, idx) => (
                      <button
                        key={idx}
                        className="carbon-halftone border-2 border-[#21242e] text-white p-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-between hover:bg-[#3d4f97] hover:border-[#ecab37] transition-colors shadow-xs cursor-pointer truncate"
                      >
                        <span className="truncate">{btn}</span>
                        <span className="text-[#ecab37] shrink-0 ml-1">▶</span>
                      </button>
                    )
                  )}
                </div>

                {/* INFO BOX CARD */}
                <div className="bevel-plate bg-white p-2.5 flex flex-col gap-1.5 rounded-xs">
                  <div className="bg-[#ecab37] text-[#21242e] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-[#21242e]">
                    WHAT IS — LINK FINDER
                  </div>
                  <p className="text-[11px] font-bold text-[#21242e] leading-snug">
                    MyLink is Governor Noh's central command station for accessing code repositories, maritime logs, and tech publications in one place.
                  </p>
                </div>

                {/* PROMO CARD (Game Boy Advance / GameCube Style) */}
                <div className="bevel-plate bg-[#acace7] p-3 flex flex-col items-center text-center gap-2 rounded-xs border-2 border-[#3d4f97]">
                  <span className="bg-[#e60012] text-white font-black text-[9px] px-2 py-0.5 rounded-xs uppercase tracking-widest">
                    SYSTEM PROMO
                  </span>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#206479] border-2 border-[#21242e] rounded-xs flex items-center justify-center text-2xl sm:text-3xl text-white shadow-sm">
                    🎮
                  </div>
                  <div className="text-xs font-extrabold text-[#21242e] uppercase leading-tight">
                    NINTENDO 2001 METALLIC EDITION
                  </div>
                  <button className="bevel-button-amber w-full py-1 text-xs font-bold uppercase cursor-pointer">
                    EXPLORE HARDWARE
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* 4. FOOTER & ESRB RATING BAR */}
        <div className="carbon-halftone border-2 border-[#21242e] p-3 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          {/* Copyright & Fine Print */}
          <div className="text-[10px] text-[#9fbee7] font-bold leading-tight text-center sm:text-left">
            <div>©1997–2001 NINTENDO. / NOH GI HUN · MYLINK ALL RIGHTS RESERVED.</div>
            <div className="text-[#60619c] mt-0.5">
              TRADEMARKS ARE PROPERTY OF THEIR RESPECTIVE OWNERS.
            </div>
          </div>

          {/* ESRB Privacy Certified & Rating Badges */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Rating E Square */}
            <div className="w-7 h-7 bg-white border border-black flex items-center justify-center text-black font-black text-sm">
              E
            </div>
            {/* ESRB Amber Badge */}
            <div className="bevel-button-amber px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#21242e] border border-[#21242e]">
              ESRB — PRIVACY CERTIFIED
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
