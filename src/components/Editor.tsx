"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
} from "lucide-react";

type EditorProps = {
  content: string;
  editable: boolean;
  onChange: (content: string) => void;
};

export function Editor({ content, editable, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none min-h-[500px]",
      },
    },
  });

  // Keep content in sync if it changes externally (e.g. initial load)
  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col h-[700px]">
      {editable && (
        <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={<Bold className="w-4 h-4" />}
            title="Bold"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={<Italic className="w-4 h-4" />}
            title="Italic"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            icon={<UnderlineIcon className="w-4 h-4" />}
            title="Underline"
          />
          <div className="w-px h-6 bg-gray-300 mx-2 self-center"></div>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
            icon={<Heading1 className="w-4 h-4" />}
            title="Heading 1"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            icon={<Heading2 className="w-4 h-4" />}
            title="Heading 2"
          />
          <div className="w-px h-6 bg-gray-300 mx-2 self-center"></div>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon={<List className="w-4 h-4" />}
            title="Bullet List"
          />
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon={<ListOrdered className="w-4 h-4" />}
            title="Numbered List"
          />
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
        <div className="max-w-3xl mx-auto bg-white p-10 min-h-[800px] shadow-sm border rounded">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}

function MenuButton({
  onClick,
  isActive,
  icon,
  title,
}: {
  onClick: () => void;
  isActive: boolean;
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded hover:bg-gray-200 transition ${
        isActive ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" : "text-gray-700"
      }`}
    >
      {icon}
    </button>
  );
}
