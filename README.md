# 📊 AnalytixAI

### AI-Powered Business Intelligence & Decision Intelligence Platform

AnalytixAI transforms raw business data into meaningful business decisions. Instead of showing only dashboards and charts, it explains **what happened, why it happened, what is likely to happen next, and what actions should be taken** using statistically validated analytics combined with AI-generated insights.

---

## 🚀 The Problem

Small and medium-sized businesses generate data across sales, expenses, inventory, cash flow, and customer operations every day. While traditional BI dashboards visualize this information, they rarely explain **why changes occurred** or **what actions should be taken**.

As a result, business owners often identify issues only after they have already impacted revenue or operations.

---

## 💡 Our Solution

AnalytixAI combines **Business Intelligence**, **Statistical Analytics**, and **Artificial Intelligence** into a single platform that helps business owners:

- Understand business performance instantly
- Detect anomalies automatically
- Forecast future revenue
- Identify root causes of business problems
- Receive AI-generated executive summaries
- Make data-driven decisions confidently

Unlike conventional BI dashboards, AnalytixAI focuses on **Decision Intelligence**, not just visualization.

---

# ✨ Key Features

## 📈 Smart Dashboard

- AI Executive Summary
- KPI Dashboard
- Revenue Trends
- Profit Margin Analysis
- Expense Breakdown
- Business Health Score
- Revenue Forecasting
- Interactive Charts

---

## 🤖 AI Insights

- AI Business Copilot
- Root Cause Analysis
- AI Recommendations
- Natural Language Business Queries

---

## 📊 Statistical Analytics

Every insight is backed by mathematical models rather than AI-generated assumptions.

Implemented models include:

- Linear Regression Forecasting
- Business Health Score (weighted composite: Financial 40% / Customer 25% / Operational 20% / Growth 15%)
- Z-Score Anomaly Detection
- Variance Contribution Analysis
- Revenue Growth Analysis
- Profit Margin Calculations

AI (OpenAI) is used strictly to **narrate** these pre-calculated results in plain language — it does not generate or estimate the underlying numbers.

---

## 🧠 AI Lab (21+ Business Tools)

> **Status note:** Tools below are grouped by what's actually functional today vs. what's planned. This section will be updated as more tools are built out — see it as a transparent roadmap, not a finished feature list.

### ✅ Fully Built

- Sales Analytics
- Profitability Analyzer
- Expense Analyzer
- KPI Dashboard
- Forecasting
- AI Assistant
- AI Insights
- Root Cause Analysis

### 🚧 In Progress / Planned

- Scenario Simulator
- Trend Detection
- Decision Engine
- Inventory Optimizer
- Cost Optimizer
- Cash Flow Monitor
- Supply Chain Monitor
- Goal Tracker
- Compliance Checker
- Customer Intelligence
- Competitor Intelligence
- Market Intelligence
- Invoice Intelligence
- Report Generator

*(Adjust these two lists to match your actual repo state before submitting — this is a placeholder split based on what's been confirmed built vs. discussed as future work.)*

---

# 📂 Workflow

```text
CSV / Excel Upload
        │
        ▼
Data Validation
        │
        ▼
Business Calculations
        │
        ▼
Forecasting
Health Score
Anomaly Detection
Root Cause Analysis
        │
        ▼
OpenAI (narrative layer only)
        │
        ▼
Executive Summary
Recommendations
Business Copilot
        │
        ▼
Interactive Dashboard
```

---

# 📸 Project Screenshots

## Dashboard

`docs/screenshots/dashboard.png`

*(Replace with an actual screenshot before submitting — add the image to your repo and update this path.)*

---

## AI Copilot

`docs/screenshots/ai-copilot.png`

---

## AI Lab

`docs/screenshots/ai-lab.png`

---

## Data Validator

`docs/screenshots/data-validator.png`

---

# 🛠 Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Material UI

### Backend

- Supabase

### Authentication

- Firebase

### AI

- OpenAI API

### Automation

- n8n

### Charts

- Recharts

### File Processing

- PapaParse
- SheetJS (xlsx)

---

# ⚙️ Getting Started

## Prerequisites

- Node.js 18 or higher
- npm 9+ (or yarn/pnpm equivalent)
- A Supabase project
- A Firebase project with Authentication enabled
- An OpenAI API key
- *(Optional, for automated alerts)* An n8n instance, plus Twilio and SMTP/Resend credentials

## Clone Repository

```bash
git clone https://github.com/YOUR-GITHUB-USERNAME/analytixai.git

cd analytixai

npm install
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_OPENAI_API_KEY=your_openai_api_key
```

---

## Run

```bash
npm run dev
```

---

## Build

```bash
npm run build
```

---

# 🎯 Why AnalytixAI Stands Out

Unlike traditional BI tools, AnalytixAI combines:

- 📊 Business Intelligence
- 🤖 AI-powered Executive Summaries
- 📈 Statistical Forecasting
- 🔍 Root Cause Analysis
- 🚨 Automated Anomaly Detection
- 💡 Actionable Recommendations
- 💬 Conversational Business Copilot

to help businesses move from **data visualization** to **decision intelligence**.

---

# 🚀 Future Scope

- Multi-user workspaces
- ERP integrations
- Google Sheets sync
- Scheduled reports
- Machine Learning forecasting
- Custom KPI builder
- Role-based access control
- Industry benchmarking

---

# 👥 Team

**Team Name:** _PN SQUARE_

**Hackathon:** _NIAT Takeover Hackathon_

**Members:** _Sanaga Nithya, Naga Sai Purujith Kondur, Naeem Ahmad_


