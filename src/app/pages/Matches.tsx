import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, MapPin, MessageCircle, Users, X, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getApiError } from "../services/api";
import { SKILL_LEVEL_COLORS } from "../services/mockData";
import { swapService } from "../services/swapService";
import { userService } from "../services/userService";
import type { User } from "../services/types";

interface Match {
  user: User;
  commonOffered: string[];
  commonWanted: string[];
  score: number;
}

export function Matches() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<"matches" | "suggestions">("matches");
  const [accepted, setAccepted] = useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (loadError) {
        setError(getApiError(loadError, "Unable to load matches."));
      }
    };

    void loadUsers();
  }, []);

  const myOfferedNames = user?.skillsOffered.map((skill) => skill.name) ?? [];
  const myWantedNames = user?.skillsWanted ?? [];

  const matches: Match[] = useMemo(
    () =>
      users
        .filter((member) => !dismissed.has(member.id))
        .map((member) => {
          const theyOffer = member.skillsOffered.map((skill) => skill.name);
          const theyWant = member.skillsWanted;
          const commonOffered = theyOffer.filter((skill) => myWantedNames.includes(skill));
          const commonWanted = theyWant.filter((skill) => myOfferedNames.includes(skill));
          const score = commonOffered.length + commonWanted.length;
          return { user: member, commonOffered, commonWanted, score };
        })
        .filter((match) => match.score > 0)
        .sort((a, b) => b.score - a.score),
    [dismissed, myOfferedNames, myWantedNames, users]
  );

  const suggestions = useMemo(
    () =>
      users
        .filter((member) => !dismissed.has(member.id) && !matches.find((match) => match.user.id === member.id))
        .slice(0, 6),
    [dismissed, matches, users]
  );

  const displayMatches = activeTab === "matches"
    ? matches
    : suggestions.map((member) => ({ user: member, commonOffered: [], commonWanted: [], score: 0 }));

  const handleConnect = async (member: User) => {
    await swapService.createSwap({
      receiverId: member.id,
      skillOffered: myOfferedNames[0] || member.skillsWanted[0] || "Skill Exchange",
      skillRequested: member.skillsOffered[0]?.name || member.skillsWanted[0] || "Skill Exchange",
      message: `Hi ${member.name}, I think we'd be a great skill match.`,
    });
    setAccepted((prev) => new Set([...prev, member.id]));
  };

  return (
    <div className="p-6 max-w-screen-xl">
      <div className="mb-8">
        <h1 className="text-slate-900 mb-1" style={{ fontSize: "24px", fontWeight: 700 }}>
          My Matches
        </h1>
        <p className="text-slate-500" style={{ fontSize: "14px" }}>
          People who can teach you what you want to learn and want to learn what you teach.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 mb-6" style={{ fontSize: "13px" }}>
          {error}
        </div>
      )}

      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-2xl p-6 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-indigo-200 mb-1" style={{ fontSize: "13px" }}>Skill Match Score</p>
            <p className="text-white mb-2" style={{ fontSize: "36px", fontWeight: 700 }}>
              {matches.length} <span style={{ fontSize: "18px", fontWeight: 400 }}>matches found</span>
            </p>
            <p className="text-indigo-200" style={{ fontSize: "13px" }}>
              Based on your {myOfferedNames.length} offered skills and {myWantedNames.length} learning goals
            </p>
          </div>
          <div className="hidden md:flex w-20 h-20 bg-white/20 rounded-2xl items-center justify-center backdrop-blur-sm">
            <Zap className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>

      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-6">
        {(["matches", "suggestions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg transition-all capitalize ${
              activeTab === tab
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
            style={{ fontSize: "13px", fontWeight: activeTab === tab ? 600 : 400 }}
          >
            {tab} {tab === "matches" && `(${matches.length})`}
          </button>
        ))}
      </div>

      {displayMatches.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-indigo-400" />
          </div>
          <p className="text-slate-600 mb-1" style={{ fontSize: "16px", fontWeight: 600 }}>
            No {activeTab} yet
          </p>
          <p className="text-slate-400" style={{ fontSize: "14px" }}>
            Add more skills to your profile to find better matches.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayMatches.map(({ user: member, commonOffered, commonWanted, score }) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-indigo-100/50 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
              <div className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="relative flex-shrink-0">
                    <img
                      src={member.profilePic}
                      alt={member.name}
                      className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-100"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-slate-900 truncate" style={{ fontSize: "15px", fontWeight: 600 }}>
                      {member.name}
                    </h3>
                    {member.location && (
                      <div className="flex items-center gap-1 text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span style={{ fontSize: "12px" }}>{member.location}</span>
                      </div>
                    )}
                    {score > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex gap-0.5">
                          {[...Array(Math.min(score, 5))].map((_, index) => (
                            <div key={index} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                          ))}
                          {[...Array(Math.max(0, 5 - score))].map((_, index) => (
                            <div key={index} className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                          ))}
                        </div>
                        <span className="text-indigo-500" style={{ fontSize: "11px", fontWeight: 500 }}>
                          {score} skill match
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {(commonOffered.length > 0 || commonWanted.length > 0) && (
                  <div className="bg-indigo-50 rounded-xl p-3 mb-4 space-y-2">
                    {commonOffered.length > 0 && (
                      <div>
                        <p className="text-indigo-500 mb-1" style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase" }}>
                          They can teach you
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {commonOffered.map((skill) => (
                            <span key={skill} className="px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-700" style={{ fontSize: "11px" }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {commonWanted.length > 0 && (
                      <div>
                        <p className="text-violet-500 mb-1" style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase" }}>
                          You can teach them
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {commonWanted.map((skill) => (
                            <span key={skill} className="px-2 py-0.5 rounded-lg bg-violet-100 text-violet-700" style={{ fontSize: "11px" }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-slate-400 mb-1.5" style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    All Skills Offered
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {member.skillsOffered.slice(0, 3).map((skill) => (
                      <span key={skill.name} className={`px-2 py-0.5 rounded-lg ${SKILL_LEVEL_COLORS[skill.level] || "bg-slate-100 text-slate-600"}`} style={{ fontSize: "11px" }}>
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {accepted.has(member.id) ? (
                    <button
                      disabled
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 text-green-600 border border-green-200"
                      style={{ fontSize: "13px" }}
                    >
                      <Check className="w-4 h-4" />
                      Connected
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => void handleConnect(member)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 transition-all shadow-sm"
                        style={{ fontSize: "13px", fontWeight: 500 }}
                      >
                        Connect
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDismissed((prev) => new Set([...prev, member.id]))}
                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
