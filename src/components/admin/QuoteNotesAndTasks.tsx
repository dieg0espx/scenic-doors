"use client";

import { useState } from "react";
import {
  MessageSquare,
  CheckSquare,
  ChevronUp,
  ChevronDown,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";
import {
  createQuoteNote,
  deleteQuoteNote,
} from "@/lib/actions/quote-notes";
import {
  createQuoteTask,
  toggleQuoteTask,
  deleteQuoteTask,
} from "@/lib/actions/quote-tasks";
import type { QuoteNote, QuoteTask } from "@/lib/types";

interface QuoteNotesAndTasksProps {
  quoteId: string;
  initialNotes: QuoteNote[];
  initialTasks: QuoteTask[];
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function QuoteNotesAndTasks({
  quoteId,
  initialNotes,
  initialTasks,
}: QuoteNotesAndTasksProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [tasks, setTasks] = useState(initialTasks);
  const [openSection, setOpenSection] = useState<string | null>("notes");

  // Notes form state
  const [noteContent, setNoteContent] = useState("");
  const [noteLoading, setNoteLoading] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  // Tasks form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskLoading, setTaskLoading] = useState(false);
  const [togglingTaskId, setTogglingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  function toggleSection(s: string) {
    setOpenSection(openSection === s ? null : s);
  }

  // ── Notes handlers ──

  async function handleAddNote() {
    const trimmed = noteContent.trim();
    if (!trimmed) return;
    setNoteLoading(true);
    try {
      const note = await createQuoteNote(quoteId, trimmed);
      setNotes([note, ...notes]);
      setNoteContent("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add note");
    } finally {
      setNoteLoading(false);
    }
  }

  async function handleDeleteNote(noteId: string) {
    setDeletingNoteId(noteId);
    try {
      await deleteQuoteNote(noteId, quoteId);
      setNotes(notes.filter((n) => n.id !== noteId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete note");
    } finally {
      setDeletingNoteId(null);
    }
  }

  // ── Tasks handlers ──

  async function handleAddTask() {
    const trimmed = taskTitle.trim();
    if (!trimmed) return;
    setTaskLoading(true);
    try {
      const task = await createQuoteTask(
        quoteId,
        trimmed,
        taskDueDate || undefined
      );
      setTasks([task, ...tasks]);
      setTaskTitle("");
      setTaskDueDate("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to add task");
    } finally {
      setTaskLoading(false);
    }
  }

  async function handleToggleTask(taskId: string, currentCompleted: boolean) {
    setTogglingTaskId(taskId);
    try {
      await toggleQuoteTask(taskId, !currentCompleted, quoteId);
      setTasks(
        tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !currentCompleted } : t
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update task");
    } finally {
      setTogglingTaskId(null);
    }
  }

  async function handleDeleteTask(taskId: string) {
    setDeletingTaskId(taskId);
    try {
      await deleteQuoteTask(taskId, quoteId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete task");
    } finally {
      setDeletingTaskId(null);
    }
  }

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="space-y-3">
      {/* ── Notes Section ── */}
      <Section
        title="Notes"
        icon={<MessageSquare className="w-4 h-4 text-violet-400" />}
        isOpen={openSection === "notes"}
        onToggle={() => toggleSection("notes")}
        badge={`${notes.length}`}
      >
        <div className="space-y-3">
          {/* Existing notes */}
          {notes.length > 0 && (
            <div className="space-y-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white/[0.03] rounded-lg px-3 py-2.5 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap flex-1">
                      {note.content}
                    </p>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      disabled={deletingNoteId === note.id}
                      className="p-1 text-red-400/0 group-hover:text-red-400/60 hover:!text-red-400 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {deletingNoteId === note.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    {note.created_by && (
                      <span className="text-[10px] text-white/25 font-medium">
                        {note.created_by}
                      </span>
                    )}
                    <span className="text-[10px] text-white/20">
                      {timeAgo(note.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add note form */}
          <div className="space-y-2">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="Write a note..."
              rows={2}
              className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-xs focus:outline-none focus:border-white/[0.2] placeholder-white/20 resize-none"
            />
            <button
              onClick={handleAddNote}
              disabled={noteLoading || !noteContent.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-medium hover:bg-violet-500/15 transition-colors cursor-pointer disabled:opacity-50"
            >
              {noteLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              Add Note
            </button>
          </div>
        </div>
      </Section>

      {/* ── Tasks Section ── */}
      <Section
        title="Tasks"
        icon={<CheckSquare className="w-4 h-4 text-emerald-400" />}
        isOpen={openSection === "tasks"}
        onToggle={() => toggleSection("tasks")}
        badge={`${pendingCount} pending`}
      >
        <div className="space-y-3">
          {/* Existing tasks */}
          {tasks.length > 0 && (
            <div className="space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 bg-white/[0.03] rounded-lg px-3 py-2.5 group"
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => handleToggleTask(task.id, task.completed)}
                    disabled={togglingTaskId === task.id}
                    className="shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    <div
                      className={`w-4.5 h-4.5 w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-colors ${
                        task.completed
                          ? "bg-emerald-500/20 border-emerald-500/40"
                          : "border-white/20 hover:border-white/40"
                      }`}
                    >
                      {togglingTaskId === task.id ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin text-white/40" />
                      ) : task.completed ? (
                        <svg
                          className="w-2.5 h-2.5 text-emerald-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : null}
                    </div>
                  </button>

                  {/* Task content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-medium ${
                        task.completed
                          ? "line-through text-white/25"
                          : "text-white/70"
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.due_date && (
                      <p
                        className={`text-[10px] mt-0.5 ${
                          task.completed ? "text-white/15" : "text-white/30"
                        }`}
                      >
                        Due{" "}
                        {new Date(task.due_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    disabled={deletingTaskId === task.id}
                    className="p-1 text-red-400/0 group-hover:text-red-400/60 hover:!text-red-400 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                  >
                    {deletingTaskId === task.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add task form */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Task title..."
                className="flex-1 px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-xs focus:outline-none focus:border-white/[0.2] placeholder-white/20"
              />
              <input
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                className="px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white/60 text-xs focus:outline-none focus:border-white/[0.2] [color-scheme:dark]"
              />
            </div>
            <button
              onClick={handleAddTask}
              disabled={taskLoading || !taskTitle.trim()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium hover:bg-emerald-500/15 transition-colors cursor-pointer disabled:opacity-50"
            >
              {taskLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              Add Task
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
}

// ── Accordion Section (mirrors AdminPortalManager pattern) ──

function Section({
  title,
  icon,
  isOpen,
  onToggle,
  badge,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.015] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-4 sm:px-5 py-3.5 hover:bg-white/[0.02] transition-colors cursor-pointer"
      >
        <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
          {icon}
        </div>
        <span className="text-sm font-semibold text-white flex-1 text-left">
          {title}
        </span>
        {badge && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40">
            {badge}
          </span>
        )}
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-white/30" />
        ) : (
          <ChevronDown className="w-4 h-4 text-white/30" />
        )}
      </button>
      {isOpen && <div className="px-4 sm:px-5 pb-4">{children}</div>}
    </div>
  );
}
