"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Camera, Trash2 } from "lucide-react";

/*
  Settings → Profile
  - Larger avatar
  - Change photo overlay (bottom-right camera icon)
  - Remove photo as secondary action outside avatar
  - Save button persists to localStorage (frontend only)
*/

export default function ProfileSettings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // load from localStorage for demo
    const u = localStorage.getItem("userName");
    const e = localStorage.getItem("userEmail");
    const m = localStorage.getItem("userMobile");
    const b = localStorage.getItem("userBranch");
    const y = localStorage.getItem("userYear");
    const a = localStorage.getItem("userAvatar");
    if (u) setName(u);
    if (e) setEmail(e);
    if (m) setMobile(m);
    if (b) setBranch(b);
    if (y) setYear(y);
    if (a) setAvatarUrl(a);
  }, []);

  const onPickFile = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarUrl(url);
    // for demo: we store the blob URL; in production you'd upload and store returned URL
    localStorage.setItem("userAvatar", url);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(null);
    localStorage.removeItem("userAvatar");
  };

  const handleSave = () => {
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userMobile", mobile);
    localStorage.setItem("userBranch", branch);
    localStorage.setItem("userYear", year);
    alert("Profile saved (frontend only). Backend integration later.");
  };

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-3xl mx-auto rounded-xl bg-card border border-border p-6">
        <h2 className="text-lg font-semibold mb-4">Profile Settings</h2>

        <div className="flex gap-6 items-start">
          {/* Avatar */}
          <div className="relative">
            <div className="w-36 h-36 rounded-full bg-muted border border-border overflow-hidden grid place-items-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="text-muted-foreground">No photo</div>
              )}
            </div>

            {/* Change photo overlay button inside avatar bottom-right */}
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 bg-accent text-accent-foreground rounded-full p-2 border border-border shadow-md hover:scale-105"
              title="Change photo"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* hidden file input */}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPickFile(f);
              }}
            />

            {/* Remove photo button outside */}
            <div className="mt-3">
              <button onClick={handleRemovePhoto} className="flex items-center gap-2 px-3 py-1 rounded text-sm border">
                <Trash2 className="w-4 h-4" /> Remove photo
              </button>
            </div>
          </div>

          {/* Profile form */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Full name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1" />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Mobile</label>
                <Input value={mobile} onChange={(e) => setMobile(e.target.value)} className="mt-1" />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Branch</label>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="mt-1 w-full h-10 rounded border border-border/60 px-2 bg-background"
                >
                  <option value="">Select branch</option>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="AIDS">AIDS</option>
                  <option value="ENTC">ENTC</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Year</label>
                <select value={year} onChange={(e) => setYear(e.target.value)} className="mt-1 w-full h-10 rounded border border-border/60 px-2 bg-background">
                  <option value="">Select year</option>
                  <option value="First Year">First Year</option>
                  <option value="Second Year">Second Year</option>
                  <option value="Third Year">Third Year</option>
                  <option value="Final Year">Final Year</option>
                </select>
              </div>

              <div className="md:col-span-2 mt-2">
                <label className="text-sm text-muted-foreground">Bio (optional)</label>
                <textarea className="w-full mt-1 rounded border border-border/60 p-2 bg-background" rows={3} placeholder="Tell about yourself (optional)"></textarea>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <Button onClick={handleSave}>Save profile</Button>
              <div className="text-sm text-muted-foreground">Changes saved locally only — backend integration later.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
