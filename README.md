<div align="center">

# 🎯 ApplyIQ

### AI-Powered Job Application & Career Copilot

Track applications, generate tailored cover letters, score your resume against any job, and practice interviews — all powered by AI that actually learns from you.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Groq](https://img.shields.io/badge/AI-Groq%20%2F%20Llama-orange)](https://groq.com/)
[![License](https://img.shields.io/badge/license-MIT-green)]()

[🔗 **Live App**](https://apply-iq-frontend.vercel.app/) · [📦 Backend Repo](https://github.com/sokoo69/ApplyIQ-backend) · [🐛 Report Bug](#)

</div>

---

## 📖 Overview

**ApplyIQ** is a full-stack, AI-native job-search platform built on a simple premise: job hunting is repetitive, stressful, and mostly guesswork. ApplyIQ replaces the guesswork with structured tracking and genuinely useful AI — not gimmicky chatbots, but multi-step reasoning that actually improves as you use it.

This is the **frontend** repository — a Next.js 15 App Router client. See the [backend repo](https://github.com/sokoo69/ApplyIQ-backend) for the API, database, and AI service layer.

🔗 **Live App:** [https://apply-iq-frontend.vercel.app/](https://apply-iq-frontend.vercel.app/)

**Try it instantly:**

Email: test@test.com
Password: test1234

Or click **"Try Demo Account"** on the login page for a one-click auto-login.

---

## ✨ Features

| Category | What it does |
|---|---|
| 🗂️ **Application Pipeline** | Track jobs through Saved → Applied → Interview → Offer → Rejected, with full status history |
| 🔍 **Smart Job Board** | Search, filter (category + location), sort, and paginate through listings — 4 cards per row on desktop with skeleton loading states |
| ✍️ **AI Cover Letter Generator** | Generates tailored cover letters that reference your actual resume and the specific job — not generic templates. Adjustable tone and length, with regenerate + history |
| 🎯 **AI Match Score Engine** | 3-step agentic pipeline: extracts your skills → extracts job requirements → compares with context from your past feedback. The recommendation genuinely shifts based on jobs you've previously applied to or rejected |
| 💬 **AI Interview Coach** | Streaming chat assistant that remembers the full conversation, grounds every question in your resume + the target role, and suggests follow-up prompts as clickable chips |
| 🛡️ **Role-Based Access** | Separate Job Seeker and Admin experiences — Job Seekers track applications and use AI tools; Admins post/moderate jobs and view an audit log. Enforced both client-side and server-side |
| 📊 **Analytics Dashboard** | Visual breakdown of your pipeline (Recharts pie/bar charts), weekly application activity, and your most common skill gaps across every job you've analyzed |
| 🔐 **Secure Auth** | Email/password, Google OAuth, and one-click demo login — all via httpOnly JWT cookies, never localStorage |
| 📄 **Resume PDF Upload** | Upload a PDF resume and have the text auto-extracted into your profile, instead of manually typing it |

---

## 🧠 How the AI Actually Works

Unlike a single-prompt wrapper, the **Match Score Engine** runs a genuine 3-step agentic pipeline instead of one flat request:

Step 1 → Extract skills, experience level, and years of experience from your resume
Step 2 → Extract required and nice-to-have skills from the job description
Step 3 → Compare both structured outputs, factoring in a summary of your
past "applied" / "rejected" / "saved" signals on similar jobs
Every step is logged and viewable via **"See how this was calculated"** directly on the Match Score page — the reasoning is never a black box.

The **Interview Coach** sends the *entire* conversation history (not just the latest message) on every turn, so follow-up questions like "can you give an example?" are answered with real context — proof that the AI genuinely remembers the conversation, not just pattern-matching the last line.

---

## 🧱 Tech Stack

**Core**
- **Next.js 15** (App Router) + **TypeScript** — strict mode
- **Tailwind CSS** — custom design token system (3-color + neutral palette, consistent spacing/radius/shadow across every component)
- **TanStack Query** — all server-state fetching, caching, and mutation handling
- **Recharts** — dashboard visualizations (pie, bar charts)

**Talks to**
- Node.js + Express + TypeScript backend
- MongoDB (Atlas)
- **Groq** (Llama 3.3 70B / 3.1 8B) — LLM provider for all AI reasoning
- Better Auth (JWT + Google OAuth, httpOnly cookies)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- The [backend API](https://github.com/sokoo69/ApplyIQ-backend) running locally or deployed

---

## 🔐 Roles & Access

| Route | Guest | Job Seeker | Admin |
|---|---|---|---|
| `/jobs`, `/jobs/[id]` | ✅ view | ✅ view + save/apply | ✅ view + edit/delete |
| `/dashboard` | ❌ | ✅ | ❌ (own admin panel) |
| `/items/add`, `/items/manage` | ❌ | ✅ | ❌ |
| `/ai/cover-letter`, `/ai/match`, `/ai/interview-coach` | ❌ | ✅ | ❌ |
| `/admin/jobs`, `/admin/audit-log` | ❌ | ❌ | ✅ |

Every restriction above is enforced **server-side** via role middleware — not just hidden UI elements.

---

## 📄 Pages Overview

| Page | Access | Purpose |
|---|---|---|
| `/` | Public | Landing page — hero, features, stats, testimonials, blog preview, FAQ |
| `/jobs` | Public | Searchable, filterable, paginated job board |
| `/jobs/[id]` | Public | Full job details + related jobs |
| `/login`, `/register` | Public | Auth with validation, Google OAuth, demo login |
| `/about`, `/blog`, `/privacy` | Public | Editorial content |
| `/dashboard` | Job Seeker | Pipeline stats, charts, skill-gap insights |
| `/items/add` | Job Seeker | Manually track an external job application |
| `/items/manage` | Job Seeker | Manage tracked applications by status |
| `/ai/cover-letter` | Job Seeker | AI content generator |
| `/ai/match` | Job Seeker | AI match scoring + feedback |
| `/ai/interview-coach` | Job Seeker | Streaming AI chat with memory |
| `/profile` | Job Seeker | Resume text / PDF upload |
| `/admin/jobs` | Admin | Post, edit, delete job listings |
| `/admin/audit-log` | Admin | History of admin actions |

---

## 📌 Known Limitations

See [`docs/KNOWN_LIMITATIONS.md`](docs/KNOWN_LIMITATIONS.md) for an honest list of current edge cases and scope boundaries.

## 🏗️ Architecture Decisions

See [`docs/ARCHITECTURE_DECISIONS.md`](docs/ARCHITECTURE_DECISIONS.md) for the reasoning behind key technical choices.

---

## 📄 License

MIT

---

<div align="center">
Built with ☕ and a lot of debugging.
</div>
