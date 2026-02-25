"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { createAdminUser } from "@/lib/actions/admin-users";
import CustomSelect from "@/components/admin/CustomSelect";

const ROLES = [
  { value: "admin", label: "Admin" },
  { value: "sales", label: "Sales Person" },
  { value: "manager", label: "Manager" },
  { value: "user", label: "User" },
  { value: "marketing", label: "Marketing" },
];

function parseTags(input: string): string[] {
  return input
    .split(/[,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function UserForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [prefix, setPrefix] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [homeZipcode, setHomeZipcode] = useState("");
  const [role, setRole] = useState("sales");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [locationCode, setLocationCode] = useState("");
  const [zipInput, setZipInput] = useState("");
  const [zipcodes, setZipcodes] = useState<string[]>([]);
  const [refInput, setRefInput] = useState("");
  const [referralCodes, setReferralCodes] = useState<string[]>([]);

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
        home_zipcode: homeZipcode || undefined,
        role,
        start_date: startDate || undefined,
        location_code: locationCode || undefined,
        zipcodes,
        referral_codes: referralCodes,
      });
      setName("");
      setPrefix("");
      setEmail("");
      setPhone("");
      setHomeZipcode("");
      setRole("sales");
      setStartDate(new Date().toISOString().split("T")[0]);
      setLocationCode("");
      setZipcodes([]);
      setReferralCodes([]);
      router.refresh();
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
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 sm:p-6">
      <h3 className="text-base font-semibold text-white mb-1">Add User</h3>
      <p className="text-sm text-white/35 mb-5">Add a new team member to the system.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Name */}
        <div>
          <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">Name</label>
          <input
            required
            className={inputClass}
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Prefix */}
        <div>
          <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">Prefix (2–4 letters)</label>
          <input
            className={inputClass}
            placeholder="e.g. SDML"
            maxLength={4}
            value={prefix}
            onChange={(e) => setPrefix(e.target.value.toUpperCase())}
          />
        </div>

        {/* Zipcodes tag input */}
        <div>
          <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">Zipcodes</label>
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

        {/* Referral codes tag input */}
        <div>
          <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">Referral Codes</label>
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

        {/* Email */}
        <div>
          <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">Email</label>
          <input type="email" className={inputClass} placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">Phone</label>
          <input type="tel" className={inputClass} placeholder="555-000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>

        {/* Home Zipcode */}
        <div>
          <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">Home Zipcode</label>
          <input className={inputClass} placeholder="e.g. 92078" value={homeZipcode} onChange={(e) => setHomeZipcode(e.target.value)} />
        </div>

        {/* Role */}
        <div>
          <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">Role</label>
          <CustomSelect value={role} onChange={setRole} options={ROLES} placeholder="Select role" />
        </div>

        {/* Start Date */}
        <div>
          <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">Start Date</label>
          <input type="date" className={inputClass + " [color-scheme:dark]"} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        {/* Location Code */}
        <div>
          <label className="text-xs font-medium text-white/40 mb-1.5 block uppercase tracking-wider">Location Code</label>
          <input className={inputClass} placeholder="e.g. SD" value={locationCode} onChange={(e) => setLocationCode(e.target.value.toUpperCase())} />
        </div>
      </div>

      {error && (
        <div className="mt-3 text-red-400 text-sm bg-red-500/[0.08] border border-red-500/20 rounded-xl px-4 py-2">
          {error}
        </div>
      )}

      <div className="mt-5">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-500/25 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}
