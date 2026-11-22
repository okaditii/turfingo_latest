# Turfingo Sports Tournament Platform Report

## 1. Project Description

Turfingo Sports is a modern tournament registration and waitlist platform built with React and Vite. The application presents Turfingo as a youth sports community centered on competition, training energy, and visibility for young athletes.

The platform includes:

- A visually rich landing page with navigation, hero content, and branded sections such as About, Services, Glimpses, Community, Contact, and Footer.
- A registration page for tournament sign-up with validation, payment handling, and Supabase storage.
- A waitlist page that displays confirmed players and supports search and filtering by sport and age group.

The project is designed to feel like a sports brand experience rather than a plain form-driven website. The interface emphasizes bold typography, layered imagery, high-contrast sections, and responsive layouts for desktop and mobile users.

## 2. Schema Design

The backend data model is centered on a single table named `registrations`, defined in [supabase-setup.sql](./supabase-setup.sql).

### Table: `registrations`

| Column | Type | Purpose |
| --- | --- | --- |
| `id` | `BIGSERIAL PRIMARY KEY` | Internal unique database identifier |
| `registration_id` | `TEXT UNIQUE NOT NULL` | Public-facing registration reference such as `TF-XXXXXX` |
| `player_name` | `TEXT NOT NULL` | Registered player name |
| `email` | `TEXT NOT NULL` | Contact email |
| `phone` | `TEXT NOT NULL` | Player phone number |
| `age` | `INTEGER NOT NULL` | Player age |
| `age_group` | `TEXT NOT NULL` | Tournament age category |
| `sport` | `TEXT NOT NULL` | Selected sport |
| `team_name` | `TEXT NOT NULL` | Team or academy name |
| `city` | `TEXT NOT NULL` | Player city |
| `guardian_name` | `TEXT` | Guardian name for minors |
| `guardian_phone` | `TEXT` | Guardian phone number for minors |
| `payment_id` | `TEXT` | Razorpay payment reference |
| `payment_status` | `TEXT DEFAULT 'pending'` | Payment state, such as `pending` or `paid` |
| `amount` | `NUMERIC DEFAULT 0` | Registration amount |
| `registered_at` | `TIMESTAMPTZ DEFAULT NOW()` | Registration timestamp |

### Security and Access

Row Level Security is enabled on the table. Two public policies are configured:

- Public inserts are allowed so users can submit registrations.
- Public reads are allowed so the waitlist page can display registered players.

### Indexing Strategy

Indexes are created on the most common lookup fields to support fast search and filtering:

- `player_name`, `registration_id`, `email`, `team_name`, `city`
- `sport`
- `age_group`
- `payment_status`

This structure is simple, practical, and well suited to a single-event registration workflow.

## 3. Front End Design

The front end is built to stand out visually and feel like a real sports brand. The landing page composition is defined in [src/App.jsx](./src/App.jsx), which assembles the main sections in a clear storytelling flow.

### Design Language

- Bold, condensed typography is used to create a stadium-style identity.
- The hero section uses full-bleed imagery, overlays, and a strong CTA arrangement.
- Section backgrounds alternate between warm panels and dramatic dark blocks to create contrast.
- Cards, badges, and rounded pills are used to keep the interface modern and energetic.

### Unique UI Elements

- The hero section includes a branded top bar, responsive navigation, layered background image, and CTA buttons.
- The registration page uses a cinematic event-style banner with details such as format, venue, date, and fee.
- The waitlist page provides both table and mobile-card views, improving usability across screen sizes.
- The community and footer sections use strong color treatment and graphic layering to make the site feel custom rather than template-based.

### Responsiveness

The layout adapts well across desktop and mobile devices:

- Navigation collapses into a mobile menu on smaller screens.
- Hero text, CTA buttons, and content cards reflow for narrow layouts.
- The waitlist table switches to a card layout on mobile for easier reading.

The styling is concentrated in [src/App.css](./src/App.css), while page-specific styles are kept in [src/styles/register.css](./src/styles/register.css) and [src/styles/waitlist.css](./src/styles/waitlist.css).

## 4. Code

The application is organized into small, reusable React components and feature pages.

### Main Application Flow

The root component in [src/App.jsx](./src/App.jsx) renders the landing page sections in order:

```jsx
<main className="landing-page">
  <Hero />
  <About />
  <Services />
  <Glimpse />
  <ScrollBanner />
  <Community />
  <Contact />
  <Footer />
</main>
```

### Hero Component

The hero in [src/components/hero.jsx](./src/components/hero.jsx) provides the main brand introduction, navigation links, and primary call to action.

### Registration Flow

The registration page in [src/pages/Register.jsx](./src/pages/Register.jsx) handles:

- Form state and live validation
- Age-group and guardian checks
- Razorpay payment initialization
- Saving confirmed registrations into Supabase

### Waitlist Flow

The waitlist page in [src/pages/Waitlist.jsx](./src/pages/Waitlist.jsx) fetches confirmed registrations from Supabase and supports:

- Search by player name, registration ID, email, team, or city
- Filtering by sport and age group
- Desktop table layout and mobile-friendly cards

### Supabase Client

The Supabase client in [src/lib/supabase.js](./src/lib/supabase.js) reads environment variables and creates a single shared client instance for the app.

## 5. Output Screenshots

Below are the recommended screenshots to include in the final submission. These should be captured from the running app.

### Screenshot 1: Landing Page Hero

Capture the top of the home page showing:

- Turfingo logo and navigation
- Welcome text
- Main slogan
- `Register Now` button

### Screenshot 2: Registration Page

Capture the registration screen showing:

- Event banner
- Form sections
- Payment summary
- Submit button

### Screenshot 3: Waitlist Page

Capture the waitlist screen showing:

- Search and filter bar
- Registered players table
- Mobile card layout if taken on a smaller screen

### Screenshot 4: Community / Footer Section

Capture one of the final landing sections to show the unique visual identity of the site.

## Conclusion

Turfingo Sports demonstrates a complete event-registration experience with a polished front end, structured data storage, secure payment flow, and a searchable waitlist. The project combines sports branding, responsive design, and practical data handling into a single cohesive web application.

