# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.5.0 mobile application called "vigilance-mobile" built with React 19, TypeScript, and TailwindCSS. The project uses Turbopack for development and production builds.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application with Turbopack  
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Architecture

### Core Structure
- **App Router**: Uses Next.js App Router pattern with `app/` directory
- **Layout**: Single root layout in `app/layout.tsx` with Geist fonts
- **Styling**: TailwindCSS 4.x with PostCSS configuration
- **TypeScript**: Strict configuration with path aliasing (`@/*` maps to root)

### Key Files
- `app/layout.tsx` - Root layout with font loading and metadata
- `app/page.tsx` - Homepage component
- `app/globals.css` - Global styles
- `next.config.ts` - Next.js configuration (minimal)
- `tsconfig.json` - TypeScript configuration with strict mode

### ESLint Configuration
Uses flat config format with Next.js and TypeScript presets. Ignores build directories and generated files.

## Technology Stack

- **Framework**: Next.js 15.5.0 with App Router
- **UI**: React 19.1.0
- **Styling**: TailwindCSS 4.x with PostCSS
- **Build Tool**: Turbopack
- **Language**: TypeScript 5.x with strict mode
- **Linting**: ESLint 9.x with Next.js presets
- **Fonts**: Geist Sans and Geist Mono via next/font/google

## Digital Props Goals (Film/TV)

- Produce believable **fake UIs** for movie productions. 
- **Offline + deterministic** playback for shoot day (no network, no time drift).
- **Zero-friction handoff**: single URL (Netlify) and local fallback.

## Context

`context/*` is read-only. Do not modify. 
- In this folder there will be files with describing names that you can use to get more context about the manuscript i.e. understand the scenes better so you can create better UI's. There will also be pure design inspiration there.


## UI Components
Rules:
- Use Tailwind tokens (no inline styles). Keep variants minimal.
- Ensure contrast and font size are readable on a monitor/camera.

## Offline Requirements

- Assume **airplane mode**.
- No env secrets needed for playback.
- Use static flags in `lib/scheduling/flags.ts` for feature gating.


## Delivery

- Preferred: Netlify deploy for remote review.
- Local fallback: static export (`out/`) or standalone (`.next/standalone`) + `public/`.
- Goal: team should click once and play.

## Do Not Touch

- Do not edit `context/*` sources or original `public/media/*` assets.
- Do not change Tailwind tokens without explicit instruction.
- Do not introduce runtime network dependencies for scene playback.
