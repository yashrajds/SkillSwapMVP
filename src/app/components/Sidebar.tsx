import { NavLink, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  User,
  Settings,
  LogOut,
  Zap,
  MessageSquare,
  Bell,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

function NavItem({ to, icon, label, badge }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
          isActive
            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200"
            : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
        }`
      }
    >
      <span className="w-5 h-5 flex-shrink-0">{icon}</span>
      <span className="text-sm">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge > 9 ? "9+" : badge}
        </span>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-100 flex flex-col shadow-sm">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-md">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-slate-900 tracking-tight" style={{ fontSize: "18px", fontWeight: 700 }}>
              SkillSwap
            </h1>
            <p className="text-slate-400" style={{ fontSize: "11px" }}>Exchange & Grow</p>
          </div>
        </div>
      </div>

      {/* User profile quick view */}
      <div className="px-4 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
          onClick={() => navigate("/profile")}>
          <div className="relative">
            <img
              src={user?.profilePic}
              alt={user?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-100"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-800 truncate" style={{ fontSize: "13px", fontWeight: 600 }}>
              {user?.name}
            </p>
            <p className="text-slate-400 truncate" style={{ fontSize: "11px" }}>
              {user?.skillsOffered[0]?.name || "Add skills"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-slate-400 uppercase px-3 mb-2" style={{ fontSize: "10px", letterSpacing: "0.08em", fontWeight: 600 }}>
          Main
        </p>
        <NavItem to="/dashboard" icon={<LayoutDashboard />} label="Dashboard" />
        <NavItem to="/browse" icon={<Users />} label="Browse Users" />
        <NavItem to="/matches" icon={<Zap />} label="My Matches" />
        <NavItem to="/requests" icon={<ArrowLeftRight />} label="Requests" badge={1} />

        <div className="my-3 border-t border-slate-100" />
        <p className="text-slate-400 uppercase px-3 mb-2" style={{ fontSize: "10px", letterSpacing: "0.08em", fontWeight: 600 }}>
          Community
        </p>
        <NavItem to="/posts" icon={<MessageSquare />} label="Skill Posts" />
        <NavItem to="/notifications" icon={<Bell />} label="Notifications" badge={3} />

        <div className="my-3 border-t border-slate-100" />
        <p className="text-slate-400 uppercase px-3 mb-2" style={{ fontSize: "10px", letterSpacing: "0.08em", fontWeight: 600 }}>
          Account
        </p>
        <NavItem to="/profile" icon={<User />} label="Profile" />
        <NavItem to="/settings" icon={<Settings />} label="Settings" />
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span style={{ fontSize: "14px" }}>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
