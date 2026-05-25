# Google Search Console Setup Guide — Shrinkix.com
**Date:** 2026-05-25  
**Status:** Code-side changes complete. Requires account actions in Google Search Console.

---

## What Is Google Search Console?

Google Search Console (GSC) is Google's free tool for monitoring how your site performs in Google Search. It shows:
- Which queries bring users to your site (and your average position)
- Which pages Google has indexed
- Core Web Vitals scores from real users (CrUX data)
- Manual actions or security issues Google has found
- Crawl errors and indexing problems

**URL:** https://search.google.com/search-console

---

## Step 1: Verify Ownership

You must prove to Google that you own shrinkix.com. The recommended method is the HTML meta tag.

### How to Add the Verification Tag

1. Go to **Google Search Console** → Add property → Enter `https://shrinkix.com`
2. Choose **"HTML tag"** verification method
3. Copy the meta tag — it looks like:
   ```html
   <meta name="google-site-verification" content="abc123XYZ..." />
   ```
4. Open `client/index.html` and uncomment + fill in this line:
   ```html
   <!-- Currently in index.html: -->
   <!-- <meta name="google-site-verification" content="REPLACE_WITH_YOUR_VERIFICATION_TOKEN" /> -->

   <!-- Replace with: -->
   <meta name="google-site-verification" content="YOUR_ACTUAL_TOKEN_HERE" />
   ```
5. Deploy the change to production
6. Return to Search Console and click **"Verify"**

### Alternative: DNS TXT Record Verification (No code change needed)

If you manage the DNS for shrinkix.com:
1. Search Console → "DNS record" verification method
2. Copy the TXT record value
3. Add a TXT record to your domain DNS:
   - **Name:** `@` (or `shrinkix.com`)
   - **Type:** TXT
   - **Value:** `google-site-verification=...`
4. Wait 10–60 minutes for DNS propagation, then verify

---

## Step 2: Add Both HTTP and HTTPS Properties

Google Search Console treats `http://` and `https://` as separate properties. Add both to be safe, then set `https://shrinkix.com` as your primary.

Also add:
- `https://shrinkix.com` (with trailing domain)
- `https://www.shrinkix.com` (if applicable)

Use **Domain property** (enter just `shrinkix.com` without protocol) to cover all variants in one property — requires DNS verification.

---

## Step 3: Submit the Sitemap

The sitemap is already created at `client/public/sitemap.xml`. After deployment it will be live at `https://shrinkix.com/sitemap.xml`.

To submit:
1. Search Console → **Sitemaps** (left sidebar)
2. Enter: `sitemap.xml`
3. Click **Submit**

GSC will show how many URLs it found and how many were indexed.

**Sitemap contents (9 URLs):**
```
https://shrinkix.com/
https://shrinkix.com/pricing
https://shrinkix.com/developers
https://shrinkix.com/developers/pricing
https://shrinkix.com/developers/how-it-works
https://shrinkix.com/api-docs
https://shrinkix.com/about
https://shrinkix.com/privacy
https://shrinkix.com/signup
```

---

## Step 4: Verify robots.txt Is Working

The robots.txt is at `client/public/robots.txt` and will be live at `https://shrinkix.com/robots.txt`.

In Search Console:
1. Go to **Settings** → **robots.txt**
2. GSC will show the parsed robots.txt and flag any syntax errors

Current `robots.txt` configuration:
```
User-agent: *
Allow: /

Disallow: /admin
Disallow: /dashboard
Disallow: /checkout
Disallow: /buy-credits
Disallow: /auth
Disallow: /verify

Sitemap: https://shrinkix.com/sitemap.xml
```

---

## Step 5: Request Indexing for Key Pages

After verification, use the **URL Inspection Tool** to request indexing for your most important pages:

1. Search Console → URL Inspection → paste URL → **Request Indexing**

Priority order:
1. `https://shrinkix.com/` (homepage)
2. `https://shrinkix.com/pricing`
3. `https://shrinkix.com/developers`
4. `https://shrinkix.com/api-docs`

Google will crawl these within hours to days.

---

## Step 6: Connect Google Analytics 4

Link Search Console to Google Analytics 4 to see search data alongside user behavior:

