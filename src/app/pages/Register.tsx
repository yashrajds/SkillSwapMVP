import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, ArrowRight, Check, Plus, X, Zap } from "lucide-react";
import { useAuth, type RegisterData } from "../context/AuthContext";
import { ALL_SKILLS } from "../services/mockData";

const TOTAL_STEPS = 3;
const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

interface OfferedSkill {
  name: string;
  level: string;
  experience: string;
}

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [offeredSkills, setOfferedSkills] = useState<OfferedSkill[]>([
    { name: "", level: "Intermediate", experience: "" },
  ]);
  const [skillSearch, setSkillSearch] = useState("");
  const [showSkillDropdown, setShowSkillDropdown] = useState<number | null>(null);
  const [wantedSkills, setWantedSkills] = useState<string[]>([]);
  const [wantedSearch, setWantedSearch] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredSkills = ALL_SKILLS.filter((skill) => skill.toLowerCase().includes(skillSearch.toLowerCase()));
  const filteredWanted = ALL_SKILLS.filter(
    (skill) => skill.toLowerCase().includes(wantedSearch.toLowerCase()) && !wantedSkills.includes(skill)
  );

  const validateStep1 = () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = "Name is required";
    if (!email.trim() || !email.includes("@")) nextErrors.email = "Valid email is required";
    if (password.length < 6) nextErrors.password = "Password must be at least 6 characters";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const validateStep2 = () => {
    const valid = offeredSkills.some((skill) => skill.name && skill.experience);
    setErrors(valid ? {} : { skills: "Add at least one complete skill" });
    return valid;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const handleSubmit = async () => {
    if (wantedSkills.length === 0) {
      setSubmitError("Select at least one skill you want to learn.");
      return;
    }

    setIsLoading(true);
    setSubmitError("");

    const data: RegisterData = {
      name,
      email,
      password,
      bio,
      skillsOffered: offeredSkills.filter((skill) => skill.name && skill.experience),
      skillsWanted,
    };

    const result = await register(data);
    setIsLoading(false);

    if (result.success) {
      navigate("/dashboard");
      return;
    }

    setSubmitError(result.error || "Unable to create account.");
  };

  const addOfferedSkill = () => {
    setOfferedSkills([...offeredSkills, { name: "", level: "Intermediate", experience: "" }]);
  };

  const removeOfferedSkill = (idx: number) => {
    setOfferedSkills(offeredSkills.filter((_, index) => index !== idx));
  };

  const updateOfferedSkill = (idx: number, field: keyof OfferedSkill, value: string) => {
    const updated = [...offeredSkills];
    updated[idx] = { ...updated[idx], [field]: value };
    setOfferedSkills(updated);
  };

  const addWantedSkill = (skill: string) => {
    if (!wantedSkills.includes(skill) && wantedSkills.length < 8) {
      setWantedSkills([...wantedSkills, skill]);
      setWantedSearch("");
    }
  };

  const removeWantedSkill = (skill: string) => {
    setWantedSkills(wantedSkills.filter((item) => item !== skill));
  };

  const stepLabels = ["Basic Info", "Skills Offered", "Skills Wanted"];

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="hidden lg:flex lg:w-80 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-white" style={{ fontSize: "22px", fontWeight: 700 }}>
              SkillSwap
            </span>
          </div>

          <div className="space-y-4">
            {stepLabels.map((label, idx) => {
              const stepNum = idx + 1;
              const isCompleted = step > stepNum;
              const isCurrent = step === stepNum;

              return (
                <div key={label} className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isCompleted ? "bg-green-400" : isCurrent ? "bg-white" : "bg-white/20"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <span
                        className={isCurrent ? "text-indigo-700" : "text-white/60"}
                        style={{ fontSize: "14px", fontWeight: 700 }}
                      >
                        {stepNum}
                      </span>
                    )}
                  </div>
                  <div>
                    <p
                      className={isCurrent ? "text-white" : isCompleted ? "text-white/70" : "text-white/40"}
                      style={{ fontSize: "14px", fontWeight: isCurrent ? 600 : 400 }}
                    >
                      {label}
                    </p>
                    {isCurrent && (
                      <p className="text-indigo-200" style={{ fontSize: "11px" }}>
                        Current step
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-indigo-300" style={{ fontSize: "12px" }}>
            Already have an account?{" "}
            <Link to="/login" className="text-white hover:underline" style={{ fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center py-12 px-6 overflow-auto">
        <div className="w-full max-w-lg">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-slate-900" style={{ fontSize: "20px", fontWeight: 700 }}>
              SkillSwap
            </span>
          </div>

          <div className="lg:hidden flex gap-2 mb-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className={`h-1.5 flex-1 rounded-full transition-all ${item <= step ? "bg-indigo-600" : "bg-slate-200"}`}
              />
            ))}
          </div>

          <div className="mb-8">
            <p
              className="text-indigo-500 mb-1"
              style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}
            >
              Step {step} of {TOTAL_STEPS}
            </p>
            <h1 className="text-slate-900 mb-2" style={{ fontSize: "26px", fontWeight: 700 }}>
              {step === 1 ? "Create your account" : step === 2 ? "Skills you can offer" : "Skills you want to learn"}
            </h1>
            <p className="text-slate-500" style={{ fontSize: "14px" }}>
              {step === 1
                ? "Let's start with the basics."
                : step === 2
                  ? "Share what you're good at. This is what you'll teach others."
                  : "Tell us what you're looking to learn from the community."}
            </p>
          </div>

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 mb-4" style={{ fontSize: "13px" }}>
              {submitError}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <button
                type="button"
                disabled
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 transition-all disabled:opacity-80 disabled:cursor-not-allowed"
                style={{ fontSize: "14px", fontWeight: 500 }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google sign-up coming soon
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-slate-400" style={{ fontSize: "12px" }}>
                  or with email
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Smith"
                  className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.name ? "border-red-300" : "border-slate-200"}`}
                  style={{ fontSize: "14px" }}
                />
                {errors.name && <p className="text-red-500 mt-1" style={{ fontSize: "12px" }}>{errors.name}</p>}
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.email ? "border-red-300" : "border-slate-200"}`}
                  style={{ fontSize: "14px" }}
                />
                {errors.email && <p className="text-red-500 mt-1" style={{ fontSize: "12px" }}>{errors.email}</p>}
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className={`w-full px-4 py-3 rounded-xl border bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.password ? "border-red-300" : "border-slate-200"}`}
                  style={{ fontSize: "14px" }}
                />
                {errors.password && <p className="text-red-500 mt-1" style={{ fontSize: "12px" }}>{errors.password}</p>}
              </div>

              <div>
                <label className="block text-slate-700 mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>
                  Bio <span className="text-slate-400" style={{ fontWeight: 400 }}>(optional)</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the community a bit about yourself..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  style={{ fontSize: "14px" }}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              {errors.skills && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600" style={{ fontSize: "13px" }}>
                  {errors.skills}
                </div>
              )}

              {offeredSkills.map((skill, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-700" style={{ fontSize: "13px", fontWeight: 600 }}>
                      Skill #{idx + 1}
                    </p>
                    {offeredSkills.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeOfferedSkill(idx)}
                        className="w-6 h-6 rounded-full bg-slate-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <label className="block text-slate-500 mb-1" style={{ fontSize: "12px" }}>
                      Skill Name
                    </label>
                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        updateOfferedSkill(idx, "name", e.target.value);
                        setSkillSearch(e.target.value);
                        setShowSkillDropdown(idx);
                      }}
                      onFocus={() => setShowSkillDropdown(idx)}
                      onBlur={() => setTimeout(() => setShowSkillDropdown(null), 200)}
                      placeholder="e.g. React, Python, Design..."
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      style={{ fontSize: "13px" }}
                    />
                    {showSkillDropdown === idx && skillSearch && filteredSkills.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                        {filteredSkills.slice(0, 6).map((item) => (
                          <button
                            key={item}
                            type="button"
                            onMouseDown={() => {
                              updateOfferedSkill(idx, "name", item);
                              setShowSkillDropdown(null);
                            }}
                            className="w-full text-left px-3 py-2 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                            style={{ fontSize: "13px" }}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-500 mb-1" style={{ fontSize: "12px" }}>
                        Level
                      </label>
                      <select
                        value={skill.level}
                        onChange={(e) => updateOfferedSkill(idx, "level", e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        style={{ fontSize: "13px" }}
                      >
                        {SKILL_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-500 mb-1" style={{ fontSize: "12px" }}>
                        Experience
                      </label>
                      <input
                        type="text"
                        value={skill.experience}
                        onChange={(e) => updateOfferedSkill(idx, "experience", e.target.value)}
                        placeholder="e.g. 3 years"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        style={{ fontSize: "13px" }}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {offeredSkills.length < 5 && (
                <button
                  type="button"
                  onClick={addOfferedSkill}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                  style={{ fontSize: "13px" }}
                >
                  <Plus className="w-4 h-4" />
                  Add Another Skill
                </button>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-700 mb-1.5" style={{ fontSize: "13px", fontWeight: 500 }}>
                  Search skills you want to learn
                </label>
                <input
                  type="text"
                  value={wantedSearch}
                  onChange={(e) => setWantedSearch(e.target.value)}
                  placeholder="Search for a skill..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  style={{ fontSize: "14px" }}
                />
              </div>

              {wantedSearch && (
                <div className="bg-white rounded-2xl border border-slate-200 p-3">
                  <div className="flex flex-wrap gap-2">
                    {filteredWanted.slice(0, 10).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addWantedSkill(skill)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-700 transition-all"
                        style={{ fontSize: "12px" }}
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!wantedSearch && (
                <div>
                  <p className="text-slate-400 mb-2" style={{ fontSize: "12px", fontWeight: 500 }}>
                    Popular skills to learn:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Python", "UI/UX Design", "Machine Learning", "Digital Marketing", "Data Analysis", "Figma", "AWS", "Flutter", "Node.js"].map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => addWantedSkill(skill)}
                        disabled={wantedSkills.includes(skill)}
                        className={`px-3 py-1.5 rounded-xl transition-all ${
                          wantedSkills.includes(skill)
                            ? "bg-indigo-100 text-indigo-600 cursor-default"
                            : "bg-slate-100 text-slate-600 hover:bg-violet-100 hover:text-violet-700"
                        }`}
                        style={{ fontSize: "12px" }}
                      >
                        {wantedSkills.includes(skill) ? "Added: " : "+ "}
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {wantedSkills.length > 0 && (
                <div>
                  <p className="text-slate-600 mb-2" style={{ fontSize: "13px", fontWeight: 500 }}>
                    Selected ({wantedSkills.length}/8):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {wantedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-100 text-violet-700"
                        style={{ fontSize: "12px" }}
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeWantedSkill(skill)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {wantedSkills.length === 0 && (
                <p className="text-slate-400 text-center py-4" style={{ fontSize: "13px" }}>
                  Select at least one skill you want to learn
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
                style={{ fontSize: "14px" }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md"
                style={{ fontSize: "15px", fontWeight: 600 }}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md disabled:opacity-70"
                style={{ fontSize: "15px", fontWeight: 600 }}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <Zap className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>

          {step === 1 && (
            <p className="text-center text-slate-500 mt-4" style={{ fontSize: "13px" }}>
              Already have an account?{" "}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-700" style={{ fontWeight: 600 }}>
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
