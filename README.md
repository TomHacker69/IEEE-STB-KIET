# IEEE Student Branch Portfolio & Role-Based Admin System

A complete portfolio and management website for the **IEEE Student Branch** operating under the **Department of ECE / Electronics**. The project provides a public showcase for branch activities, events, dignitaries, research papers, social insights, sponsors, and recruitment, along with a role-based admin panel enabling complete autonomous management without requiring developer code changes.

---

## 1. Architectural Highlights & Non-Negotiable Rules

- **Zero Hardcoding & No Fallback Data**: Every piece of content (text, headlines, labels, images, section visibility, order, quotes, footer text) is dynamically retrieved from MongoDB and editable through the Admin panel.
- **Real-Time Updates**: Content and section updates appear immediately on the public website via dynamic fresh fetching without code rebuilds or redeployment.
- **Empty States**: If a collection has no items yet, elegant, context-aware empty states are rendered (never mock or dummy placeholder data).
- **Home-Only Dignitaries Honor Section**: Dignitaries (Director Academics, Dean, Pro VC, VC, Branch Counselor) are featured respectfully on the Home page only with photos and quotes.
- **Functional Lead Workspaces**: Sub-admins (Social Media Head, Membership Lead, Research Lead, Secretary & Chairperson) get dedicated admin workspaces tailored to their functional domains.
- **Custom Role Builder**: Super Admins can build custom roles from scratch and assign granular checkboxes (`view`, `create`, `edit`, `delete`, `publish`) per section.
- **Cloudinary Storage**: Direct secure uploads for banners, member portraits, social flyers, logos, and certificate documents.
- **Server-Side RBAC & Token Verification**: Firebase ID tokens verified on the Node/Express backend for every protected route.

---

## 2. Directory Structure

```
IEEE-STB-KIET/
├── backend/                  # Node.js + Express REST API (TypeScript)
│   ├── src/
│   │   ├── config/           # MongoDB, Firebase Admin, Cloudinary config
│   │   ├── controllers/      # REST API resource controllers
│   │   ├── middleware/       # Firebase token verification & RBAC permission checks
│   │   ├── models/           # Mongoose schemas (SiteContent, Role, User, Event, etc.)
│   │   ├── routes/           # Express API route endpoints
│   │   ├── scripts/          # seedSuperAdmin.ts (ONLY seeds Super Admin, zero dummy data)
│   │   └── server.ts         # Express server entry point (Port 5000)
│   ├── .env.example
│   └── package.json
├── frontend/                 # Next.js 14 App Router (Public website & Member Dashboard)
│   ├── src/
│   │   ├── app/              # Home, Events, Team, Activities, Research, Social, Recruitment, Dashboard
│   │   ├── components/       # Dynamic Navbar, Footer, DevelopersCorner, EmptyState
│   │   ├── context/          # AuthContext (Firebase client auth & member profile)
│   │   └── lib/              # API fetcher & Firebase client SDK
│   ├── .env.example
│   └── package.json
└── admin/                    # Next.js 14 App Router (Admin & Lead Portals)
    ├── src/
    │   ├── app/              # Dashboard, Custom Role Builder, Sub-Admins, Content, Sections, etc.
    │   ├── components/       # AdminLayout, ImageUploadField, EmptyState
    │   ├── context/          # AuthContext (RBAC permission checks)
    │   └── lib/              # Authenticated API client
    ├── .env.example
    └── package.json
```

---

## 3. Quick Start & Setup Guide

### Step 1: Clone and Install Dependencies

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install

# Admin panel dependencies
cd ../admin
npm install
```

---

### Step 2: Configure Environment Variables

Create `.env` in `backend/`, `frontend/`, and `admin/` using the provided `.env.example` templates.

#### `backend/.env`
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/ieee_stb

# Firebase Admin SDK Credentials
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Initial Super Admin Seed Credentials
SUPERADMIN_EMAIL=admin@ieee.org
SUPERADMIN_PASSWORD=Admin@IEEE2026!
SUPERADMIN_NAME=Super Administrator
```

#### `frontend/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-web-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

#### `admin/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-web-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

---

### Step 3: Seed ONLY the First Super Admin Account

Per project rules, the seed script creates **only** the first Super Admin account and role templates. It **never** injects dummy events or placeholder text.

```bash
cd backend
npm run seed:superadmin
```

Or pass custom credentials directly:
```bash
npx tsx src/scripts/seedSuperAdmin.ts "admin@ieee.org" "MySecurePassword123!" "Branch Counselor"
```

---

### Step 4: Run the Development Servers

Open three terminal windows (or run via the root scripts):

```bash
# Terminal 1: Backend API (Port 5000)
npm run dev:backend

# Terminal 2: Admin Panel (Port 3001)
npm run dev:admin

# Terminal 3: Public Website & Member Dashboard (Port 3000)
npm run dev:frontend
```

- Public Website: [http://localhost:3000](http://localhost:3000)
- Admin Panel: [http://localhost:3001](http://localhost:3001)
- Backend REST API: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 4. Role-Based Access Control (RBAC) & Sub-Admin Workspaces

| Role | Access Scope |
| :--- | :--- |
| **Super Admin** | Full unrestricted control over website wording, section ordering/visibility, custom role builder, sub-admin accounts, and audit logs. |
| **Membership Lead** | Can toggle recruitment drives Open/Close, review applicant submissions, approve members, and generate membership records. |
| **Social Media Head** | Can upload "What's happening at IEEE" highlight cards with flyer photos, captions, and links to Instagram/LinkedIn. |
| **Research Lead** | Can publish research papers, authors, venues, DOI citations, and paper links. |
| **Secretary & Chairperson** | Can manage upcoming/past events, laboratory activities, student branch directory, and certificate uploads. |
| **Custom Roles** | Super Admin can define arbitrary roles with granular checkboxes (`view`, `create`, `edit`, `delete`, `publish`) per section. |

---

## 5. Security & Verification

1. **Firebase ID Token Verification**: Validated on every protected request with `admin.auth().verifyIdToken()`.
2. **Server-Side Permissions**: Evaluated inside Express middleware before any database mutation occurs.
3. **Audit Ledger**: All administrative actions (`CREATE`, `UPDATE`, `DELETE`, `PUBLISH`, `TOGGLE_DRIVE`) are recorded with timestamps, user details, and change payloads.

