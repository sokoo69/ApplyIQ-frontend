export const metadata = {
  title: 'Privacy Policy & Terms | ApplyIQ',
  description: 'How we handle your data, resume text, and AI processing.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[var(--color-neutral-bg)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-[family-name:var(--font-heading)] mb-8">
          Privacy Policy & Terms of Service
        </h1>
        
        <div className="prose prose-indigo max-w-none text-gray-600">
          <p className="lead text-lg text-gray-900 font-medium">
            At ApplyIQ, we take the privacy and security of your career data seriously. Because our platform relies heavily on processing your personal information via AI, we believe in complete transparency.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">1. Resume Text Storage</h2>
          <p>
            When you upload or paste your resume text into your ApplyIQ profile, it is securely stored in our encrypted MongoDB database. Your resume is tied exclusively to your account identifier. We do not sell your resume data to third-party recruiters, advertisers, or data brokers.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">2. AI Processing via Gemini</h2>
          <p>
            To power features like Match Scoring, Cover Letter Generation, and the Interview Coach, ApplyIQ securely transmits relevant portions of your resume text and the job description to Google's Gemini API. 
          </p>
          <ul className="list-disc pl-5 mb-6 space-y-2">
            <li><strong>No Persistent Training:</strong> Your personal data is only used during the context of the API request to generate your specific results. It is not used by Google to train baseline models.</li>
            <li><strong>Data Minimization:</strong> We only send the text necessary to accomplish the specific task (e.g., generating a cover letter).</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">3. Authentication & Cookies</h2>
          <p>
            We use secure, HTTP-only cookies to manage your active session (JWT). This ensures that malicious client-side scripts cannot access your authentication tokens. We do not use third-party tracking cookies for advertising. If you log in via Google OAuth, we only request the minimum required scopes (email, profile name, and avatar).
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">4. Your Right to Data Deletion</h2>
          <p>
            You retain full ownership of your data. If you wish to delete your account, you can request data deletion by contacting our support team. Upon deletion, your user profile, resume text, application tracking history, and chat session transcripts are permanently purged from our database.
          </p>

          <p className="mt-12 text-sm text-gray-500 pt-6 border-t border-gray-100">
            Last updated: July 2026. For questions regarding these terms, please contact privacy@applyiq.com.
          </p>
        </div>
      </div>
    </div>
  );
}
