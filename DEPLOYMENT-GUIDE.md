# Axia — Complete Vercel Deployment Guide

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Unzip & Install](#2-unzip--install)
3. [Delete Old Vercel Deployment](#3-delete-old-vercel-deployment)
4. [Delete Old Convex Project (Optional)](#4-delete-old-convex-project-optional)
5. [Set Up Convex Backend](#5-set-up-convex-backend)
6. [Deploy to Vercel](#6-deploy-to-vercel)
7. [Connect Custom Domain](#7-connect-custom-domain)
8. [Verify Everything Works](#8-verify-everything-works)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Prerequisites

Before you start, make sure you have these accounts and tools:

- **Node.js 20+** installed on your machine — [Download here](https://nodejs.org/)
- **A Vercel account** — [Sign up at vercel.com](https://vercel.com) (free tier works)
- **A Convex account** — [Sign up at convex.dev](https://www.convex.dev/) (free tier works)
- **Git** installed — [Download here](https://git-scm.com/)
- **A GitHub account** — [Sign up at github.com](https://github.com)

Verify Node.js is installed:
```bash
node --version   # Should show v20.x or higher
npm --version    # Should show 10.x or higher
```

---

## 2. Unzip & Install

### Step 2.1: Unzip the project
```bash
# Move the zip to where you keep projects
cd ~/Projects   # or wherever you prefer

# Unzip
unzip axia-vite-complete.zip

# Enter the project directory
cd axia-vite
```

### Step 2.2: Install dependencies
```bash
npm install
```

### Step 2.3: Run locally to verify it works
```bash
npm run dev
```
Open **http://localhost:5173** — you should see the Axia landing page in demo mode (no backend connected yet).

Press **Ctrl+C** to stop the dev server.

---

## 3. Delete Old Vercel Deployment

If you have a previous Axia deployment on Vercel, you need to remove it first.

### Method A: Via Vercel Dashboard (Easiest)

1. Go to **https://vercel.com/dashboard**
2. Find your old Axia project in the list
3. Click on it to open the project
4. Go to **Settings** tab (top navigation)
5. Scroll down to the bottom — click **Delete Project**
6. Type the project name to confirm deletion
7. Click **Delete**

### Method B: Via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Log in to Vercel
vercel login

# List your projects
vercel list

# Remove the old project (replace "axia" with your actual project name)
vercel remove axia
```

**Important:** Deleting the Vercel project does NOT delete your GitHub repo or Convex backend. It only removes the deployment.

---

## 4. Delete Old Convex Project (Optional)

If you want a completely fresh Convex backend (new database, new URL), follow these steps. If you want to keep using the same Convex project, skip to Step 5.

### Step 4.1: Delete via Convex Dashboard

1. Go to **https://dashboard.convex.dev/**
2. Select your old Axia project
3. Click on the project name in the top-left corner
4. Go to **Settings** (gear icon)
5. Scroll to the bottom — click **Delete Project**
6. Type the project name to confirm
7. Click **Delete Project**

### Step 4.2: Why you might want to keep the old Convex project

- If you have existing waitlist signups you want to preserve, **do NOT delete** the Convex project
- You can simply reuse the same Convex URL for the new Vercel deployment
- The database schema will be updated automatically when you run `npx convex deploy`

---

## 5. Set Up Convex Backend

### Step 5.1: Create a new Convex project (only if you deleted the old one)

1. Go to **https://dashboard.convex.dev/**
2. Click **"Create Project"**
3. Name it **"axia"** (or whatever you prefer)
4. Select the **Free** plan
5. Click **Create**

### Step 5.2: Link Convex to your local project

```bash
# Make sure you're in the axia-vite directory
cd ~/Projects/axia-vite

# Install Convex CLI (if not already installed)
npm install -g convex

# Log in to Convex (opens browser for authentication)
npx convex dev --once

# This will:
# 1. Ask you to select your Convex project
# 2. Generate the convex/_generated/ files
# 3. Create a .env.local file with VITE_CONVEX_URL
```

### Step 5.3: Verify the Convex URL was saved

```bash
# Check that .env.local exists and has your Convex URL
cat .env.local
```

You should see something like:
```
VITE_CONVEX_URL=https://your-project-name.convex.cloud
```

### Step 5.4: Deploy the Convex backend functions

```bash
# Deploy your backend functions to Convex
npx convex deploy
```

You should see output like:
```
✔ Deployed to https://your-project-name.convex.cloud
```

### Step 5.5: Set the admin key (for the admin API)

```bash
# Set a secret admin key for accessing the admin API
npx convex env set ADMIN_KEY "your-secret-admin-key-here"
```

Replace `"your-secret-admin-key-here"` with a strong random string. You can generate one:
```bash
openssl rand -hex 32
```

### Step 5.6: Verify the backend works

```bash
# Run the dev server with Convex connected
npm run dev
```

Open **http://localhost:5173**, enter an email, and click "Secure Founding Access". You should see a success toast with a referral code (not "demo mode"). Check your Convex dashboard → Data tab to see the entry was stored.

Press **Ctrl+C** to stop the dev server.

---

## 6. Deploy to Vercel

### Step 6.1: Push to GitHub

```bash
# Initialize git (if not already done)
cd ~/Projects/axia-vite
git init

# Add all files (node_modules and dist are excluded via .gitignore)
git add .

# Commit
git commit -m "Axia landing page — production ready"

# Create a GitHub repo at https://github.com/new (name it "axia-vite")
# Then push:
git remote add origin https://github.com/YOUR-USERNAME/axia-vite.git
git branch -M main
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual GitHub username.

### Step 6.2: Import to Vercel

1. Go to **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Find your **axia-vite** repo and click **Import**

### Step 6.3: Configure the Vercel project

On the "Configure Project" screen:

**Framework Preset:**
- Select **Vite** (Vercel should auto-detect this)

**Build and Output Settings:**
- **Build Command:** `npm run build` (should be auto-detected)
- **Output Directory:** `dist` (should be auto-detected)
- **Install Command:** `npm install` (should be auto-detected)

**Root Directory:**
- Leave as `.` (default) — since the project is at the root of the repo

### Step 6.4: Add the Convex environment variable

This is the **most critical step** — without this, the app runs in demo mode.

1. Expand the **"Environment Variables"** section
2. Add a new variable:
   - **Name:** `VITE_CONVEX_URL`
   - **Value:** Your Convex URL (from `.env.local` — e.g., `https://your-project-name.convex.cloud`)
   - **Environments:** Check all three (Production, Preview, Development)

3. Click **Add**

### Step 6.5: Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for the build to complete
3. You should see a "Congratulations!" screen with your live URL

Your site is now live at something like: `https://axia-vite-xyz123.vercel.app`

---

## 7. Connect Custom Domain (Optional)

If you own a domain like `axia.io` or `getaxia.com`:

### Step 7.1: Add domain in Vercel

1. Go to your project in the Vercel dashboard
2. Click **Settings** → **Domains**
3. Enter your domain (e.g., `axia.io`)
4. Click **Add**

### Step 7.2: Configure DNS at your domain registrar

Vercel will show you DNS records to add. Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add:

**For root domain (axia.io):**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21`

**For www subdomain (www.axia.io):**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

### Step 7.3: Wait for DNS propagation

DNS changes can take up to 48 hours (usually 5-10 minutes with Cloudflare).

---

## 8. Verify Everything Works

### Step 8.1: Test the live site

1. Visit your Vercel URL (or custom domain)
2. **Dark mode** should be the default — verify it looks correct
3. Click the **sun/moon toggle** — verify light mode works with proper contrast
4. **Sign up with an email** — you should get a referral popup with a code
5. **Copy the referral link** and open it in an incognito window — it should say "You were referred — skip the line!"
6. **Sign up again** — verify the referral was counted

### Step 8.2: Verify the Convex backend

1. Go to **https://dashboard.convex.dev/**
2. Select your Axia project
3. Click **Data** tab — you should see waitlist entries
4. Click **Functions** tab — you should see `waitlist:getCount`, `waitlist:join`, etc.
5. Click **Logs** tab — check for any errors

### Step 8.3: Test on mobile

1. Open the site on your phone
2. Verify the layout stacks properly (1-column on mobile)
3. Test the signup form
4. Test the theme toggle
5. Scroll through all sections — nothing should overflow or break

### Step 8.4: Test the admin API (optional)

```bash
# Get all waitlist entries (replace with your admin key and Convex URL)
curl "https://your-project-name.convex.cloud/api/query" \
  -H "Content-Type: application/json" \
  -d '{"path": "waitlist:getAll", "args": {"adminKey": "your-secret-admin-key-here"}}'
```

---

## 9. Troubleshooting

### Problem: Site shows "Demo Mode" on Vercel

**Cause:** The `VITE_CONVEX_URL` environment variable is missing or incorrect.

**Fix:**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `VITE_CONVEX_URL` exists and has the correct value
3. Make sure there are no extra spaces or quotes around the URL
4. **Redeploy:** Go to Deployments tab → click the three dots on the latest deployment → **Redeploy**

### Problem: Build fails on Vercel

**Cause:** Usually a TypeScript error or missing dependency.

**Fix:**
1. Check the build logs in Vercel Dashboard → Deployments → Failed deployment
2. Fix any TypeScript errors locally: `npm run build`
3. Push the fix to GitHub — Vercel will auto-redeploy

### Problem: "convex/_generated/api" module not found

**Cause:** The Convex generated files are missing or stale.

**Fix:**
```bash
# Regenerate Convex files
npx convex dev --once
git add convex/_generated/
git commit -m "Regenerate Convex API files"
git push
```

### Problem: Site works but signups don't save

**Cause:** Convex URL is correct but the backend functions haven't been deployed.

**Fix:**
```bash
npx convex deploy
```

### Problem: Old Vercel domain still shows the old site

**Cause:** DNS cache or the old project wasn't fully deleted.

**Fix:**
1. Clear your browser cache (Ctrl+Shift+R)
2. Try in an incognito window
3. Verify the old project is deleted in Vercel Dashboard

### Problem: "500 Internal Server Error" from Convex

**Cause:** The Convex schema might not be deployed.

**Fix:**
```bash
npx convex deploy
```

Then check the Convex dashboard → Logs for specific errors.

### Problem: Light mode text is hard to read (camouflaged)

**Cause:** Some text elements might not have proper light mode contrast.

**Fix:**
1. Open browser DevTools (F12)
2. Switch to light mode using the toggle
3. Inspect any hard-to-read text elements
4. They should use `text-[#1a1a1c]` or `text-[#1a1a1c]/70` for light mode
5. If you find issues, fix in App.tsx and push to GitHub

---

## Quick Reference: File Structure

```
axia-vite/
├── convex/                    # Convex backend functions
│   ├── _generated/           # Auto-generated by Convex (do not edit)
│   ├── schema.ts             # Database schema (waitlist table)
│   └── waitlist.ts           # Backend functions (join, getCount, etc.)
├── public/                    # Static assets
│   └── favicon.svg           # Axia favicon
├── src/
│   ├── App.tsx               # ENTIRE landing page (all sections)
│   ├── LogoLoop.tsx          # Carousel component (adapted from React Bits)
│   ├── LogoLoop.css          # Carousel styles
│   ├── index.css             # Tailwind v4 + theme CSS variables
│   └── main.tsx              # Entry point (Convex provider, demo mode logic)
├── .env.local                # Your Convex URL (created by npx convex dev)
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite + React + Tailwind v4 plugins
└── tsconfig.json             # TypeScript config
```

## Quick Reference: Key Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start local dev server (port 5173) |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npx convex dev` | Run Convex dev mode (syncs backend) |
| `npx convex deploy` | Deploy backend functions to production |
| `npx convex env set KEY "value"` | Set a Convex environment variable |

## Quick Reference: Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_CONVEX_URL` | Vercel + .env.local | Your Convex deployment URL |
| `ADMIN_KEY` | Convex env | Secret key for admin API access |
