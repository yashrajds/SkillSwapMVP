import { useEffect, useMemo, useState } from "react";
import { Grid3x3, List, MapPin, Search, SlidersHorizontal, Star } from "lucide-react";
import { UserCard } from "../components/UserCard";
import { useAuth } from "../context/AuthContext";
import { getApiError } from "../services/api";
import { SKILL_LEVEL_COLORS } from "../services/mockData";
import { swapService } from "../services/swapService";
import { userService } from "../services/userService";
import type { User } from "../services/types";

const LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced", "Expert"];

export function Browse() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [level, setLevel] = useState("All Levels");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [requestedUsers, setRequestedUsers] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (loadError) {
        setError(getApiError(loadError, "Unable to load members."));
      }
    };

    void loadUsers();
  }, []);

  const locations = useMemo(
    () => ["All Locations", ...Array.from(new Set(users.map((item) => item.location).filter(Boolean)))],
    [users]
  );

  const filtered = users.filter((u) => {
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.skillsOffered.some((s) => s.name.toLowerCase().includes(search.toLowerCase())) ||
      u.skillsWanted.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchLocation = location === "All Locations" || u.location === location;
    const matchLevel = level === "All Levels" || u.skillsOffered.some((s) => s.level === level);
    return matchSearch && matchLocation && matchLevel;
  });

  const handleRequest = async (member: User) => {
    const offeredSkill = user?.skillsOffered[0]?.name || member.skillsWanted[0];
    const requestedSkill = member.skillsOffered[0]?.name || member.skillsWanted[0];
    if (!offeredSkill || !requestedSkill) return;

    await swapService.createSwap({
      receiverId: member.id,
      skillOffered: offeredSkill,
      skillRequested: requestedSkill,
      message: `Hi ${member.name}, I'd love to exchange ${offeredSkill} for ${requestedSkill}.`,
    });

    setRequestedUsers((prev) => new Set([...prev, member.id]));
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-slate-900 mb-1" style={{ fontSize: "24px", fontWeight: 700 }}>Browse Members</h1>
        <p className="text-slate-500" style={{ fontSize: "14px" }}>
          Discover {users.length}+ talented people ready to swap skills.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 mb-6" style={{ fontSize: "13px" }}>
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, skill..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              style={{ fontSize: "13px" }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${showFilters ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span style={{ fontSize: "13px" }}>Filters</span>
          </button>
          <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>Location</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                style={{ fontSize: "13px" }}
              >
                {locations.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-slate-500 mb-1.5" style={{ fontSize: "12px", fontWeight: 500 }}>Skill Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                style={{ fontSize: "13px" }}
              >
                {LEVELS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      <p className="text-slate-500 mb-4" style={{ fontSize: "13px" }}>
        {filtered.length} member{filtered.length !== 1 ? "s" : ""} found
      </p>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((member) => (
            <UserCard
              key={member.id}
              user={member}
              defaultSkillOffered={user?.skillsOffered[0]?.name}
              onRequest={(id) => setRequestedUsers((p) => new Set([...p, id]))}
              isRequested={requestedUsers.has(member.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="relative flex-shrink-0">
                <img src={member.profilePic} alt={member.name} className="w-14 h-14 rounded-xl object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-slate-900" style={{ fontSize: "15px", fontWeight: 600 }}>{member.name}</h3>
                  {member.location && (
                    <span className="flex items-center gap-1 text-slate-400" style={{ fontSize: "11px" }}>
                      <MapPin className="w-3 h-3" />
                      {member.location}
                    </span>
                  )}
                </div>
                <p className="text-slate-500 truncate mb-2" style={{ fontSize: "12px" }}>{member.bio}</p>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400" style={{ fontSize: "11px" }}>Offers:</span>
                  {member.skillsOffered.slice(0, 2).map((skill) => (
                    <span key={skill.name} className={`px-2 py-0.5 rounded-lg ${SKILL_LEVEL_COLORS[skill.level] || "bg-slate-100 text-slate-600"}`} style={{ fontSize: "11px" }}>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span style={{ fontSize: "12px", fontWeight: 500 }}>{member.matchCount}</span>
                </div>
                {requestedUsers.has(member.id) ? (
                  <span className="px-4 py-2 rounded-xl bg-green-50 text-green-600 border border-green-200" style={{ fontSize: "12px" }}>
                    Sent
                  </span>
                ) : (
                  <button
                    onClick={() => void handleRequest(member)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
                    style={{ fontSize: "12px", fontWeight: 500 }}
                  >
                    Request
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-600" style={{ fontSize: "16px", fontWeight: 600 }}>No members found</p>
          <p className="text-slate-400 mt-1" style={{ fontSize: "14px" }}>Try different search terms or filters</p>
        </div>
      )}
    </div>
  );
}
