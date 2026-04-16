// Mock data services for SkillSwap
// In a real MERN app, these would be Axios API calls to your Express backend

export interface MockUser {
  id: string;
  name: string;
  email: string;
  bio: string;
  profilePic: string;
  skillsOffered: { name: string; level: string; experience: string }[];
  skillsWanted: string[];
  location: string;
  createdAt: string;
  matchCount: number;
  isOnline?: boolean;
}

export interface ExchangeRequest {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  senderPic: string;
  receiverName: string;
  receiverPic: string;
  skillOffered: string;
  skillRequested: string;
  status: "pending" | "accepted" | "rejected";
  message: string;
  createdAt: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userPic: string;
  skillWanted: string;
  description: string;
  createdAt: string;
  responses: number;
}

// ─── Mock Users ───────────────────────────────────────────────────────────────

export const MOCK_USERS: MockUser[] = [
  {
    id: "u1",
    name: "Sophia Chen",
    email: "sophia@example.com",
    bio: "UX/UI designer with 5 years of experience. Love creating beautiful, user-centric products.",
    profilePic: "https://images.unsplash.com/photo-1643816831186-b2427a8f9f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillsOffered: [
      { name: "UI/UX Design", level: "Expert", experience: "5 years" },
      { name: "Figma", level: "Expert", experience: "4 years" },
      { name: "Prototyping", level: "Advanced", experience: "3 years" },
    ],
    skillsWanted: ["React", "Python", "Data Analysis"],
    location: "New York, NY",
    createdAt: "2024-02-10",
    matchCount: 8,
    isOnline: true,
  },
  {
    id: "u2",
    name: "Marcus Williams",
    email: "marcus@example.com",
    bio: "ML engineer exploring the frontiers of artificial intelligence.",
    profilePic: "https://images.unsplash.com/photo-1769636930047-4478f12cf430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillsOffered: [
      { name: "Machine Learning", level: "Expert", experience: "6 years" },
      { name: "Python", level: "Expert", experience: "7 years" },
      { name: "TensorFlow", level: "Advanced", experience: "4 years" },
    ],
    skillsWanted: ["React", "TypeScript", "Mobile Development"],
    location: "Austin, TX",
    createdAt: "2024-01-20",
    matchCount: 15,
    isOnline: false,
  },
  {
    id: "u3",
    name: "Isabella Torres",
    email: "isabella@example.com",
    bio: "Marketing strategist turned growth hacker. I help brands tell their story.",
    profilePic: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillsOffered: [
      { name: "Digital Marketing", level: "Expert", experience: "6 years" },
      { name: "Content Strategy", level: "Advanced", experience: "5 years" },
      { name: "SEO/SEM", level: "Advanced", experience: "4 years" },
    ],
    skillsWanted: ["React", "Node.js", "Data Visualization"],
    location: "Miami, FL",
    createdAt: "2024-03-05",
    matchCount: 11,
    isOnline: true,
  },
  {
    id: "u4",
    name: "Raj Patel",
    email: "raj@example.com",
    bio: "Cloud architect passionate about scalable systems. AWS and GCP certified.",
    profilePic: "https://images.unsplash.com/photo-1752738372136-2602aaafdcb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillsOffered: [
      { name: "Cloud Architecture", level: "Expert", experience: "8 years" },
      { name: "AWS", level: "Expert", experience: "6 years" },
      { name: "DevOps", level: "Advanced", experience: "5 years" },
    ],
    skillsWanted: ["React", "Machine Learning", "Mobile Development"],
    location: "Seattle, WA",
    createdAt: "2024-01-08",
    matchCount: 20,
    isOnline: true,
  },
  {
    id: "u5",
    name: "Emma Wilson",
    email: "emma@example.com",
    bio: "Frontend developer & visual artist. I bridge the gap between design and code.",
    profilePic: "https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillsOffered: [
      { name: "React", level: "Advanced", experience: "3 years" },
      { name: "CSS Animation", level: "Expert", experience: "4 years" },
      { name: "Illustration", level: "Advanced", experience: "5 years" },
    ],
    skillsWanted: ["Python", "Machine Learning", "AWS"],
    location: "Portland, OR",
    createdAt: "2024-02-28",
    matchCount: 6,
    isOnline: false,
  },
  {
    id: "u6",
    name: "Kevin Park",
    email: "kevin@example.com",
    bio: "Mobile developer specializing in cross-platform apps. Flutter & React Native expert.",
    profilePic: "https://images.unsplash.com/photo-1570470836811-78ef04bb23d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillsOffered: [
      { name: "Flutter", level: "Expert", experience: "4 years" },
      { name: "React Native", level: "Advanced", experience: "3 years" },
      { name: "Mobile Development", level: "Expert", experience: "5 years" },
    ],
    skillsWanted: ["Node.js", "Machine Learning", "UI/UX Design"],
    location: "Los Angeles, CA",
    createdAt: "2024-03-15",
    matchCount: 9,
    isOnline: true,
  },
  {
    id: "u7",
    name: "Natalie Brooks",
    email: "natalie@example.com",
    bio: "Product manager & startup advisor. Turning ideas into products that users love.",
    profilePic: "https://images.unsplash.com/photo-1583498794425-6fcc07156a7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillsOffered: [
      { name: "Product Management", level: "Expert", experience: "7 years" },
      { name: "Agile", level: "Expert", experience: "6 years" },
      { name: "User Research", level: "Advanced", experience: "5 years" },
    ],
    skillsWanted: ["Data Analysis", "Python", "Figma"],
    location: "Chicago, IL",
    createdAt: "2024-01-30",
    matchCount: 14,
    isOnline: false,
  },
  {
    id: "u8",
    name: "Liam Carter",
    email: "liam@example.com",
    bio: "Blockchain developer & crypto enthusiast. Building the decentralized future.",
    profilePic: "https://images.unsplash.com/photo-1762753674498-73ec49feafc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillsOffered: [
      { name: "Blockchain", level: "Expert", experience: "4 years" },
      { name: "Solidity", level: "Advanced", experience: "3 years" },
      { name: "Web3", level: "Advanced", experience: "3 years" },
    ],
    skillsWanted: ["Machine Learning", "UI/UX Design", "Marketing"],
    location: "Denver, CO",
    createdAt: "2024-02-14",
    matchCount: 7,
    isOnline: true,
  },
  {
    id: "u9",
    name: "Mei Lin",
    email: "mei@example.com",
    bio: "Data scientist with a love for storytelling through data visualization.",
    profilePic: "https://images.unsplash.com/photo-1643816831186-b2427a8f9f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillsOffered: [
      { name: "Data Analysis", level: "Expert", experience: "5 years" },
      { name: "Data Visualization", level: "Expert", experience: "4 years" },
      { name: "SQL", level: "Advanced", experience: "6 years" },
    ],
    skillsWanted: ["React", "Node.js", "Product Management"],
    location: "Boston, MA",
    createdAt: "2024-03-20",
    matchCount: 5,
    isOnline: true,
  },
  {
    id: "u10",
    name: "Jordan Lee",
    email: "jordan@example.com",
    bio: "Cybersecurity expert & ethical hacker. Making the internet a safer place.",
    profilePic: "https://images.unsplash.com/photo-1769636930047-4478f12cf430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillsOffered: [
      { name: "Cybersecurity", level: "Expert", experience: "7 years" },
      { name: "Penetration Testing", level: "Expert", experience: "5 years" },
      { name: "Network Security", level: "Advanced", experience: "6 years" },
    ],
    skillsWanted: ["Machine Learning", "Cloud Architecture", "Data Analysis"],
    location: "Washington, DC",
    createdAt: "2024-01-25",
    matchCount: 18,
    isOnline: false,
  },
  {
    id: "u11",
    name: "Zara Ahmed",
    email: "zara@example.com",
    bio: "Graphic designer & brand strategist. Colors, typography, and visual stories.",
    profilePic: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillsOffered: [
      { name: "Graphic Design", level: "Expert", experience: "6 years" },
      { name: "Branding", level: "Expert", experience: "5 years" },
      { name: "Adobe Suite", level: "Expert", experience: "7 years" },
    ],
    skillsWanted: ["React", "Motion Graphics", "3D Modeling"],
    location: "London, UK",
    createdAt: "2024-04-01",
    matchCount: 10,
    isOnline: true,
  },
  {
    id: "u12",
    name: "Tyler Ross",
    email: "tyler@example.com",
    bio: "Game developer & storyteller. Crafting worlds and experiences that captivate.",
    profilePic: "https://images.unsplash.com/photo-1570470836811-78ef04bb23d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillsOffered: [
      { name: "Game Development", level: "Expert", experience: "5 years" },
      { name: "Unity", level: "Expert", experience: "4 years" },
      { name: "C#", level: "Advanced", experience: "5 years" },
    ],
    skillsWanted: ["3D Modeling", "Sound Design", "Marketing"],
    location: "Austin, TX",
    createdAt: "2024-02-20",
    matchCount: 13,
    isOnline: false,
  },
];

