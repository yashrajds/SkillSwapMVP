import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeftRight, Filter, Search, TrendingUp, Users, Zap, ZoomIn, ZoomOut } from "lucide-react";
import { UserCard } from "../components/UserCard";
import { useAuth } from "../context/AuthContext";
import { getApiError } from "../services/api";
import { swapService } from "../services/swapService";
import { userService } from "../services/userService";
import type { SwapRequest, User } from "../services/types";

const SKILL_FILTERS = [
  "All Skills", "React", "Python", "UI/UX Design", "Machine Learning",
  "Data Analysis", "Node.js", "Mobile Development", "AWS", "DevOps"
];

export function Dashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [swaps, setSwaps] = useState<SwapRequest[]>([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Skills");
  const [requestedUsers, setRequestedUsers] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState(1);
  const [visibleCount, setVisibleCount] = useState(8);
  const [error, setError] = useState("");
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [memberData, swapData] = await Promise.all([userService.getUsers(), swapService.getSwaps()]);
        setUsers(memberData);
        setSwaps(swapData);
        setRequestedUsers(new Set(swapData.map((swap) => swap.receiverId)));
      } catch (loadError) {
        setError(getApiError(loadError, "Unable to load dashboard data."));
      }
    };

    void loadData();
  }, []);

  const filteredUsers = users.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(search.toLowerCase()) ||
      member.skillsOffered.some((skill) => skill.name.toLowerCase().includes(search.toLowerCase())) ||
      member.skillsWanted.some((skill) => skill.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter =
      activeFilter === "All Skills" ||
      member.skillsOffered.some((skill) => skill.name === activeFilter) ||
      member.skillsWanted.includes(activeFilter);

    return matchesSearch && matchesFilter;
  });

  const visibleUsers = filteredUsers.slice(0, visibleCount);
  const hasMore = visibleCount < filteredUsers.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + 4, filteredUsers.length));
  }, [filteredUsers.length]);

  const acceptedSwaps = useMemo(() => swaps.filter((swap) => swap.status === "accepted"), [swaps]);
  const incomingPendingCount = useMemo(
    () => swaps.filter((swap) => swap.receiverId === user?.id && swap.status === "pending").length,
    [swaps, user?.id]
  );
  const profileReadiness = useMemo(() => {
    let complete = 0;

    if (user?.bio) complete += 1;
    if (user?.location) complete += 1;
    if ((user?.skillsOffered.length ?? 0) > 0) complete += 1;
    if ((user?.skillsWanted.length ?? 0) > 0) complete += 1;

    return complete;
  }, [user]);

  const stats = [
    { icon: <Users className="w-5 h-5" />, label: "Total Members", value: String(users.length), color: "text-indigo-600", bg: "bg-indigo-50" },
    { icon: <Zap className="w-5 h-5" />, label: "My Matches", value: String(user?.matchCount || 0), color: "text-violet-600", bg: "bg-violet-50" },
    { icon: <ArrowLeftRight className="w-5 h-5" />, label: "Active Requests", value: String(swaps.filter((swap) => swap.status === "pending").length), color: "text-orange-500", bg: "bg-orange-50" },
    { icon: <TrendingUp className="w-5 h-5" />, label: "Skills Listed", value: String(users.reduce((sum, member) => sum + member.skillsOffered.length, 0)), color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="p-6 max-w-screen-xl">
      <div className="mb-8">
        <h1 className="text-slate-900 mb-1" style={{ fontSize: "24px", fontWeight: 700 }}>
          Good morning, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-slate-500" style={{ fontSize: "14px" }}>
          Discover new skill partners and start exchanging today.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <p className="text-slate-400 mb-2" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Today on SkillSwap
          </p>
          <h2 className="text-slate-900 mb-2" style={{ fontSize: "20px", fontWeight: 700 }}>
            {incomingPendingCount > 0
              ? `You have ${incomingPendingCount} request${incomingPendingCount === 1 ? "" : "s"} waiting on you`
              : acceptedSwaps.length > 0
                ? "You already have active momentum"
                : "Your next good match is probably one click away"}
          </h2>
          <p className="text-slate-500 mb-4" style={{ fontSize: "14px", lineHeight: "1.6" }}>
            {incomingPendingCount > 0
              ? "Review incoming requests, accept the best fit, and keep the conversation moving while interest is fresh."
              : acceptedSwaps.length > 0
                ? "You have accepted exchanges in progress. Keep browsing if you want to add a second learning lane."
                : "Start by browsing members who overlap with your learning goals, then send one thoughtful request instead of many generic ones."}
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700" style={{ fontSize: "12px", fontWeight: 500 }}>
              {users.length} people available
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-violet-50 text-violet-700" style={{ fontSize: "12px", fontWeight: 500 }}>
              {acceptedSwaps.length} accepted exchanges
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700" style={{ fontSize: "12px", fontWeight: 500 }}>
              {swaps.filter((swap) => swap.status === "pending").length} pending requests
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <p className="text-slate-400 mb-2" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Profile readiness
          </p>
          <h2 className="text-slate-900 mb-1" style={{ fontSize: "20px", fontWeight: 700 }}>
            {profileReadiness}/4 basics complete
          </h2>
          <p className="text-slate-500 mb-4" style={{ fontSize: "14px", lineHeight: "1.6" }}>
            Stronger profiles get better responses. A short bio plus clear offered and wanted skills makes this feel more trustworthy.
          </p>
          <div className="space-y-2">
            {[
              { done: Boolean(user?.bio), label: "Write a short bio" },
              { done: Boolean(user?.location), label: "Add your location" },
              { done: (user?.skillsOffered.length ?? 0) > 0, label: "List skills you can offer" },
              { done: (user?.skillsWanted.length ?? 0) > 0, label: "List skills you want to learn" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${item.done ? "bg-green-500" : "bg-slate-300"}`} />
                <span className={item.done ? "text-slate-700" : "text-slate-500"} style={{ fontSize: "13px" }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 mb-6" style={{ fontSize: "13px" }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
              <span className={stat.color}>{stat.icon}</span>
            </div>
            <div>
              <p className="text-slate-900" style={{ fontSize: "18px", fontWeight: 700 }}>{stat.value}</p>
              <p className="text-slate-400" style={{ fontSize: "11px" }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or skill..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              style={{ fontSize: "13px" }}
            />
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" />
            <span style={{ fontSize: "13px" }}>Quick filters</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            <button onClick={() => setZoom((z) => Math.min(z + 0.1, 1.3))} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-all" title="Zoom in">
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="px-2 text-slate-600" style={{ fontSize: "12px", fontWeight: 500 }}>
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={() => setZoom((z) => Math.max(z - 0.1, 0.7))} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-600 hover:bg-white hover:text-slate-900 transition-all" title="Zoom out">
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {SKILL_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-xl transition-all ${
                activeFilter === filter
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
              style={{ fontSize: "12px", fontWeight: activeFilter === filter ? 500 : 400 }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-slate-500" style={{ fontSize: "13px" }}>
          Showing <span className="text-slate-900" style={{ fontWeight: 600 }}>{visibleUsers.length}</span> of{" "}
          <span className="text-slate-900" style={{ fontWeight: 600 }}>{filteredUsers.length}</span> members
        </p>
        <p className="text-slate-400" style={{ fontSize: "12px" }}>
          {acceptedSwaps.length} accepted exchange{acceptedSwaps.length === 1 ? "" : "s"}
        </p>
      </div>

      <div
        style={{ transform: `scale(${zoom})`, transformOrigin: "top left", width: zoom < 1 ? `${100 / zoom}%` : "100%" }}
        className="transition-transform duration-300"
      >
        {visibleUsers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visibleUsers.map((member) => (
              <UserCard
                key={member.id}
                user={member}
                defaultSkillOffered={user?.skillsOffered[0]?.name}
                onRequest={(id) => setRequestedUsers((prev) => new Set([...prev, id]))}
                isRequested={requestedUsers.has(member.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 mb-2" style={{ fontSize: "16px", fontWeight: 600 }}>No users found</p>
            <p className="text-slate-400" style={{ fontSize: "14px" }}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {hasMore && (
        <div ref={loaderRef} className="mt-8 text-center">
          <button
            onClick={loadMore}
            className="px-8 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition-all"
            style={{ fontSize: "14px" }}
          >
            Load More Members
          </button>
        </div>
      )}
    </div>
  );
}
