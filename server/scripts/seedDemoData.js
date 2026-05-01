import bcrypt from "bcryptjs";
import { Notification } from "../models/Notification.js";
import { Post } from "../models/Post.js";
import { Swap } from "../models/Swap.js";
import { User } from "../models/User.js";

const demoUsers = [
  {
    name: "Sophia Chen",
    email: "sophia@example.com",
    password: "DemoPass123!",
    bio: "UX/UI designer who loves exchanging design feedback for frontend mentoring.",
    location: "New York, NY",
    profileImage: "https://images.unsplash.com/photo-1643816831186-b2427a8f9f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillsOffered: [
      { name: "UI/UX Design", level: "Expert", experience: "5 years" },
      { name: "Figma", level: "Advanced", experience: "4 years" },
    ],
    skillsWanted: ["React", "TypeScript"],
  },
  {
    name: "Marcus Williams",
    email: "marcus@example.com",
    password: "DemoPass123!",
    bio: "ML engineer exploring product-minded development and mobile apps.",
    location: "Austin, TX",
    profileImage: "https://images.unsplash.com/photo-1769636930047-4478f12cf430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillsOffered: [
      { name: "Machine Learning", level: "Expert", experience: "6 years" },
      { name: "Python", level: "Expert", experience: "7 years" },
    ],
    skillsWanted: ["React Native", "Product Management"],
  },
  {
    name: "Emma Wilson",
    email: "emma@example.com",
    password: "DemoPass123!",
    bio: "Frontend developer and illustrator bridging design and code.",
    location: "Portland, OR",
    profileImage: "https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    skillsOffered: [
      { name: "React", level: "Advanced", experience: "3 years" },
      { name: "CSS Animation", level: "Expert", experience: "4 years" },
    ],
    skillsWanted: ["Python", "AWS"],
  },
];

export async function seedDemoData() {
  const userCount = await User.countDocuments();

  if (userCount > 0) {
    return;
  }

  const hashedUsers = await Promise.all(
    demoUsers.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, 10),
    }))
  );

  const createdUsers = await User.insertMany(hashedUsers);
  const [sophia, marcus, emma] = createdUsers;

  await Post.insertMany([
    {
      user: sophia._id,
      skillWanted: "React",
      description: "Looking for React basics and happy to trade a focused Figma audit in return.",
    },
    {
      user: marcus._id,
      skillWanted: "Product Management",
      description: "Want to sharpen product thinking and can exchange Python or ML guidance.",
    },
  ]);

  await Swap.insertMany([
    {
      sender: sophia._id,
      receiver: emma._id,
      skillOffered: "UI/UX Design",
      skillRequested: "React",
      status: "accepted",
      message: "Want to swap a design review for React mentoring?",
    },
    {
      sender: marcus._id,
      receiver: sophia._id,
      skillOffered: "Python",
      skillRequested: "Figma",
      status: "pending",
      message: "Interested in exchanging Python help for interface critique.",
    },
  ]);

  await Notification.insertMany([
    {
      user: sophia._id,
      type: "system",
      title: "Welcome to SkillSwap",
      body: "Your demo workspace is ready. Browse members, posts, and swap requests to explore the MVP.",
    },
    {
      user: emma._id,
      type: "accepted",
      title: "Request accepted",
      body: "Sophia accepted your exchange request.",
      avatar: sophia.profileImage,
    },
  ]);

  console.log("Seeded demo community data");
}
