# ApplyIQ Frontend

The Next.js 14 frontend for ApplyIQ. It features a modern, responsive design built with Tailwind CSS, a custom design system ("Lumina"), and seamless integration with the backend API.

## Tech Stack
- **Next.js 14**: React framework (App Router)
- **TypeScript**: Static typing
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Data visualization for the dashboard
- **Lucide React**: Icon library
- **SWR / TanStack Query**: Data fetching hooks (custom hooks in `src/hooks`)
- **Server-Sent Events (SSE)**: For real-time streaming of AI interview coach responses

## Local Setup

### Environment Variables
Create a `.env.local` file in the root of this project with the following variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```
*(This tells the frontend where the ApplyIQ Node.js backend is running).*

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

The application will run on `http://localhost:3000`.

## Architecture & Connection
- **API Clients**: Found in `src/lib/api/`, these single-responsibility clients configure `fetch` with `credentials: 'include'` to ensure the backend's HttpOnly JWT cookie is transmitted securely.
- **Hooks**: Custom hooks like `useAuth`, `useJobs`, and `useApplications` abstract the API layer and manage loading/error states.
- **UI Kit**: Reusable components (`Card`, `Button`, `Badge`, `Skeleton`) are located in `src/components/ui/` and adhere strictly to the Lumina design tokens defined in `src/app/globals.css`.
- **Protected Routes**: Pages requiring authentication use the `useAuth()` hook to check state and perform client-side redirects to `/login` if the user is unauthenticated.
