import { useEffect, useState } from "react";
import { Check, X, Clock, ArrowLeftRight, Send, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getApiError } from "../services/api";
import { swapService } from "../services/swapService";
import type { SwapRequest } from "../services/types";

type StatusFilter = "all" | "pending" | "accepted" | "rejected";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: <Clock className="w-3.5 h-3.5" />,
    className: "bg-amber-50 text-amber-600 border-amber-200",
  },
  accepted: {
    label: "Accepted",
    icon: <Check className="w-3.5 h-3.5" />,
    className: "bg-green-50 text-green-600 border-green-200",
  },
  rejected: {
    label: "Rejected",
    icon: <X className="w-3.5 h-3.5" />,
    className: "bg-red-50 text-red-600 border-red-200",
  },
};

export function Requests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<SwapRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">("incoming");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSwaps = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await swapService.getSwaps();
        setRequests(data);
      } catch (loadError) {
        setError(getApiError(loadError, "Unable to load requests."));
      } finally {
        setIsLoading(false);
      }
    };

    void loadSwaps();
  }, []);

  const currentUserId = user?.id || "";
  const incoming = requests.filter((r) => r.receiverId === currentUserId);
  const outgoing = requests.filter((r) => r.senderId === currentUserId);
  const displayed = activeTab === "incoming" ? incoming : outgoing;

  const filtered = displayed.filter(
    (r) => statusFilter === "all" || r.status === statusFilter
  );

  const pendingCount = incoming.filter((r) => r.status === "pending").length;

  const updateStatus = async (id: string, status: "accepted" | "rejected") => {
    try {
      setError("");
      const updated = await swapService.updateSwapStatus(id, status);
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (updateError) {
      setError(getApiError(updateError, "Unable to update request status."));
    }
  };

  const counts = {
    all: displayed.length,
    pending: displayed.filter((r) => r.status === "pending").length,
    accepted: displayed.filter((r) => r.status === "accepted").length,
    rejected: displayed.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="p-6 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-slate-900 mb-1" style={{ fontSize: "24px", fontWeight: 700 }}>
          Exchange Requests
        </h1>
        <p className="text-slate-500" style={{ fontSize: "14px" }}>
          Manage your skill exchange requests and collaborations.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 mb-6" style={{ fontSize: "13px" }}>
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400" style={{ fontSize: "14px" }}>
          Loading requests...
        </div>
      ) : (
        <>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Pending", value: incoming.filter((r) => r.status === "pending").length, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Accepted", value: requests.filter((r) => r.status === "accepted").length, color: "text-green-600", bg: "bg-green-50" },
          { label: "Total", value: requests.length, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 p-4 text-center">
            <p className={`${s.color} mb-1`} style={{ fontSize: "24px", fontWeight: 700 }}>{s.value}</p>
            <p className="text-slate-400" style={{ fontSize: "12px" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit mb-6">
        <button
          onClick={() => setActiveTab("incoming")}
          className={`px-5 py-2 rounded-lg transition-all flex items-center gap-2 ${
            activeTab === "incoming" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"
          }`}
          style={{ fontSize: "13px", fontWeight: activeTab === "incoming" ? 600 : 400 }}
        >
          Incoming
          {pendingCount > 0 && (
            <span className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center" style={{ fontSize: "10px" }}>
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("outgoing")}
          className={`px-5 py-2 rounded-lg transition-all flex items-center gap-2 ${
            activeTab === "outgoing" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"
          }`}
          style={{ fontSize: "13px", fontWeight: activeTab === "outgoing" ? 600 : 400 }}
        >
          Outgoing
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Status filter pills */}
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "accepted", "rejected"] as StatusFilter[]).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
              statusFilter === s
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            style={{ fontSize: "12px" }}
          >
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Request cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ArrowLeftRight className="w-7 h-7 text-slate-400" />
          </div>
          <p className="text-slate-600 mb-1" style={{ fontSize: "15px", fontWeight: 600 }}>
            No {statusFilter !== "all" ? statusFilter : ""} requests
          </p>
          <p className="text-slate-400" style={{ fontSize: "13px" }}>
            {activeTab === "incoming"
              ? "When others request exchanges with you, they'll appear here."
              : "Your outgoing requests will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => {
            const isIncoming = req.receiverId === currentUserId;
            const other = isIncoming
              ? { name: req.senderName, pic: req.senderPic }
              : { name: req.receiverName, pic: req.receiverPic };
            const cfg = STATUS_CONFIG[req.status];
            const isExpanded = expandedId === req.id;

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition-all"
              >
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : req.id)}
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={other.pic}
                      alt={other.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-slate-900" style={{ fontSize: "14px", fontWeight: 600 }}>
                          {other.name}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border ${cfg.className}`}
                          style={{ fontSize: "11px" }}
                        >
                          {cfg.icon}
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500" style={{ fontSize: "12px" }}>
                        <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg">{req.skillOffered}</span>
                        <ArrowLeftRight className="w-3 h-3" />
                        <span className="bg-violet-50 text-violet-600 px-2 py-0.5 rounded-lg">{req.skillRequested}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-slate-400" style={{ fontSize: "11px" }}>
                        {new Date(req.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-100 p-4 bg-slate-50">
                    <p className="text-slate-500 mb-4 italic" style={{ fontSize: "13px" }}>
                      "{req.message}"
                    </p>

                    {isIncoming && req.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(req.id, "accepted")}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all"
                          style={{ fontSize: "13px", fontWeight: 500 }}
                        >
                          <Check className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(req.id, "rejected")}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                          style={{ fontSize: "13px" }}
                        >
                          <X className="w-4 h-4" />
                          Decline
                        </button>
                      </div>
                    )}

                    {req.status === "accepted" && (
                      <div className="flex items-center gap-2 text-green-600" style={{ fontSize: "13px" }}>
                        <Check className="w-4 h-4" />
                        Exchange accepted — start chatting!
                      </div>
                    )}

                    {req.status === "rejected" && (
                      <div className="flex items-center gap-2 text-red-400" style={{ fontSize: "13px" }}>
                        <X className="w-4 h-4" />
                        This request was declined.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
        </>
      )}
    </div>
  );
}
