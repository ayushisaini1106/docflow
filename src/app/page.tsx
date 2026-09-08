"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/components/UserContext";
import { Navbar } from "@/components/Navbar";
import { format } from "date-fns";
import { FileText, Plus, Upload, Users } from "lucide-react";

type Document = {
  id: string;
  title: string;
  updatedAt: string;
  ownerId: string;
  owner: { name: string };
  shares: { user: { name: string } }[];
};

export default function Dashboard() {
  const { user } = useUser();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/documents?userId=${user.id}`, { cache: "no-store" });
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerId: user.id }),
      });
      const data = await res.json();
      router.push(`/doc/${data.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Optional: limit file size (e.g. 1MB) to prevent browser/server crashing
    if (file.size > 1024 * 1024) {
      alert("File is too large! Please select a text file under 1MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Ensure it's a text file or markdown file
    if (!file.type.startsWith("text/") && !file.name.endsWith(".md")) {
      alert("Please upload only text or markdown files (.txt, .md). Images and binary files cannot be edited as text.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const title = file.name.replace(/\.[^/.]+$/, ""); // remove extension

      try {
        const res = await fetch("/api/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ownerId: user.id, title, content }),
        });
        const data = await res.json();
        if (fileInputRef.current) fileInputRef.current.value = "";
        router.push(`/doc/${data.id}`);
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  if (!user) return null;

  const myDocuments = documents.filter((doc) => doc.ownerId === user.id);
  const sharedDocuments = documents.filter((doc) => doc.ownerId !== user.id);

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">My Dashboard</h1>
          <div className="flex items-center gap-3">
            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 transition shadow-sm font-medium"
            >
              <Upload className="w-4 h-4" />
              Upload (.txt, .md)
            </button>
            <button
              onClick={createDocument}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition shadow-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              New Document
            </button>
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <section>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">Owned by Me</h2>
              {myDocuments.length === 0 ? (
                <div className="text-gray-500 italic bg-white p-6 rounded-xl border border-dashed text-center">No documents found. Create one to get started!</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {myDocuments.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} router={router} />
                  ))}
                </div>
              )}
            </section>

            {sharedDocuments.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2 mt-8">Shared with Me</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {sharedDocuments.map((doc) => (
                    <DocumentCard key={doc.id} doc={doc} router={router} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </>
  );
}

function DocumentCard({ doc, router }: { doc: Document; router: any }) {
  return (
    <div
      onClick={() => router.push(`/doc/${doc.id}`)}
      className="group bg-white rounded-xl border p-5 cursor-pointer hover:shadow-md hover:border-indigo-200 transition duration-200 relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:scale-105 transition">
          <FileText className="w-6 h-6" />
        </div>
        {doc.shares && doc.shares.length > 0 && (
          <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full border">
            <Users className="w-3 h-3 mr-1" />
            Shared
          </div>
        )}
      </div>
      <h3 className="font-semibold text-lg text-gray-900 truncate mb-1">{doc.title}</h3>
      <p className="text-xs text-gray-500">
        Updated {format(new Date(doc.updatedAt), "MMM d, yyyy")}
      </p>
      {doc.owner && (
        <p className="text-xs text-gray-400 mt-2">Owner: {doc.owner.name}</p>
      )}
    </div>
  );
}
