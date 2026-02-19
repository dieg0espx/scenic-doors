"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Users, Trash2, ChevronDown, X, Plus, Save, KeyRound } from "lucide-react";
import type { AdminUser } from "@/lib/types";
import { deleteAdminUser, updateAdminUser, assignPassword, resetPassword } from "@/lib/actions/admin-users";
import CustomSelect from "@/components/admin/CustomSelect";

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "sales", label: "Sales Person" },
  { value: "manager", label: "Manager" },
  { value: "user", label: "User" },
  { value: "marketing", label: "Marketing" },
];

const roleLabel = (role: string) => ROLES.find((r) => r.value === role)?.label || role;

const roleColors: Record<string, string> = {
  admin: "bg-red-400/10 text-red-300",
  sales: "bg-violet-400/10 text-violet-300",
  manager: "bg-amber-400/10 text-amber-300",
  user: "bg-sky-400/10 text-sky-300",
  marketing: "bg-teal-400/10 text-teal-300",
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-400/10 text-emerald-300",
  inactive: "bg-gray-400/10 text-gray-300",
};

function parseTags(input: string): string[] {
  return input.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean);
}

interface UserStats {
  [userId: string]: { quotes: number; orders: number };
}

interface Props {
  users: AdminUser[];
  userStats?: UserStats;
}