// ─── Mock Requests ─────────────────────────────────────────────────────────────

export const MOCK_REQUESTS: ExchangeRequest[] = [
  {
    id: "r1",
    senderId: "u1",
    receiverId: "current-user",
    senderName: "Sophia Chen",
    senderPic: "https://images.unsplash.com/photo-1643816831186-b2427a8f9f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    receiverName: "Alex Johnson",
    receiverPic: "https://images.unsplash.com/photo-1762753674498-73ec49feafc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillOffered: "UI/UX Design",
    skillRequested: "React",
    status: "pending",
    message: "Hi Alex! I'd love to exchange skills. I can teach you UI/UX design principles and Figma, and I'd love to learn React from you!",
    createdAt: "2024-04-10",
  },
  {
    id: "r2",
    senderId: "u2",
    receiverId: "current-user",
    senderName: "Marcus Williams",
    senderPic: "https://images.unsplash.com/photo-1769636930047-4478f12cf430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    receiverName: "Alex Johnson",
    receiverPic: "https://images.unsplash.com/photo-1762753674498-73ec49feafc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillOffered: "Machine Learning",
    skillRequested: "TypeScript",
    status: "accepted",
    message: "Hey! Your TypeScript skills would help me build better ML tools. I can teach you ML fundamentals in return.",
    createdAt: "2024-04-05",
  },
  {
    id: "r3",
    senderId: "current-user",
    receiverId: "u3",
    senderName: "Alex Johnson",
    senderPic: "https://images.unsplash.com/photo-1762753674498-73ec49feafc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    receiverName: "Isabella Torres",
    receiverPic: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillOffered: "React",
    skillRequested: "Digital Marketing",
    status: "pending",
    message: "Isabella, I saw your profile and think we'd be a great match! I can teach React and you can teach me digital marketing.",
    createdAt: "2024-04-08",
  },
  {
    id: "r4",
    senderId: "u4",
    receiverId: "current-user",
    senderName: "Raj Patel",
    senderPic: "https://images.unsplash.com/photo-1752738372136-2602aaafdcb7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    receiverName: "Alex Johnson",
    receiverPic: "https://images.unsplash.com/photo-1762753674498-73ec49feafc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillOffered: "AWS",
    skillRequested: "Node.js",
    status: "rejected",
    message: "Would love to trade AWS knowledge for Node.js skills!",
    createdAt: "2024-03-28",
  },
];

