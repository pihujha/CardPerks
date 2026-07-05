# CardPerks

Track and maximize your credit card benefits. See exactly what you haven't claimed this month, know which card to use for every spend category, and never leave money on the table.

**Live:** [cardperks on Vercel](https://card-perks-lime.vercel.app) · Built with React, Tailwind CSS v4, Neon Postgres, and Vercel Edge Functions.

---

## Features

- **Benefits Hub** — monthly, annual, one-time, and always-on benefits across all your cards, with a checkbox to mark each one claimed
- **Card Insights** — cards ranked by annual benefit value per spend category (travel, dining, shopping, entertainment, wellness, fuel, insurance), with collapsible benefit breakdowns
- **My Cards** — see annual credits vs. annual fee at a glance; click any card to browse all its benefits in a side drawer
- **Dark mode** — toggle in the Settings menu, persists across sessions and respects system preference on first visit
- **Mobile-friendly** — responsive nav with hamburger menu, scrollable tab bar
- **AI Import** — paste a bank's benefits page and Claude parses the benefits for you *(coming soon)*

## Supported Cards

### US Cards
| Card | Bank | Network |
|---|---|---|
| Chase Sapphire Preferred | Chase | Visa |
| Chase Sapphire Reserve | Chase | Visa |
| Amex Platinum | American Express | Amex |
| Amex Gold | American Express | Amex |
| Amex Blue Cash Everyday | American Express | Amex |
| Amex Blue Cash Preferred | American Express | Amex |
| Chase Freedom Unlimited | Chase | Visa |
| Chase Freedom Flex | Chase | Mastercard |
| Citi Double Cash | Citi | Mastercard |

### Indian Cards
| Card | Bank | Network |
|---|---|---|
| HDFC Infinia | HDFC Bank | Visa |
| HDFC Regalia | HDFC Bank | Visa |
| HDFC Millennia | HDFC Bank | Mastercard |
| HDFC Diners Club Black | HDFC Bank | Diners |
| Axis Atlas | Axis Bank | Visa |
| Flipkart Axis Bank | Axis Bank | Visa |
| SBI SimplyCLICK | SBI Card | Visa |
| ICICI Sapphiro | ICICI Bank | Visa |
| ICICI Amazon Pay | ICICI Bank | Visa |
| ICICI Coral | ICICI Bank | Visa |
| ICICI Rubyx | ICICI Bank | Mastercard |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS v4 |
| Routing | React Router v7 |
| Backend | Vercel Edge Functions (TypeScript) |
| Auth | Custom JWT (`jose`), HttpOnly cookies |
| Database | Neon serverless PostgreSQL |
| Deployment | Vercel |

## Project Structure

```
/
├── api/                   # Vercel edge functions
│   ├── auth/              # sign-in, sign-up, sign-out, me
│   ├── user-cards/        # DELETE /api/user-cards/:id
│   ├── user-cards.ts      # GET (list), POST (add)
│   ├── dashboard.ts       # benefits for the hub tabs
│   ├── insights.ts        # benefits ranked by category
│   ├── benefit-usage.ts   # mark/unmark a benefit claimed
│   └── cards.ts           # full card catalog
├── src/
│   ├── components/        # Nav, BenefitsDrawer, AddCardModal
│   ├── lib/               # auth context, apiFetch, network colors
│   └── pages/             # Dashboard, Cards, Insights, Landing, Import, SignIn, SignUp
└── supabase/migrations/   # numbered SQL migrations (001–009)
```

## Running Locally

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) database (free tier works)

### Setup

```bash
git clone https://github.com/yourusername/CardPerks
cd CardPerks
npm install
```

Create `.env.local`:
```env
DATABASE_URL=postgresql://...   # Neon connection string
JWT_SECRET=your-secret-here
```

Run migrations in order:
```bash
for f in supabase/migrations/*.sql; do
  psql "$DATABASE_URL" -f "$f"
done
```

Start the dev server with API routes:
```bash
npx vercel dev
```

## Database Schema

| Table | Purpose |
|---|---|
| `users` | email, hashed password, name |
| `cards` | card catalog — name, bank, network, tier, annual_fee |
| `benefits` | per-card benefits with category, frequency, value, proof URL |
| `user_cards` | which cards a user has added |
| `benefit_usage` | tracks when a benefit was claimed (period = `YYYY-MM` / `YYYY` / `lifetime`) |

**`benefit_frequency`** enum: `monthly`, `quarterly`, `annual`, `one-time`, `ongoing`

**`benefit_type`** enum: `credit`, `reward_rate`, `perk`, `insurance`

## Design Notes

- All API routes use the Vercel **edge runtime** — required because `jose` (JWT library) is ESM-only and incompatible with Node.js serverless runtime
- INR and USD cards are ranked separately in Insights — comparing raw numbers across currencies is meaningless
- Passive benefits like fuel surcharge waivers use `frequency = 'ongoing'` and live in their own "Always On" tab rather than cluttering the monthly view

## License

MIT
