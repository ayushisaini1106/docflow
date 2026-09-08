"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "./UserContext";
import { FileText } from "lucide-react";

export function Navbar() {
  const { user, users, setUser } = useUser();

  if (!user) return null;

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition">
          <FileText className="w-6 h-6" />
          <span className="font-bold text-xl">DocFlow</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">Acting as:</div>
          <select
            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-gray-50 py-1 pl-2 pr-8"
            value={user.id}
            onChange={(e) => {
              const selected = users.find((u) => u.id === e.target.value);
              if (selected) setUser(selected);
            }}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
