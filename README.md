# Jungle Rent Beta

Investimenti immobiliari innovativi per studenti universitari.
*Innovative real estate investments for university students.*

Incubato da 2i3T – Università di Torino

---

## Overview

Jungle Rent is a mobile-first web application (PWA) designed to connect investors, students, and tourists with real estate opportunities in Turin. This is the **beta version** focused on lead generation and verification workflows.

### Key Features

- **Investor Flow**: Express interest in fractional property investments
- **Student Flow**: Browse listings, request viewings, apply for housing
- **Tourist Flow**: Browse short-stay listings, request bookings
- **Verification System**: ID upload and verification for students/investors
- **Admin Panel**: Manage listings, properties, leads, and verifications
- **Bilingual Support**: Italian and English (IT/EN)
- **PWA Ready**: Installable on mobile devices

### Beta Limitations

- No payment processing or actual bookings
- No investment checkout flow
- Turin only in UI (data model supports multi-city)
- Fractional investment progress hidden

---

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **Backend**: Supabase (Auth, Postgres, Storage)
- **Forms**: React Hook Form + Zod
- **State**: Zustand (optional)
- **Icons**: Lucide React

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### 1. Clone and Install

```bash
git clone <repository-url>
cd JRE-APP
npm install
```

### 2. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAIL_ALLOWLIST=admin@yourdomain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the SQL migrations in order:
   ```bash
   # In Supabase SQL Editor, run each file:
   supabase/migrations/00001_initial_schema.sql
   supabase/migrations/00002_rls_policies.sql
   supabase/migrations/00003_storage.sql
   supabase/migrations/00004_seed_data.sql
   ```

3. Configure Authentication:
   - Enable "Email" provider
   - Disable "Confirm email" for development (optional)
   - Set Site URL to your app URL
   - Add redirect URLs for auth callbacks

4. Set admin emails environment variable in Supabase:
   - Go to Settings > Edge Functions
   - Add `app.admin_emails` setting or handle via middleware

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel (protected)
│   ├── auth/              # Auth callback route
│   ├── dashboard/         # User dashboard
│   ├── investor/          # Investor flow
│   ├── legal/             # Privacy & Terms pages
│   ├── login/             # Magic link login
│   ├── student/           # Student listings & detail
│   ├── tourist/           # Tourist listings & detail
│   ├── verify/            # Verification page
│   └── waitlist/          # Waitlist signup
├── actions/               # Server Actions
├── components/
│   ├── cards/             # Persona cards, carousel
│   ├── forms/             # Form components
│   ├── layout/            # Header, Footer
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom hooks (useLocale, useAuth)
├── i18n/                  # Translations
├── lib/
│   ├── supabase/         # Supabase clients
│   └── utils.ts          # Utility functions
└── types/                # TypeScript types

supabase/
└── migrations/           # SQL migration files

public/
├── brand/               # Logo and brand assets
├── icons/               # PWA icons (add your own)
├── manifest.json        # PWA manifest
└── sw.js               # Service Worker
```

---

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `cities` | City list (future-proof for multi-city) |
| `properties` | Investment properties |
| `listings` | Rental listings (student + tourist) |
| `profiles` | User profiles |
| `leads` | All lead submissions |
| `investor_profiles` | Investor-specific data |
| `student_requests` | Student viewing/apply requests |
| `tourist_requests` | Tourist booking requests |
| `verifications` | ID verification records |
| `consent_logs` | GDPR consent tracking |

### Storage Buckets

| Bucket | Access | Purpose |
|--------|--------|---------|
| `id_docs` | Private | ID document uploads |
| `proof_of_address` | Private | Proof of address uploads |
| `listing_photos` | Public | Listing images |
| `property_images` | Public | Property cover images |

---

## PWA Notes

The app is PWA-ready with:
- `public/manifest.json` - App manifest
- `public/sw.js` - Basic service worker

### Adding PWA Icons

Create icons in various sizes and place them in `public/icons/`:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

Use a tool like [PWA Asset Generator](https://github.com/nicnocquee/pwa-asset-generator) or [Maskable.app](https://maskable.app/).

---

## Capacitor Guide (iOS + Android)

### Prerequisites

- Xcode 14+ (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)

### 1. Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Jungle Rent" "it.junglerent.app"
```

### 2. Add Platforms

```bash
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

### 3. Configure `capacitor.config.ts`

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'it.junglerent.app',
  appName: 'Jungle Rent',
  webDir: 'out',
  server: {
    // For development with live reload
    // url: 'http://YOUR_IP:3000',
    // cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#F5F0E8',
    },
  },
};

export default config;
```

### 4. Update `next.config.ts` for Static Export

```typescript
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
```

### 5. Build and Sync

```bash
# Build Next.js static export
npm run build

# Sync with native projects
npx cap sync
```

### 6. Open in IDEs

```bash
# iOS
npx cap open ios

# Android
npx cap open android
```

### 7. iOS-Specific Setup

In Xcode:
1. Select your team in Signing & Capabilities
2. Update bundle identifier
3. Add required capabilities (Push Notifications, etc.)
4. Add `NSCameraUsageDescription` and `NSPhotoLibraryUsageDescription` to Info.plist

### 8. Android-Specific Setup

In Android Studio:
1. Update `applicationId` in `android/app/build.gradle`
2. Configure signing for release builds
3. Add required permissions to `AndroidManifest.xml`

### Common Pitfalls

1. **Supabase Auth on Native**: Configure deep links for OAuth callbacks
2. **File Uploads**: May need Capacitor Filesystem plugin
3. **Environment Variables**: Use runtime config, not build-time env vars
4. **Server-Side Rendering**: Must use static export for Capacitor

### Useful Capacitor Plugins

```bash
npm install @capacitor/camera @capacitor/filesystem @capacitor/push-notifications
```

---

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository
2. Add environment variables
3. Deploy

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
CMD ["node", "server.js"]
```

---

## Product Notes

### MVP Features (This Release)

- [x] Landing page with persona cards
- [x] Waitlist signup
- [x] Investor interest flow
- [x] Student browsing + viewing requests
- [x] Tourist browsing + booking requests
- [x] User dashboard
- [x] Magic link authentication
- [x] ID verification uploads
- [x] Admin panel (listings, properties, leads, verifications)
- [x] CSV export
- [x] Bilingual (IT/EN)
- [x] PWA setup

### Next Steps (Post-Beta)

- [ ] Payment integration (Stripe)
- [ ] Investment checkout flow
- [ ] Booking confirmation system
- [ ] Email notifications
- [ ] SMS verification
- [ ] Push notifications
- [ ] Property photo galleries
- [ ] Map integration
- [ ] Calendar availability
- [ ] Review system
- [ ] Multi-city expansion

### Security Considerations

- All document uploads stored in private buckets
- RLS policies enforce data access
- Rate limiting on form submissions
- Honeypot spam protection
- Consent logging for GDPR compliance
- Admin access restricted by email allowlist

---

## Contributing

This project is currently in private beta. Contact the team for contribution guidelines.

---

## License

Proprietary - All rights reserved.

---

## Support

- Email: support@junglerent.it
- Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

Built with care in Turin, Italy.