/* ── Expandable User Card ─────────────────────────────── */
function UserCard({ user, stats, onRefresh }: { user: AdminUser; stats?: { quotes: number; orders: number }; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable fields
  const [name, setName] = useState(user.name);
  const [prefix, setPrefix] = useState(user.prefix || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [homeZipcode, setHomeZipcode] = useState(user.home_zipcode || "");
  const [role, setRole] = useState(user.role);
  const [startDate, setStartDate] = useState(user.start_date || "");
  const [locationCode, setLocationCode] = useState(user.location_code || "");
  const [zipInput, setZipInput] = useState("");
  const [zipcodes, setZipcodes] = useState<string[]>(user.zipcodes || []);
  const [refInput, setRefInput] = useState("");
  const [referralCodes, setReferralCodes] = useState<string[]>(user.referral_codes || []);

  function addZipcodes() {
    const tags = parseTags(zipInput);
    if (tags.length > 0) {
      setZipcodes((prev) => [...prev, ...tags.filter((t) => !prev.includes(t))]);
      setZipInput("");
    }
  }

  function addReferralCodes() {
    const tags = parseTags(refInput);
    if (tags.length > 0) {
      setReferralCodes((prev) => [...prev, ...tags.filter((t) => !prev.includes(t))]);
      setRefInput("");
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateAdminUser(user.id, {
        name,
        prefix: prefix || undefined,
        email: email || undefined,
        phone: phone || undefined,
        home_zipcode: homeZipcode || undefined,
        role,
        start_date: startDate || undefined,
        location_code: locationCode || undefined,
        zipcodes,
        referral_codes: referralCodes,
      });
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus() {
    const newStatus = user.status === "active" ? "inactive" : "active";
    if (!confirm(`${newStatus === "inactive" ? "Deactivate" : "Activate"} ${user.name}?`)) return;
    try {
      await updateAdminUser(user.id, { status: newStatus });
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  // Password
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  async function handleAssignPassword() {
    if (!user.email) {
      alert("User must have an email to assign a password.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }
    setPasswordLoading(true);
    try {
      const result = await assignPassword(user.id, newPassword);
      if (result.success) {
        alert(result.message);
        setNewPassword("");
        setShowPasswordInput(false);
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to assign password");
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!user.email) {
      alert("User must have an email to reset password.");
      return;
    }
    if (!confirm(`Send password reset email to ${user.email}?`)) return;
    try {
      const result = await resetPassword(user.id);
      if (result.success) {
        alert(result.message);
      } else {
        alert("Error: " + result.message);
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reset password");
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete ${user.name}? This cannot be undone.`)) return;
    try {
      await deleteAdminUser(user.id);
      onRefresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete user");
    }
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 transition-all";

  const hasChanges =
    name !== user.name ||
    prefix !== (user.prefix || "") ||
    email !== (user.email || "") ||
    phone !== (user.phone || "") ||
    homeZipcode !== (user.home_zipcode || "") ||
    role !== user.role ||
    startDate !== (user.start_date || "") ||
    locationCode !== (user.location_code || "") ||
    JSON.stringify(zipcodes) !== JSON.stringify(user.zipcodes || []) ||
    JSON.stringify(referralCodes) !== JSON.stringify(user.referral_codes || []);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
            <span className="text-violet-400 font-bold text-sm">{user.name.charAt(0)}</span>
          </div>
          <div className="text-left">
            <p className="text-white font-medium text-sm">{user.name}</p>
            {user.email && <p className="text-white/30 text-xs">{user.email}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${roleColors[user.role] || roleColors.sales}`}>
            {roleLabel(user.role)}
          </span>
          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize ${statusColors[user.status] || statusColors.active}`}>
            {user.status}
          </span>
          <ChevronDown className={`w-4 h-4 text-white/25 transition-transform ml-1 ${expanded ? "rotate-180" : ""}`} />
        </div>
      </button>

      {/* Expanded Body */}
      {expanded && (
        <div className="border-t border-white/[0.06] px-5 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Name */}
            <div>
              <label className="text-[11px] font-medium text-white/30 mb-1 block uppercase tracking-wider">Name</label>
              <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            {/* Prefix */}
            <div>
              <label className="text-[11px] font-medium text-white/30 mb-1 block uppercase tracking-wider">Prefix</label>
              <input className={inputClass} value={prefix} maxLength={4} onChange={(e) => setPrefix(e.target.value.toUpperCase())} />
            </div>

            {/* Zipcodes */}
            <div>
              <label className="text-[11px] font-medium text-white/30 mb-1 block uppercase tracking-wider">Zipcodes</label>
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  placeholder="Add zipcodes"
                  value={zipInput}
                  onChange={(e) => setZipInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addZipcodes())}
                />
                <button type="button" onClick={addZipcodes} className="px-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/40 hover:text-white/70 transition-colors cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {zipcodes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {zipcodes.map((z) => (
                    <span key={z} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-300 text-[11px]">
                      {z}
                      <button type="button" onClick={() => setZipcodes(zipcodes.filter((x) => x !== z))} className="cursor-pointer"><X className="w-2.5 h-2.5" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Referral Codes */}
            <div>
              <label className="text-[11px] font-medium text-white/30 mb-1 block uppercase tracking-wider">Referral Codes</label>
              <div className="flex gap-2">
                <input
                  className={inputClass}
                  placeholder="Add codes"
                  value={refInput}
                  onChange={(e) => setRefInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addReferralCodes())}
                />
                <button type="button" onClick={addReferralCodes} className="px-2 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/40 hover:text-white/70 transition-colors cursor-pointer">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              {referralCodes.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {referralCodes.map((r) => (
                    <span key={r} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 text-[11px]">
                      {r}
                      <button type="button" onClick={() => setReferralCodes(referralCodes.filter((x) => x !== r))} className="cursor-pointer"><X className="w-2.5 h-2.5" /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-[11px] font-medium text-white/30 mb-1 block uppercase tracking-wider">Email</label>
              <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            {/* Phone */}
            <div>
              <label className="text-[11px] font-medium text-white/30 mb-1 block uppercase tracking-wider">Phone</label>
              <input type="tel" className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            {/* Home Zipcode */}
            <div>
              <label className="text-[11px] font-medium text-white/30 mb-1 block uppercase tracking-wider">Home Zipcode</label>
              <input className={inputClass} value={homeZipcode} onChange={(e) => setHomeZipcode(e.target.value)} />
            </div>

            {/* Role */}
            <div>
              <label className="text-[11px] font-medium text-white/30 mb-1 block uppercase tracking-wider">Role</label>
              <CustomSelect value={role} onChange={setRole} options={ROLES} placeholder="Select role" size="sm" />
            </div>

            {/* Start Date */}
            <div>
              <label className="text-[11px] font-medium text-white/30 mb-1 block uppercase tracking-wider">Start Date</label>
              <input type="date" className={inputClass + " [color-scheme:dark]"} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>

            {/* Location Code */}
            <div>
              <label className="text-[11px] font-medium text-white/30 mb-1 block uppercase tracking-wider">Location Code</label>
              <input className={inputClass} value={locationCode} onChange={(e) => setLocationCode(e.target.value.toUpperCase())} />
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="flex gap-3 pt-2">
              <span className="text-xs text-white/30">{stats.quotes} quote{stats.quotes !== 1 ? "s" : ""}</span>
              <span className="text-xs text-white/30">{stats.orders} order{stats.orders !== 1 ? "s" : ""}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/[0.04]">
            {hasChanges && (
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-white text-xs font-medium transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}

            <button
              type="button"
              onClick={handleToggleStatus}
              className={`px-4 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer active:scale-[0.98] ${
                user.status === "active"
                  ? "border-amber-500/20 text-amber-300/70 hover:bg-amber-500/10"
                  : "border-emerald-500/20 text-emerald-300/70 hover:bg-emerald-500/10"
              }`}
            >
              {user.status === "active" ? "Deactivate" : "Activate"}
            </button>

            <button
              type="button"
              onClick={() => setShowPasswordInput(!showPasswordInput)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-sky-500/20 text-sky-300/70 hover:bg-sky-500/10 text-xs font-medium transition-all cursor-pointer active:scale-[0.98]"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Assign Password
            </button>

            <button
              type="button"
              onClick={handleResetPassword}
              className="px-4 py-2 rounded-xl border border-violet-500/20 text-violet-300/70 hover:bg-violet-500/10 text-xs font-medium transition-all cursor-pointer active:scale-[0.98]"
            >
              Reset Password
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl border border-red-500/15 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 text-xs font-medium transition-all cursor-pointer active:scale-[0.98]"
            >
              Delete
            </button>
          </div>

          {/* Password input */}
          {showPasswordInput && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="password"
                className={inputClass + " max-w-xs"}
                placeholder="Enter new password (min 6 chars)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAssignPassword())}
              />
              <button
                type="button"
                onClick={handleAssignPassword}
                disabled={passwordLoading}
                className="px-4 py-2 rounded-lg bg-sky-500/15 border border-sky-500/20 text-sky-300 text-xs font-medium hover:bg-sky-500/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {passwordLoading ? "Setting..." : "Set"}
              </button>
              <button
                type="button"
                onClick={() => { setShowPasswordInput(false); setNewPassword(""); }}
                className="p-2 rounded-lg text-white/30 hover:text-white/60 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Users List ───────────────────────────────────────── */
export default function UsersList({ users, userStats = {} }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const roles = Array.from(new Set(users.map((u) => u.role)));
  const statuses = Array.from(new Set(users.map((u) => u.status)));

  const filtered = users.filter((u) => {
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email?.toLowerCase().includes(search.toLowerCase())) return false;
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    return true;
  });

  // Counts
  const roleCounts: Record<string, number> = {};
  const statusCounts: Record<string, number> = {};
  for (const u of users) {
    roleCounts[u.role] = (roleCounts[u.role] || 0) + 1;
    statusCounts[u.status] = (statusCounts[u.status] || 0) + 1;
  }

  function handleRefresh() {
    router.refresh();
  }

  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/[0.08] p-12 text-center">
        <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
          <Users className="w-7 h-7 text-violet-400/60" />
        </div>
        <h3 className="text-lg font-semibold text-white/60 mb-1">No users yet</h3>
        <p className="text-white/30 text-sm">Add your first team member above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 transition-all"
          />
        </div>
        <CustomSelect
          value={roleFilter}
          onChange={setRoleFilter}
          options={[{ value: "all", label: "All Roles" }, ...roles.map((r) => ({ value: r, label: roleLabel(r) }))]}
          className="w-40"
        />
        <CustomSelect
          value={statusFilter}
          onChange={setStatusFilter}
          options={[{ value: "all", label: "All Status" }, ...statuses.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))]}
          className="w-40"
        />
      </div>

      {/* Summary badges */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-white/40">
          Showing {filtered.length} of {users.length} user{users.length !== 1 ? "s" : ""}
        </span>
        <div className="flex flex-wrap gap-1.5 ml-auto">
          {Object.entries(roleCounts).map(([role, count]) => (
            <span key={role} className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${roleColors[role] || roleColors.sales}`}>
              {count} {roleLabel(role)}
            </span>
          ))}
          {Object.entries(statusCounts).map(([status, count]) => (
            <span key={status} className={`px-2 py-0.5 rounded-lg text-[10px] font-medium capitalize ${statusColors[status] || statusColors.active}`}>
              {count} {status}
            </span>
          ))}
        </div>
      </div>

      {/* User cards */}
      <div className="space-y-3">
        {filtered.map((u) => (
          <UserCard
            key={u.id}
            user={u}
            stats={userStats[u.id]}
            onRefresh={handleRefresh}
          />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/[0.06] p-8 text-center">
            <p className="text-white/30 text-sm">No users match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
