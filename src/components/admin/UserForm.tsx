"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createAdminUser } from "@/lib/actions/admin-users";

export default function UserForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [prefix, setPrefix] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("sales");
  const [startDate, setStartDate] = useState("");
  const [locationCode, setLocationCode] = useState("");
  const [zipInput, setZipInput] = useState("");
  const [zipcodes, setZipcodes] = useState<string[]>([]);
  const [refInput, setRefInput] = useState("");
  const [referralCodes, setReferralCodes] = useState<string[]>([]);

  function addZipcode() {
    if (zipInput.trim() && !zipcodes.includes(zipInput.trim())) {
      setZipcodes([...zipcodes, zipInput.trim()]);
      setZipInput("");
    }
  }

  function addReferralCode() {
    if (refInput.trim() && !referralCodes.includes(refInput.trim())) {
      setReferralCodes([...referralCodes, refInput.trim()]);
      setRefInput("");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createAdminUser({
        name,
        prefix: prefix || undefined,
        email: email || undefined,
        phone: phone || undefined,
        role,
        start_date: startDate || undefined,
        location_code: locationCode || undefined,
        zipcodes,
        referral_codes: referralCodes,
      });
      // Reset form
      setName("");
      setPrefix("");
      setEmail("");
      setPhone("");
      setRole("sales");
      setStartDate("");
      setLocationCode("");
      setZipcodes([]);
      setReferralCodes([]);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 transition-all";

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Add User</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <input
          required
          className={inputClass}
          placeholder="Full Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Prefix (Mr/Mrs)"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
        />
        <input
          type="email"
          className={inputClass}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="tel"
          className={inputClass}
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <select
          className={inputClass + " cursor-pointer"}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="sales">Sales</option>
          <option value="manager">Manager</option>
          <option value="installer">Installer</option>
        </select>
        <input
          type="date"
          className={inputClass}
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Location Code"
          value={locationCode}
          onChange={(e) => setLocationCode(e.target.value)}
        />

        {/* Zipcodes tag input */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex gap-2">
            <input
              className={inputClass}
              placeholder="Add zipcode"
              value={zipInput}
              onChange={(e) => setZipInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addZipcode())}
            />
            <button
              type="button"
              onClick={addZipcode}
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
                  <button type="button" onClick={() => setZipcodes(zipcodes.filter((x) => x !== z))} className="cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Referral codes tag input */}
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex gap-2">
            <input
              className={inputClass}
              placeholder="Add referral code"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addReferralCode())}
            />
            <button
              type="button"
              onClick={addReferralCode}
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
                  <button type="button" onClick={() => setReferralCodes(referralCodes.filter((x) => x !== r))} className="cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
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

      <div className="mt-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-500/25 cursor-pointer disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {loading ? "Adding..." : "Add User"}
        </button>
      </div>
    </form>
  );
}
