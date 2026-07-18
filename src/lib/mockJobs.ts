export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogoUrl: string;
  location: string;
  category: string;
  salaryRange: {
    min: number;
    max: number;
  };
  jobType: 'full-time' | 'part-time' | 'remote' | 'contract';
  description: string;
  requirements: string[];
  deadline: string;
  createdAt: string;
}

export const mockJobs: Job[] = [
  {
    id: "j1",
    title: "Senior Frontend Engineer (React/Next.js)",
    company: "Pathao",
    companyLogoUrl: "https://ui-avatars.com/api/?name=Pathao&background=4F46E5&color=fff",
    location: "Dhaka, Bangladesh",
    category: "Software Engineering",
    salaryRange: { min: 100000, max: 150000 },
    jobType: "full-time",
    description: "We are looking for a Senior Frontend Engineer to lead the development of our next-generation delivery dashboard. You will work closely with product and design to build highly responsive, performant user interfaces using Next.js and Tailwind CSS.",
    requirements: ["4+ years React experience", "Next.js App Router", "Tailwind CSS", "TypeScript"],
    deadline: "2026-12-01T00:00:00Z",
    createdAt: "2026-06-10T10:00:00Z"
  },
  {
    id: "j2",
    title: "Backend Node.js Developer",
    company: "Bikroy",
    companyLogoUrl: "https://ui-avatars.com/api/?name=Bikroy&background=10B981&color=fff",
    location: "Dhaka, Bangladesh",
    category: "Software Engineering",
    salaryRange: { min: 80000, max: 120000 },
    jobType: "full-time",
    description: "Join our core engineering team to build scalable APIs supporting millions of users. Experience with microservices, Express, and MongoDB is critical for this role.",
    requirements: ["Node.js", "Express", "MongoDB", "Redis"],
    deadline: "2026-11-15T00:00:00Z",
    createdAt: "2026-06-12T10:00:00Z"
  },
  {
    id: "j3",
    title: "Remote Full Stack Developer",
    company: "Toptal",
    companyLogoUrl: "https://ui-avatars.com/api/?name=Toptal&background=111827&color=fff",
    location: "Remote",
    category: "Software Engineering",
    salaryRange: { min: 200000, max: 350000 },
    jobType: "remote",
    description: "Work with global clients on diverse full-stack projects. Strong communication skills and proficiency in MERN stack required. Must be able to overlap with US EST hours.",
    requirements: ["React", "Node.js", "PostgreSQL", "English fluency"],
    deadline: "2026-10-20T00:00:00Z",
    createdAt: "2026-06-15T10:00:00Z"
  },
  {
    id: "j4",
    title: "UI/UX Product Designer",
    company: "10 Minute School",
    companyLogoUrl: "https://ui-avatars.com/api/?name=10MS&background=F59E0B&color=fff",
    location: "Dhaka, Bangladesh",
    category: "Design",
    salaryRange: { min: 70000, max: 100000 },
    jobType: "full-time",
    description: "Design the future of ed-tech in Bangladesh. You will be responsible for end-to-end product design, from wireframing to high-fidelity prototypes in Figma.",
    requirements: ["Figma", "User Research", "Prototyping", "3+ years experience"],
    deadline: "2026-09-30T00:00:00Z",
    createdAt: "2026-06-18T10:00:00Z"
  },
  {
    id: "j5",
    title: "Data Analyst",
    company: "Daraz",
    companyLogoUrl: "https://ui-avatars.com/api/?name=Daraz&background=F97316&color=fff",
    location: "Dhaka, Bangladesh",
    category: "Data",
    salaryRange: { min: 60000, max: 90000 },
    jobType: "full-time",
    description: "Analyze e-commerce trends, build dashboards in Tableau, and provide actionable insights to the marketing and sales teams.",
    requirements: ["SQL", "Python", "Tableau", "Statistics"],
    deadline: "2026-11-01T00:00:00Z",
    createdAt: "2026-06-20T10:00:00Z"
  },
  {
    id: "j6",
    title: "React Native Mobile Developer",
    company: "bKash",
    companyLogoUrl: "https://ui-avatars.com/api/?name=bKash&background=E11D48&color=fff",
    location: "Dhaka, Bangladesh",
    category: "Mobile",
    salaryRange: { min: 120000, max: 180000 },
    jobType: "full-time",
    description: "Help build and maintain the most used financial app in the country. Experience with React Native, Redux, and native bridging is highly preferred.",
    requirements: ["React Native", "iOS/Android build process", "Redux"],
    deadline: "2026-10-15T00:00:00Z",
    createdAt: "2026-06-25T10:00:00Z"
  },
  {
    id: "j7",
    title: "DevOps Engineer",
    company: "Brain Station 23",
    companyLogoUrl: "https://ui-avatars.com/api/?name=BS23&background=3B82F6&color=fff",
    location: "Dhaka, Bangladesh",
    category: "DevOps",
    salaryRange: { min: 90000, max: 140000 },
    jobType: "full-time",
    description: "Manage AWS infrastructure, set up CI/CD pipelines using GitHub Actions, and ensure high availability for enterprise clients.",
    requirements: ["AWS", "Docker", "Kubernetes", "Terraform"],
    deadline: "2026-09-10T00:00:00Z",
    createdAt: "2026-07-01T10:00:00Z"
  },
  {
    id: "j8",
    title: "Marketing Manager",
    company: "Chaldal",
    companyLogoUrl: "https://ui-avatars.com/api/?name=Chaldal&background=14B8A6&color=fff",
    location: "Dhaka, Bangladesh",
    category: "Marketing",
    salaryRange: { min: 75000, max: 110000 },
    jobType: "full-time",
    description: "Lead digital marketing campaigns, manage social media strategy, and optimize user acquisition funnels for online grocery delivery.",
    requirements: ["Digital Marketing", "SEO/SEM", "Content Strategy"],
    deadline: "2026-08-25T00:00:00Z",
    createdAt: "2026-07-05T10:00:00Z"
  },
  {
    id: "j9",
    title: "Freelance Content Writer",
    company: "Upwork Clients",
    companyLogoUrl: "https://ui-avatars.com/api/?name=Upwork&background=84CC16&color=fff",
    location: "Remote",
    category: "Content",
    salaryRange: { min: 30000, max: 60000 },
    jobType: "contract",
    description: "Write technical blog posts and documentation for SaaS companies. Flexible hours, payment per article.",
    requirements: ["Excellent English", "SEO knowledge", "Tech writing experience"],
    deadline: "2026-12-31T00:00:00Z",
    createdAt: "2026-07-08T10:00:00Z"
  },
  {
    id: "j10",
    title: "QA Automation Engineer",
    company: "Therap",
    companyLogoUrl: "https://ui-avatars.com/api/?name=Therap&background=6366F1&color=fff",
    location: "Dhaka, Bangladesh",
    category: "QA",
    salaryRange: { min: 70000, max: 105000 },
    jobType: "full-time",
    description: "Build automated test suites using Cypress and Selenium for our healthcare software platform. Ensure HIPAA compliance in testing.",
    requirements: ["Cypress", "Selenium", "Java or JS", "API Testing"],
    deadline: "2026-10-05T00:00:00Z",
    createdAt: "2026-07-10T10:00:00Z"
  },
  {
    id: "j11",
    title: "Part-time Graphic Designer",
    company: "Foodpanda",
    companyLogoUrl: "https://ui-avatars.com/api/?name=Foodpanda&background=EC4899&color=fff",
    location: "Dhaka, Bangladesh",
    category: "Design",
    salaryRange: { min: 25000, max: 40000 },
    jobType: "part-time",
    description: "Create engaging social media graphics, banners, and promotional materials. 20 hours per week commitment.",
    requirements: ["Adobe Illustrator", "Photoshop", "Social Media Design"],
    deadline: "2026-08-30T00:00:00Z",
    createdAt: "2026-07-12T10:00:00Z"
  },
  {
    id: "j12",
    title: "Machine Learning Engineer",
    company: "TigerIT",
    companyLogoUrl: "https://ui-avatars.com/api/?name=TigerIT&background=8B5CF6&color=fff",
    location: "Dhaka, Bangladesh",
    category: "AI/ML",
    salaryRange: { min: 150000, max: 250000 },
    jobType: "full-time",
    description: "Develop computer vision models for identity verification systems. Strong background in PyTorch and OpenCV required.",
    requirements: ["Python", "PyTorch", "Computer Vision", "C++"],
    deadline: "2026-11-20T00:00:00Z",
    createdAt: "2026-07-14T10:00:00Z"
  },
  {
    id: "j13",
    title: "Technical Support Specialist",
    company: "Optimizely",
    companyLogoUrl: "https://ui-avatars.com/api/?name=Optimizely&background=0284C7&color=fff",
    location: "Remote",
    category: "Support",
    salaryRange: { min: 80000, max: 120000 },
    jobType: "remote",
    description: "Provide tier 2 technical support for our enterprise A/B testing platform. Analyze logs, debug JS snippets, and assist clients.",
    requirements: ["JavaScript", "HTML/CSS", "Customer Support", "Debugging"],
    deadline: "2026-09-15T00:00:00Z",
    createdAt: "2026-07-15T10:00:00Z"
  }
];
