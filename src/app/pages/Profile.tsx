import { useEffect, useState } from "react";
import { Edit3, MapPin, Calendar, Zap, Plus, X, Check, Camera } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ALL_SKILLS, SKILL_LEVEL_COLORS } from "../services/mockData";

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

export function Profile() {
  const { user, updateUser } = useAuth();
  const [error, setError] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editBio, setEditBio] = useState(user?.bio ?? "");
  const [editName, setEditName] = useState(user?.name ?? "");
  const [editLocation, setEditLocation] = useState(user?.location ?? "");

  // Skills offered editing
  const [editingSkills, setEditingSkills] = useState(false);
  const [offeredSkills, setOfferedSkills] = useState(user?.skillsOffered ?? []);
  const [skillSearch, setSkillSearch] = useState("");
  const [showSkillDrop, setShowSkillDrop] = useState<number | null>(null);

  // Skills wanted editing
  const [editingWanted, setEditingWanted] = useState(false);
  const [wantedSkills, setWantedSkills] = useState<string[]>(user?.skillsWanted ?? []);
  const [wantedSearch, setWantedSearch] = useState("");

  useEffect(() => {
    setEditBio(user?.bio ?? "");
    setEditName(user?.name ?? "");
    setEditLocation(user?.location ?? "");
    setOfferedSkills(user?.skillsOffered ?? []);
    setWantedSkills(user?.skillsWanted ?? []);
  }, [user]);

  const handleSaveBio = async () => {
    setError("");
    const result = await updateUser({ bio: editBio, name: editName, location: editLocation });
    if (result.success) setIsEditingBio(false);
    else setError(result.error || "Unable to save profile details.");
  };

  const handleSaveSkills = async () => {
    setError("");
    const result = await updateUser({ skillsOffered: offeredSkills });
    if (result.success) setEditingSkills(false);
    else setError(result.error || "Unable to save skills offered.");
  };

  const handleSaveWanted = async () => {
    setError("");
    const result = await updateUser({ skillsWanted: wantedSkills });
    if (result.success) setEditingWanted(false);
    else setError(result.error || "Unable to save learning goals.");
  };

  const addOffered = () => {
    setOfferedSkills([...offeredSkills, { name: "", level: "Intermediate", experience: "" }]);
  };

  const removeOffered = (idx: number) => {
    setOfferedSkills(offeredSkills.filter((_, i) => i !== idx));
  };

  const updateOffered = (idx: number, field: string, value: string) => {
    const updated = [...offeredSkills];
    updated[idx] = { ...updated[idx], [field]: value };
    setOfferedSkills(updated);
  };

  const filteredSkills = ALL_SKILLS.filter((s) =>
    s.toLowerCase().includes(skillSearch.toLowerCase())
  );

  const filteredWanted = ALL_SKILLS.filter(
    (s) =>
      s.toLowerCase().includes(wantedSearch.toLowerCase()) &&
      !wantedSkills.includes(s)
  );

  if (!user) return null;

  return (
    <div className="p-6 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-1" style={{ fontSize: "24px", fontWeight: 700 }}>
          My Profile
        </h1>
        <p className="text-slate-500" style={{ fontSize: "14px" }}>
          Manage your public profile and skill information.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 mb-6" style={{ fontSize: "13px" }}>
          {error}
        </div>
      )}

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden mb-6">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.07%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end gap-4 -mt-10 mb-5">
            <div className="relative">
              <img
                src={user.profilePic}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white shadow-lg"
              />
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-md">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-slate-900" style={{ fontSize: "20px", fontWeight: 700 }}>
                    {user.name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1">
                    {user.location && (
                      <span className="flex items-center gap-1 text-slate-400" style={{ fontSize: "12px" }}>
                        <MapPin className="w-3 h-3" />
                        {user.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-slate-400" style={{ fontSize: "12px" }}>
                      <Calendar className="w-3 h-3" />
                      Joined {new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1 text-indigo-500" style={{ fontSize: "12px" }}>
                      <Zap className="w-3 h-3" />
                      {user.matchCount} matches
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all"
                  style={{ fontSize: "12px" }}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Bio */}
          {isEditingBio ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1" style={{ fontSize: "12px" }}>Full Name</label>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{ fontSize: "13px" }}
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1" style={{ fontSize: "12px" }}>Location</label>
                  <input
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    placeholder="City, State"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    style={{ fontSize: "13px" }}
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1" style={{ fontSize: "12px" }}>Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  style={{ fontSize: "13px" }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveBio}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
                  style={{ fontSize: "13px", fontWeight: 500 }}
                >
                  <Check className="w-3.5 h-3.5" />
                  Save
                </button>
                <button
                  onClick={() => setIsEditingBio(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                  style={{ fontSize: "13px" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-slate-600" style={{ fontSize: "14px", lineHeight: "1.6" }}>
              {user.bio || "Add a bio to tell the community about yourself."}
            </p>
          )}
        </div>
      </div>

      {/* Skills Offered */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900" style={{ fontSize: "15px", fontWeight: 600 }}>
            Skills I Offer
          </h3>
          <button
            onClick={() => editingSkills ? handleSaveSkills() : setEditingSkills(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              editingSkills
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600"
            }`}
            style={{ fontSize: "12px" }}
          >
            {editingSkills ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            {editingSkills ? "Save" : "Edit"}
          </button>
        </div>

        {editingSkills ? (
          <div className="space-y-3">
            {offeredSkills.map((skill, idx) => (
              <div key={idx} className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-slate-600" style={{ fontSize: "12px", fontWeight: 500 }}>Skill #{idx + 1}</p>
                  {offeredSkills.length > 1 && (
                    <button
                      onClick={() => removeOffered(idx)}
                      className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      value={skill.name}
                      onChange={(e) => {
                        updateOffered(idx, "name", e.target.value);
                        setSkillSearch(e.target.value);
                        setShowSkillDrop(idx);
                      }}
                      onFocus={() => setShowSkillDrop(idx)}
                      onBlur={() => setTimeout(() => setShowSkillDrop(null), 200)}
                      placeholder="Skill name"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      style={{ fontSize: "13px" }}
                    />
                    {showSkillDrop === idx && skillSearch && filteredSkills.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-36 overflow-y-auto">
                        {filteredSkills.slice(0, 5).map((s) => (
                          <button
                            key={s}
                            onMouseDown={() => { updateOffered(idx, "name", s); setShowSkillDrop(null); }}
                            className="w-full text-left px-3 py-2 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                            style={{ fontSize: "13px" }}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={skill.level}
                      onChange={(e) => updateOffered(idx, "level", e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      style={{ fontSize: "12px" }}
                    >
                      {SKILL_LEVELS.map((l) => <option key={l}>{l}</option>)}
                    </select>
                    <input
                      value={skill.experience}
                      onChange={(e) => updateOffered(idx, "experience", e.target.value)}
                      placeholder="e.g. 2 years"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      style={{ fontSize: "12px" }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {offeredSkills.length < 6 && (
              <button
                onClick={addOffered}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                style={{ fontSize: "13px" }}
              >
                <Plus className="w-3.5 h-3.5" />
                Add Skill
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {user.skillsOffered.length === 0 ? (
              <p className="text-slate-400" style={{ fontSize: "13px" }}>No skills added yet.</p>
            ) : (
              user.skillsOffered.map((s) => (
                <div key={s.name} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${SKILL_LEVEL_COLORS[s.level] || "bg-slate-100 text-slate-600"}`}>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{s.name}</span>
                  <span className="opacity-60" style={{ fontSize: "11px" }}>| {s.level} | {s.experience}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Skills Wanted */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-900" style={{ fontSize: "15px", fontWeight: 600 }}>
            Skills I Want to Learn
          </h3>
          <button
            onClick={() => editingWanted ? handleSaveWanted() : setEditingWanted(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
              editingWanted
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "border-slate-200 text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600"
            }`}
            style={{ fontSize: "12px" }}
          >
            {editingWanted ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            {editingWanted ? "Save" : "Edit"}
          </button>
        </div>

        {editingWanted ? (
          <div className="space-y-3">
            <input
              value={wantedSearch}
              onChange={(e) => setWantedSearch(e.target.value)}
              placeholder="Search skills to add..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              style={{ fontSize: "13px" }}
            />
            {wantedSearch && (
              <div className="flex flex-wrap gap-2">
                {filteredWanted.slice(0, 8).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      if (wantedSkills.length < 10) {
                        setWantedSkills([...wantedSkills, s]);
                        setWantedSearch("");
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-700 transition-all"
                    style={{ fontSize: "12px" }}
                  >
                    + {s}
                  </button>
                ))}
              </div>
            )}
            {wantedSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                {wantedSkills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-100 text-violet-700"
                    style={{ fontSize: "12px" }}
                  >
                    {s}
                    <button
                      onClick={() => setWantedSkills(wantedSkills.filter((x) => x !== s))}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {user.skillsWanted.length === 0 ? (
              <p className="text-slate-400" style={{ fontSize: "13px" }}>No learning goals added yet.</p>
            ) : (
              user.skillsWanted.map((s) => (
                <span key={s} className="px-3 py-1.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100" style={{ fontSize: "13px" }}>
                  {s}
                </span>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
