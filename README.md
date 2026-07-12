# 🗺️ LeetMap

**Live:** https://leetmap-web.vercel.app

LeetMap is a full-stack interview preparation platform that helps software engineers discover, organize, and track company-specific LeetCode questions. Browse problems asked by top tech companies, filter them by recency, difficulty, and topic, and keep track of your interview preparation progress.

![LeetMap Preview](https://github.com/user-attachments/assets/3633028c-8f2e-4491-8f9c-7d38cda050f3)

## ✨ Features

- 📊 **470+ Companies** – Explore interview questions grouped by company.
- 📅 **Recency Filters** – View problems asked in the last **30 days**, **3 months**, **6 months**, or **All Time**.
- 🎯 **Smart Search & Filtering** – Instantly search by company, problem name, difficulty, or topic.
- 📈 **Progress Tracking** – Sign in to mark solved problems and monitor your completion percentage.
- ☁️ **Topic Explorer** – Discover questions through interactive topic tags like Graphs, DP, Trees, Arrays, and more.
- ⚡ **Fast & Responsive UI** – Built with React, Vite, and Tailwind CSS for a smooth browsing experience.
- 🔐 **Authentication** – Secure user accounts powered by Supabase Auth.
- 📊 **Analytics** – Google Analytics 4 integration for usage insights.

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| Backend | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Analytics | Google Analytics 4 (GA4) |
| Deployment | Vercel |

## 🚀 Local Development

```bash
git clone https://github.com/Hey-Hades/LeetMap.git
cd LeetMap
npm install
```

Create a `.env` file in the project root.

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Run the development server.

```bash
npm run dev
```

Open **http://localhost:5173**.
