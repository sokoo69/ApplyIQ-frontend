export const metadata = {
  title: 'About ApplyIQ | How it Works',
  description: 'Learn about ApplyIQ\'s mission and how our AI-powered career tools help you land your dream job.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-[var(--color-neutral-bg)] py-20 px-4 sm:px-6 lg:px-8 border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight font-[family-name:var(--font-heading)] mb-6">
            Leveling the Playing Field in the Job Market
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            ApplyIQ was built to give every candidate the insights, confidence, and tools they need to stand out. We use advanced AI to analyze exactly what hiring managers are looking for.
          </p>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-16 font-[family-name:var(--font-heading)]">
          How Our AI Features Work
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="bg-indigo-50/50 p-8 rounded-2xl border border-indigo-100/50">
            <div className="w-12 h-12 bg-[var(--color-primary)] text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6 shadow-sm">1</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Match Scoring</h3>
            <p className="text-gray-600 leading-relaxed">
              Our AI Match Score doesn't just look for keyword matches. It uses Google's Gemini models to understand the semantic intent of a job description and compares it deeply against your resume experience. It even learns from your past feedback to tailor its recommendations to your personal career goals over time.
            </p>
          </div>

          <div className="bg-emerald-50/50 p-8 rounded-2xl border border-emerald-100/50">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6 shadow-sm">2</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Cover Letter Generation</h3>
            <p className="text-gray-600 leading-relaxed">
              Gone are the days of generic, templated cover letters. ApplyIQ analyzes the exact requirements of a specific job posting, extracts the most relevant highlights from your resume, and writes a cohesive, natural-sounding narrative in the exact tone you choose (Professional, Enthusiastic, or Confident).
            </p>
          </div>

          <div className="bg-amber-50/50 p-8 rounded-2xl border border-amber-100/50">
            <div className="w-12 h-12 bg-amber-500 text-white rounded-xl flex items-center justify-center font-bold text-xl mb-6 shadow-sm">3</div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Interview Coaching</h3>
            <p className="text-gray-600 leading-relaxed">
              Practice makes perfect. Our Interview Coach acts as the hiring manager for the specific role you're targeting. It remembers the full context of your resume and the job description, asking you highly specific behavioral and technical questions, and providing constructive feedback on your answers in real-time.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
