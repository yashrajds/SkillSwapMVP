import { useState } from "react";
import { Bell, Shield, Eye, Globe, Palette, ChevronRight, Check, Moon, Sun, Monitor, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 ${checked ? "bg-indigo-600" : "bg-slate-200"}`}
      style={{ width: 40, height: 22 }}
    >
      <div
        className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
        style={{ width: 18, height: 18, transform: checked ? "translateX(18px)" : "translateX(2px)" }}
      />
    </button>
  );
}

export function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Notification settings
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifRequests, setNotifRequests] = useState(true);
  const [notifMatches, setNotifMatches] = useState(true);
  const [notifMessages, setNotifMessages] = useState(false);

  // Privacy settings
  const [profilePublic, setProfilePublic] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [showLocation, setShowLocation] = useState(true);
  const [allowRequests, setAllowRequests] = useState(true);

  // Appearance
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [language, setLanguage] = useState("English");

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="p-6 max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-1" style={{ fontSize: "24px", fontWeight: 700 }}>
          Settings
        </h1>
        <p className="text-slate-500" style={{ fontSize: "14px" }}>
          Manage your account preferences and privacy settings.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-6 text-amber-800" style={{ fontSize: "13px", lineHeight: "1.5" }}>
        These controls are part of the MVP experience. They currently save in the browser UI only and are not synced to the backend yet.
      </div>

      {/* Section: Notifications */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
            <Bell className="w-4.5 h-4.5 text-indigo-600" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h2 className="text-slate-900" style={{ fontSize: "15px", fontWeight: 600 }}>Notifications</h2>
            <p className="text-slate-400" style={{ fontSize: "12px" }}>Control how you receive updates</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: "Email notifications", desc: "Receive updates via email", value: notifEmail, onChange: setNotifEmail },
            { label: "Push notifications", desc: "Browser push notifications", value: notifPush, onChange: setNotifPush },
            { label: "Exchange requests", desc: "When someone sends you a request", value: notifRequests, onChange: setNotifRequests },
            { label: "New matches", desc: "When new skill matches are found", value: notifMatches, onChange: setNotifMatches },
            { label: "Messages", desc: "When you receive a new message", value: notifMessages, onChange: setNotifMessages },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1">
              <div>
                <p className="text-slate-700" style={{ fontSize: "14px", fontWeight: 500 }}>{item.label}</p>
                <p className="text-slate-400" style={{ fontSize: "12px" }}>{item.desc}</p>
              </div>
              <Toggle checked={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>
      </div>

      {/* Section: Privacy */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-green-600" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h2 className="text-slate-900" style={{ fontSize: "15px", fontWeight: 600 }}>Privacy</h2>
            <p className="text-slate-400" style={{ fontSize: "12px" }}>Control who sees your information</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: "Public profile", desc: "Allow others to view your profile", value: profilePublic, onChange: setProfilePublic },
            { label: "Show email address", desc: "Display your email on your profile", value: showEmail, onChange: setShowEmail },
            { label: "Show location", desc: "Display your city/state", value: showLocation, onChange: setShowLocation },
            { label: "Allow exchange requests", desc: "Let others send you skill requests", value: allowRequests, onChange: setAllowRequests },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-1">
              <div>
                <p className="text-slate-700" style={{ fontSize: "14px", fontWeight: 500 }}>{item.label}</p>
                <p className="text-slate-400" style={{ fontSize: "12px" }}>{item.desc}</p>
              </div>
              <Toggle checked={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>
      </div>

      {/* Section: Appearance */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-4">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center">
            <Palette className="w-4.5 h-4.5 text-violet-600" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h2 className="text-slate-900" style={{ fontSize: "15px", fontWeight: 600 }}>Appearance</h2>
            <p className="text-slate-400" style={{ fontSize: "12px" }}>Customize your interface</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-slate-700 mb-3" style={{ fontSize: "14px", fontWeight: 500 }}>Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: "light", icon: <Sun className="w-4 h-4" />, label: "Light" },
                { value: "dark", icon: <Moon className="w-4 h-4" />, label: "Dark" },
                { value: "system", icon: <Monitor className="w-4 h-4" />, label: "System" },
              ] as const).map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all ${
                    theme === t.value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                  style={{ fontSize: "13px" }}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-slate-700" style={{ fontSize: "14px", fontWeight: 500 }}>Language</p>
              <p className="text-slate-400" style={{ fontSize: "12px" }}>Interface language</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
                style={{ fontSize: "13px" }}
              >
                {["English", "Spanish", "French", "German", "Portuguese", "Japanese"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Account */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
            <Eye className="w-4.5 h-4.5 text-slate-600" style={{ width: 18, height: 18 }} />
          </div>
          <div>
            <h2 className="text-slate-900" style={{ fontSize: "15px", fontWeight: 600 }}>Account</h2>
            <p className="text-slate-400" style={{ fontSize: "12px" }}>Manage your account</p>
          </div>
        </div>

        <div className="space-y-1">
          {[
            { label: "Change password", desc: "Update your login password" },
            { label: "Connected accounts", desc: "Google, GitHub integrations" },
            { label: "Export data", desc: "Download all your SkillSwap data" },
          ].map((item) => (
            <button
              key={item.label}
              className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="text-left">
                <p className="text-slate-700" style={{ fontSize: "14px", fontWeight: 500 }}>{item.label}</p>
                <p className="text-slate-400" style={{ fontSize: "12px" }}>{item.desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </button>
          ))}

          <div className="pt-3 mt-2 border-t border-slate-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
              style={{ fontSize: "14px", fontWeight: 500 }}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
          saved
            ? "bg-green-500 text-white"
            : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700"
        } shadow-md`}
        style={{ fontSize: "15px", fontWeight: 600 }}
      >
        {saved ? (
          <>
            <Check className="w-4 h-4" />
            Settings Saved!
          </>
        ) : (
          "Save Changes"
        )}
      </button>
    </div>
  );
}