1. In Search Console → **Settings** → **Associations**
2. Click **Associate** → select your GA4 property
3. In GA4 → **Admin** → **Product Links** → **Search Console Links**

This unlocks the "Queries" dimension in GA4 and lets you see which search queries lead to conversions.

---

## Step 7: Monitor the Core Web Vitals Report

Search Console's **Core Web Vitals** report shows real-user data (CrUX — Chrome User Experience Report):

1. Search Console → **Core Web Vitals** (left sidebar)
2. View separate reports for Mobile and Desktop
3. URLs are grouped as "Good", "Needs Improvement", or "Poor"

The `web-vitals` JS library we added to Shrinkix sends data to Google Analytics. To see it in GSC, you need at least ~100 real users visiting in a 28-day window (CrUX threshold).

**How to read the report:**
- **Good:** All three metrics pass (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- **Needs Improvement:** At least one metric in the yellow range
- **Poor:** At least one metric in the red range

Click any URL group to see which specific metric is failing.

---

## Step 8: Monitor Search Performance

The **Performance** report is the most valuable report in GSC:

1. Search Console → **Performance** → **Search results**
2. Filter by:
   - **Queries** — what people searched to find you
   - **Pages** — which pages are getting impressions
   - **Devices** — mobile vs. desktop performance
   - **Countries** — where your traffic comes from

### Key Metrics to Track Weekly

| Metric | What It Means | Target |
|--------|--------------|--------|
| Total Clicks | Actual visits from Google | Growing month-over-month |
| Total Impressions | How often you appear in results | Growing |
| Average CTR | % of impressions that become clicks | > 3% (text) |
| Average Position | Your typical rank | Improving (lower number) |

### Queries to Watch

After adding title tags and meta descriptions, watch for these queries to appear:
- `shrinkix` (branded — should be #1 immediately)
- `compress images online` (competitive — 6–12 months to rank)
- `image compression api` (lower competition — 3–6 months)
- `compress png online free` (medium competition)
- `webp converter` (medium competition)

---

## Step 9: Set Up Email Alerts

1. Search Console → **Settings** → **Notifications**
2. Enable email alerts for:
   - Manual actions (Google penalty)
   - Security issues (hacking, malware)
   - Coverage errors (indexing problems)

---

## Step 10: Submit to Bing Webmaster Tools

Don't forget Bing (which also powers DuckDuckGo and Yahoo):

1. Go to **https://www.bing.com/webmasters**
2. Add your site and verify (same HTML tag method)
3. Submit `https://shrinkix.com/sitemap.xml`
4. Bing can also import your verified GSC property automatically

---

## Search Console Monitoring Schedule

| Cadence | Task |
|---------|------|
| **Weekly** | Check Performance → Queries for new rankings and CTR drops |
| **Weekly** | Check Coverage → Errors for new indexing failures |
| **Monthly** | Check Core Web Vitals for regressions |
| **Monthly** | Check Manual Actions (should always be empty) |
| **After each deploy** | Use URL Inspection to request re-indexing of changed pages |
| **After schema changes** | Validate with Google Rich Results Test |

---

## Useful Search Console URLs

| Tool | URL |
|------|-----|
| Search Console Home | https://search.google.com/search-console |
| URL Inspection Tool | GSC → URL Inspection |
| Rich Results Test | https://search.google.com/test/rich-results |
| PageSpeed Insights | https://pagespeed.web.dev |
| Mobile-Friendly Test | https://search.google.com/test/mobile-friendly |
| Schema Markup Validator | https://validator.schema.org |
| Bing Webmaster Tools | https://www.bing.com/webmasters |

---

## Checklist Summary

- [ ] Create Google Search Console property for `https://shrinkix.com`
- [ ] Add verification meta tag in `index.html` (token from GSC)
- [ ] Deploy to production
- [ ] Verify ownership in GSC
- [ ] Submit `sitemap.xml`
- [ ] Verify `robots.txt` in GSC settings
- [ ] Request indexing for top 4 pages via URL Inspection
- [ ] Link GA4 to Search Console
- [ ] Set up email alerts for manual actions and security issues
- [ ] Submit to Bing Webmaster Tools
- [ ] Check Core Web Vitals report after 28 days of traffic

---

*This guide covers the one-time setup. After setup, the job becomes weekly monitoring using the schedule above.*
