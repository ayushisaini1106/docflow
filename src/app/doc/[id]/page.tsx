"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/components/UserContext";
import { Navbar } from "@/components/Navbar";
import { Editor } from "@/components/Editor";
import { ShareModal } from "@/components/ShareModal";
import { format } from "date-fns";
import { ArrowLeft, Save, Share2, Trash2, CheckCircle2 } from "lucide-react";

type Document = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  ownerId: string;
  owner: { name: string };
};

export default function DocumentPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useUser();
  const router = useRouter();

  const [doc, setDoc] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);

  // Editable states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchDocument = useCallback(async () => {
    if (!user || !id) return;
    try {
      const res = await fetch(`/api/documents/${id}?userId=${user.id}`, { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Document not found or unauthorized");
      }
      const data = await res.json();
      setDoc(data);
      setTitle(data.title);
      setContent(data.content || "");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user, id]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  const handleSave = async () => {
    if (!user || !doc) return;
    setSaving(true);
    setSaveStatus("");
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, title, content }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaveStatus("Saved!");
      setTimeout(() => setSaveStatus(""), 3000);
      
      // Update local doc updatedAt
      setDoc({ ...doc, updatedAt: new Date().toISOString() });
    } catch (err) {
      console.error(err);
      setSaveStatus("Error saving");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !doc) return;
    try {
      const res = await fetch(`/api/documents/${id}?userId=${user.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Failed to delete document");
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center mt-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </>
    );
  }

  if (error || !doc) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error || "Document not found"}</h2>
          <button
            onClick={() => router.push("/")}
            className="text-indigo-600 hover:underline inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </button>
        </div>
      </>
    );
  }

  const isOwner = doc.ownerId === user.id;

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100vh-3.5rem)]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button
              onClick={() => router.push("/")}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold text-gray-900 bg-transparent border-none focus:ring-0 p-0 w-full sm:w-auto min-w-[200px]"
              placeholder="Document Title"
            />
          </div>

          <div className="flex items-center gap-3">
            {saveStatus && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {saveStatus}
              </span>
            )}
            {!saveStatus && (
              <span className="text-xs text-gray-400">
                Last updated {format(new Date(doc.updatedAt), "MMM d, h:mm a")}
              </span>
            )}
            
            <button
              onClick={handleSave}
              disabled={saving || (title === doc.title && (content === doc.content || (content === "<p></p>" && !doc.content)))}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save"}
            </button>

            {isOwner && (
              <>
                <button
                  onClick={() => setShowShareModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition shadow-sm font-medium"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-500 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition shadow-sm"
                  title="Delete Document"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Editor content={content} editable={true} onChange={setContent} />
        </div>
      </main>

      {showShareModal && (
        <ShareModal
          documentId={doc.id}
          ownerId={doc.ownerId}
          onClose={() => setShowShareModal(false)}
          onShared={() => {
            alert("Document shared successfully!");
            fetchDocument();
          }}
        />
      )}
    </>
  );
}