// ─── Mock Posts ─────────────────────────────────────────────────────────────────

export const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    userId: "u1",
    userName: "Sophia Chen",
    userPic: "https://images.unsplash.com/photo-1643816831186-b2427a8f9f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillWanted: "React Development",
    description: "Looking to learn React from scratch! I can offer UI/UX design sessions in exchange. I have 5 years of design experience and would love to mentor you.",
    createdAt: "2024-04-12",
    responses: 3,
  },
  {
    id: "p2",
    userId: "u2",
    userName: "Marcus Williams",
    userPic: "https://images.unsplash.com/photo-1769636930047-4478f12cf430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillWanted: "Mobile Development",
    description: "Expert ML engineer seeking to expand into mobile. Can offer Python/ML/TensorFlow mentorship in return. Flexible schedule.",
    createdAt: "2024-04-11",
    responses: 7,
  },
  {
    id: "p3",
    userId: "u5",
    userName: "Emma Wilson",
    userPic: "https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillWanted: "Python Programming",
    description: "Frontend developer wanting to learn Python for data projects. I can teach React, CSS animations, or digital illustration.",
    createdAt: "2024-04-10",
    responses: 5,
  },
  {
    id: "p4",
    userId: "u7",
    userName: "Natalie Brooks",
    userPic: "https://images.unsplash.com/photo-1583498794425-6fcc07156a7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillWanted: "Data Analysis",
    description: "Product manager looking to learn data analysis with Python/R. Will trade product management and Agile coaching sessions.",
    createdAt: "2024-04-09",
    responses: 4,
  },
];

// ─── Skill level colors ────────────────────────────────────────────────────────

export const SKILL_LEVEL_COLORS: Record<string, string> = {
  Beginner: "bg-green-100 text-green-700",
  Intermediate: "bg-blue-100 text-blue-700",
  Advanced: "bg-purple-100 text-purple-700",
  Expert: "bg-orange-100 text-orange-700",
};

// ─── All available skills ──────────────────────────────────────────────────────

export const ALL_SKILLS = [
  "React", "Vue.js", "Angular", "TypeScript", "JavaScript",
  "Node.js", "Python", "Django", "Flask", "FastAPI",
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
  "UI/UX Design", "Figma", "Adobe XD", "Graphic Design", "Branding",
  "Data Analysis", "Data Visualization", "SQL", "MongoDB", "PostgreSQL",
  "AWS", "GCP", "Azure", "DevOps", "Docker", "Kubernetes",
  "Mobile Development", "Flutter", "React Native", "Swift", "Kotlin",
  "Blockchain", "Solidity", "Web3", "Smart Contracts",
  "Cybersecurity", "Penetration Testing", "Network Security",
  "Digital Marketing", "SEO/SEM", "Content Strategy", "Social Media",
  "Product Management", "Agile", "User Research", "Prototyping",
  "Game Development", "Unity", "Unreal Engine", "3D Modeling",
  "Photography", "Video Editing", "Sound Design", "Motion Graphics",
];
