export default function StatisticsSection() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:px-8 border-y border-gray-100">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 text-center">
          <div className="space-y-2">
            <div className="text-2xl font-extrabold text-[var(--color-primary)] md:text-3xl">
              One Dashboard
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Organize Every Application</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-extrabold text-[var(--color-primary)] md:text-3xl">
              Smart AI
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Learns Your Preferences</p>
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-extrabold text-[var(--color-primary)] md:text-3xl">
              Live Practice
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Real Interview Questions</p>
          </div>
        </div>
      </div>
    </section>
  );
}
