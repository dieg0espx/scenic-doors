"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Lock, Eye, EyeOff, Plus, X } from "lucide-react";
import { updateAdminUser, changeOwnPassword } from "@/lib/actions/admin-users";
import type { AdminUser } from "@/lib/types";

function parseTags(input: string): string[] {
  return input
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AccountForm({ user }: { user: AdminUser }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Editable fields
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [homeZipcode, setHomeZipcode] = useState(user.home_zipcode ?? "");
  const [prefix, setPrefix] = useState(user.prefix ?? "");
  const [startDate, setStartDate] = useState(user.start_date ?? "");
  const [locationCode, setLocationCode] = useState(user.location_code ?? "");
  const [zipInput, setZipInput] = useState("");
  const [zipcodes, setZipcodes] = useState<string[]>(user.zipcodes ?? []);
  const [refInput, setRefInput] = useState("");
  const [referralCodes, setReferralCodes] = useState<string[]>(user.referral_codes ?? []);

  // Password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await updateAdminUser(user.id, {
        name,
        email: email || undefined,
        phone: phone || undefined,
        home_zipcode: homeZipcode || undefined,
        prefix: prefix || undefined,
        start_date: startDate || undefined,
        location_code: locationCode || undefined,
        zipcodes,
        referral_codes: referralCodes,
      });
      setMessage("Profile updated successfully");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordLoading(true);
    try {
      const result = await changeOwnPassword(newPassword);
      if (result.success) {
        setPasswordMessage(result.message);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(result.message);
      }
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 transition-all";

  const roleBadgeColor: Record<string, string> = {
    admin: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    sales: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    manager: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    marketing: "bg-teal-500/10 text-teal-300 border-teal-500/20",
    user: "bg-white/[0.06] text-white/50 border-white/[0.08]",
  };

  const statusColor: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    inactive: "bg-red-500/10 text-red-300 border-red-500/20",
  };

  return (
    <div className="space-y-6">
      {/* Profile info */}
      <form
        onSubmit={handleSaveProfile}
        className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 sm:p-6"
      >
        <h3 className="text-base font-semibold text-white mb-1">
          Profile Information
        </h3>
        <p className="text-sm text-white/35 mb-5">
          Update your personal details.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Name */}
          <div>
            <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">
              Name
            </label>
            <input
              required
              className={inputClass}
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">
              Email
            </label>
            <input
              type="email"
              className={inputClass}
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">
              Phone
            </label>
            <input
              type="tel"
              className={inputClass}
              placeholder="555-000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Home Zipcode */}
          <div>
            <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">
              Home Zipcode
            </label>
            <input
              className={inputClass}
              placeholder="e.g. 92078"
              value={homeZipcode}
              onChange={(e) => setHomeZipcode(e.target.value)}
            />
          </div>

          {/* Prefix */}
          <div>
            <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">
              Prefix (2-4 letters)
            </label>
            <input
              className={inputClass}
              placeholder="e.g. SDML"
              maxLength={4}
              value={prefix}
              onChange={(e) => setPrefix(e.target.value.toUpperCase())}
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">
              Start Date
            </label>
            <input
              type="date"
              className={inputClass + " [color-scheme:dark]"}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          {/* Location Code */}
          <div>
            <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">
              Location Code
            </label>
            <input
              className={inputClass}
              placeholder="e.g. SD"
              value={locationCode}
              onChange={(e) => setLocationCode(e.target.value.toUpperCase())}
            />
          </div>

          {/* Role (read-only badge) */}
          <div>
            <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">
              Role
            </label>
            <div
              className={`inline-flex items-center px-3 py-2.5 rounded-xl text-xs font-medium border ${roleBadgeColor[user.role] ?? roleBadgeColor.user}`}
            >
              {user.role}
            </div>
          </div>

          {/* Status (read-only badge) */}
          <div>
            <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">
              Status
            </label>
            <div
              className={`inline-flex items-center px-3 py-2.5 rounded-xl text-xs font-medium border ${statusColor[user.status] ?? statusColor.inactive}`}
            >
              {user.status}
            </div>
          </div>

          {/* Zipcodes tag input */}
          <div>
            <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">
              Zipcodes
            </label>
            <div className="flex gap-2">
              <input
                className={inputClass}
                placeholder="Comma or space separated"
                value={zipInput}
                onChange={(e) => setZipInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addZipcodes())}
              />
              <button
                type="button"
                onClick={addZipcodes}
                className="px-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/40 hover:text-white/70 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {zipcodes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {zipcodes.map((z) => (
                  <span key={z} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-500/10 text-violet-300 text-xs">
                    {z}
                    <button type="button" onClick={() => setZipcodes(zipcodes.filter((x) => x !== z))} className="cursor-pointer"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Referral Codes tag input */}
          <div>
            <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">
              Referral Codes
            </label>
            <div className="flex gap-2">
              <input
                className={inputClass}
                placeholder="Comma or space separated"
                value={refInput}
                onChange={(e) => setRefInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addReferralCodes())}
              />
              <button
                type="button"
                onClick={addReferralCodes}
                className="px-3 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/40 hover:text-white/70 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {referralCodes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {referralCodes.map((r) => (
                  <span key={r} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-teal-500/10 text-teal-300 text-xs">
                    {r}
                    <button type="button" onClick={() => setReferralCodes(referralCodes.filter((x) => x !== r))} className="cursor-pointer"><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-3 text-red-400 text-sm bg-red-500/[0.08] border border-red-500/20 rounded-xl px-4 py-2">
            {error}
          </div>
        )}
        {message && (
          <div className="mt-3 text-emerald-400 text-sm bg-emerald-500/[0.08] border border-emerald-500/20 rounded-xl px-4 py-2">
            {message}
          </div>
        )}

        <div className="mt-5">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-500/25 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Change Password */}
      <form
        onSubmit={handleChangePassword}
        className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 sm:p-6"
      >
        <h3 className="text-base font-semibold text-white mb-1">
          Change Password
        </h3>
        <p className="text-sm text-white/35 mb-5">
          Update your login password. Minimum 8 characters.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
          <div>
            <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className={inputClass + " pr-10"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              className={inputClass}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        {passwordError && (
          <div className="mt-3 text-red-400 text-sm bg-red-500/[0.08] border border-red-500/20 rounded-xl px-4 py-2">
            {passwordError}
          </div>
        )}
        {passwordMessage && (
          <div className="mt-3 text-emerald-400 text-sm bg-emerald-500/[0.08] border border-emerald-500/20 rounded-xl px-4 py-2">
            {passwordMessage}
          </div>
        )}

        <div className="mt-5">
          <button
            type="submit"
            disabled={passwordLoading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-500/25 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
          >
            <Lock className="w-4 h-4" />
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
