"use client";

import React, { useState } from "react";
import { useUser } from "./UserContext";

export function ShareModal({
  documentId,
  ownerId,
  onClose,
  onShared,
}: {
  documentId: string;
  ownerId: string;
  onClose: () => void;
  onShared: () => void;
}) {
  const { user, users } = useUser();
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShare = async () => {
    if (!selectedUser) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/documents/${documentId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId, shareWithUserId: selectedUser }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to share");
      }
      onShared();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const availableUsers = users.filter((u) => u.id !== ownerId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Share Document</h2>
        </div>
        <div className="p-6 space-y-4">
          {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select user to share with
            </label>
            <select
              className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 border bg-white"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">-- Select a user --</option>
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end gap-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={!selectedUser || loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
}
