import { useEffect, useState } from "react";
import { MapPin, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { swapService } from "../services/swapService";
import type { User } from "../services/types";
import { SKILL_LEVEL_COLORS } from "../services/mockData";

interface UserCardProps {
  user: User;
  onRequest?: (userId: string) => void;
  isRequested?: boolean;
  defaultSkillOffered?: string;
}

export function UserCard({ user, onRequest, isRequested = false, defaultSkillOffered }: UserCardProps) {
  const [requested, setRequested] = useState(isRequested);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setRequested(isRequested);
  }, [isRequested]);

  const handleRequest = async () => {
    const requestedSkill = user.skillsWanted[0];
    const offeredSkill = defaultSkillOffered || user.skillsOffered[0]?.name;

    if (!requestedSkill || !offeredSkill) return;

    await swapService.createSwap({
      receiverId: user.id,
      skillOffered: offeredSkill,
      skillRequested: requestedSkill,
      message: `Hi ${user.name}, I'd love to exchange ${offeredSkill} for ${requestedSkill}.`,
    });

    setRequested(true);
    onRequest?.(user.id);
  };

  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="relative flex-shrink-0">
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-200 transition-all"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-slate-900 truncate" style={{ fontSize: "15px", fontWeight: 600 }}>
              {user.name}
            </h3>
            {user.location && (
              <div className="flex items-center gap-1 text-slate-400 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span style={{ fontSize: "12px" }}>{user.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-indigo-500 mt-1">
              <Zap className="w-3 h-3" />
              <span style={{ fontSize: "11px", fontWeight: 500 }}>{user.matchCount} matches</span>
            </div>
          </div>
        </div>

        <p className="text-slate-500 mb-4 line-clamp-2" style={{ fontSize: "12px", lineHeight: "1.5" }}>
          {user.bio}
        </p>

        <div className="mb-3">
          <p className="text-slate-400 mb-1.5" style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Offers
          </p>
          <div className="flex flex-wrap gap-1">
            {user.skillsOffered.slice(0, 2).map((skill) => (
              <span
                key={skill.name}
                className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs ${SKILL_LEVEL_COLORS[skill.level] || "bg-slate-100 text-slate-600"}`}
                style={{ fontSize: "11px" }}
              >
                {skill.name}
              </span>
            ))}
            {user.skillsOffered.length > 2 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500" style={{ fontSize: "11px" }}>
                +{user.skillsOffered.length - 2}
              </span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-slate-400 mb-1.5" style={{ fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Wants to Learn
          </p>
          <div className="flex flex-wrap gap-1">
            {user.skillsWanted.slice(0, 2).map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2 py-0.5 rounded-lg bg-violet-50 text-violet-600"
                style={{ fontSize: "11px" }}
              >
                {skill}
              </span>
            ))}
            {user.skillsWanted.length > 2 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500" style={{ fontSize: "11px" }}>
                +{user.skillsWanted.length - 2}
              </span>
            )}
          </div>
        </div>

        {requested ? (
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 text-green-600 border border-green-200 transition-all"
            style={{ fontSize: "13px" }}
          >
            <CheckCircle className="w-4 h-4" />
            Request Sent
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              void handleRequest();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 transition-all shadow-sm hover:shadow-indigo-200 hover:shadow-md"
            style={{ fontSize: "13px", fontWeight: 500 }}
          >
            Request Exchange
            <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`} />
          </button>
        )}
      </div>
    </div>
  );
}
