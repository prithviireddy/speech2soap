import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  MessageSquare,
  MessageSquarePlus,
  Pill,
  SendHorizontal,
  ShieldAlert,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";

import { Button, Card, LoadingSpinner } from "../../shared";
import {
  listRagSessionsAPI,
  createRagSessionAPI,
  getRagSessionAPI,
  deleteRagSessionAPI,
  askInSessionAPI,
} from "../../../api/doctor";

/* ── Suggested questions ────────────────────────────── */

const SUGGESTED_QUESTIONS = [
  "What changed since the last consultation?",
  "What medications is this patient currently taking?",
  "Has this symptom appeared before?",
  "Summarize this patient's clinical history.",
  "What treatments were previously documented?",
  "What were the follow-up tasks?",
];

/* ── Helpers ─────────────────────────────────────────── */

const formatSessionDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

/* ── Source citation icon ────────────────────────────── */

const SourceIcon = ({ type }) => {
  if (type === "medication") return <Pill size={14} className="shrink-0" />;
  if (type === "followup") return <Clock size={14} className="shrink-0" />;
  if (type === "consultation_transcript")
    return <User size={14} className="shrink-0" />;
  return <FileText size={14} className="shrink-0" />;
};

const relevanceColor = (r) => {
  if (r >= 0.75) return "bg-success-light text-success border-success/20";
  if (r >= 0.5) return "bg-warning-light text-warning border-warning/20";
  return "bg-border-subtle text-text-muted border-border-default";
};

/* ── Source citation card ────────────────────────────── */

const SourceCard = ({ source }) => {
  const inner = (
    <div
      className={`flex items-start gap-3 p-3 rounded-lg border text-sm transition-colors ${
        source.url
          ? "hover:bg-brand-primary-light hover:border-brand-primary cursor-pointer"
          : "bg-bg-base border-border-default"
      }`}
    >
      <SourceIcon type={source.type} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="font-semibold text-xs truncate">{source.title}</p>
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full border font-mono shrink-0 ${relevanceColor(
              source.relevance
            )}`}
          >
            {Math.round(source.relevance * 100)}%
          </span>
        </div>
        <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
          {source.excerpt}
        </p>
      </div>
      {source.url && (
        <ExternalLink size={12} className="text-text-muted shrink-0 mt-0.5" />
      )}
    </div>
  );

  if (source.url) {
    return <Link to={source.url}>{inner}</Link>;
  }
  return inner;
};

/* ── Lightweight markdown renderer (no external deps) ── */

const MarkdownText = ({ text }) => {
  if (!text) return null;

  const blocks = text.split(/\n{2,}/);

  return (
    <div className="text-sm leading-relaxed space-y-2">
      {blocks.map((block, bi) => {
        const lines = block.split("\n").filter(Boolean);

        const isList = lines.every((l) => /^[*\-]\s/.test(l.trim()));
        if (isList) {
          return (
            <ul key={bi} className="list-none space-y-1 pl-1">
              {lines.map((line, li) => (
                <li key={li} className="flex gap-2">
                  <span className="text-brand-primary mt-0.5 shrink-0">•</span>
                  <span>
                    <InlineMarkdown text={line.replace(/^[*\-]\s+/, "")} />
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        const headingMatch = block.match(/^(#{1,3})\s+(.+)/);
        if (headingMatch) {
          return (
            <p key={bi} className="font-semibold text-text-primary">
              <InlineMarkdown text={headingMatch[2]} />
            </p>
          );
        }

        return (
          <p key={bi}>
            {lines.map((line, li) => (
              <span key={li}>
                <InlineMarkdown text={line} />
                {li < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
};

const InlineMarkdown = ({ text }) => {
  const parts = text.split(/(\*{1,2}[^*]+\*{1,2})/);
  return (
    <>
      {parts.map((part, i) => {
        if (/^\*\*(.+)\*\*$/.test(part)) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (/^\*(.+)\*$/.test(part)) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return part;
      })}
    </>
  );
};

/* ── Message bubble ──────────────────────────────────── */

const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in-up">
        <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-br-sm bg-brand-primary text-white text-sm leading-relaxed shadow-sm">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 animate-fade-in-up">
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-brand-primary-light text-brand-primary shrink-0 mt-0.5">
          <Brain size={15} />
        </div>
        <div className="flex-1 bg-bg-secondary border border-border-default rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
          <MarkdownText text={message.content} />
        </div>
      </div>

      {message.sources && message.sources.length > 0 && (
        <div className="ml-9">
          <p className="text-xs text-text-muted mb-2 font-medium uppercase tracking-wide">
            Evidence Sources
          </p>
          <div className="space-y-2">
            {message.sources.map((src, i) => (
              <SourceCard key={i} source={src} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Main Persistent RAG Assistant ───────────────────── */

export const PatientRAGAssistant = ({ patientId, patientName }) => {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  // Load sessions on mount or when patient changes
  useEffect(() => {
    fetchSessions();
  }, [patientId]);

  const fetchSessions = async () => {
    try {
      setLoadingSessions(true);
      setError("");
      const data = await listRagSessionsAPI(patientId);
      setSessions(data || []);

      if (data && data.length > 0) {
        // Auto-select the first (most recent) session
        selectSession(data[0].id);
      } else {
        setActiveSessionId(null);
        setMessages([]);
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load chat sessions.");
    } finally {
      setLoadingSessions(false);
    }
  };

  const selectSession = async (sessionId) => {
    if (!sessionId) {
      setActiveSessionId(null);
      setMessages([]);
      return;
    }

    try {
      setActiveSessionId(sessionId);
      setLoadingMessages(true);
      setError("");
      const data = await getRagSessionAPI(patientId, sessionId);
      setMessages(data?.messages || []);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to load conversation messages.");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setError("");
    setInput("");
  };

  const handleDeleteSession = async (e, sessionId) => {
    e.stopPropagation();
    try {
      await deleteRagSessionAPI(patientId, sessionId);
      const updated = sessions.filter((s) => s.id !== sessionId);
      setSessions(updated);

      if (activeSessionId === sessionId) {
        if (updated.length > 0) {
          selectSession(updated[0].id);
        } else {
          handleNewChat();
        }
      }
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to delete session.");
    }
  };

  const sendQuestion = async (question) => {
    const text = question?.trim() || input.trim();
    if (!text || sending) return;

    setError("");
    setInput("");
    setSending(true);

    // Optimistically show user message
    const tempUserMsg = {
      id: "temp-" + Date.now(),
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    try {
      let currentSessionId = activeSessionId;

      // If no active session, create one first in PostgreSQL
      if (!currentSessionId) {
        const newSession = await createRagSessionAPI(patientId);
        currentSessionId = newSession.id;
        setActiveSessionId(currentSessionId);
        setSessions((prev) => [newSession, ...prev]);
      }

      // Send question to session
      const resp = await askInSessionAPI(patientId, currentSessionId, text);

      // Replace with real assistant message
      const assistantMsg = {
        id: resp.assistant_message_id,
        role: "assistant",
        content: resp.answer,
        sources: resp.sources || [],
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Update session title & message count in the sidebar
      setSessions((prev) =>
        prev.map((s) =>
          s.id === currentSessionId
            ? {
                ...s,
                title: s.title === "New conversation" ? text.slice(0, 50) : s.title,
                message_count: (s.message_count || 0) + 2,
                updated_at: new Date().toISOString(),
              }
            : s
        )
      );
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to get an answer. Please try again.");
    } finally {
      setSending(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    sendQuestion(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start">
      {/* ── Left Sessions Sidebar (ChatGPT-style) ── */}
      <div className="flex flex-col gap-4">
        <Card className="p-3 flex flex-col h-[600px]">
          {/* New Chat Button */}
          <Button
            variant="primary"
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 mb-3 text-sm font-semibold rounded-xl"
          >
            <MessageSquarePlus size={16} />
            New Chat
          </Button>

          {/* Session List Title */}
          <div className="px-2 py-1 text-xs font-semibold text-text-muted uppercase tracking-wider flex items-center justify-between">
            <span>Conversations</span>
            <span className="text-[11px] font-mono">{sessions.length}</span>
          </div>

          {/* Sessions Scrollable Area */}
          <div className="flex-1 overflow-y-auto space-y-1 my-2 pr-1">
            {loadingSessions ? (
              <div className="py-10 flex justify-center text-text-muted">
                <LoadingSpinner size="sm" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="py-12 text-center text-xs text-text-muted px-3">
                <MessageSquare size={24} className="mx-auto mb-2 opacity-40" />
                No saved conversations yet. Start a new chat to begin.
              </div>
            ) : (
              sessions.map((s) => {
                const isActive = s.id === activeSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => selectSession(s.id)}
                    className={`group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm transition-all cursor-pointer ${
                      isActive
                        ? "bg-brand-primary-light text-brand-primary font-medium border border-brand-primary/20 shadow-sm"
                        : "text-text-secondary hover:bg-bg-base hover:text-text-primary border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <MessageSquare
                        size={15}
                        className={`shrink-0 ${
                          isActive ? "text-brand-primary" : "text-text-muted"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs truncate font-medium">
                          {s.title || "Conversation"}
                        </p>
                        <p className="text-[10px] text-text-muted">
                          {formatSessionDate(s.updated_at || s.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Delete session button */}
                    <button
                      onClick={(e) => handleDeleteSession(e, s.id)}
                      title="Delete chat"
                      className="opacity-0 group-hover:opacity-100 hover:text-danger p-1 rounded-md transition-opacity text-text-muted"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Safety Notice Footer */}
          <div className="pt-3 border-t border-border-subtle mt-auto">
            <div className="p-2.5 rounded-lg bg-warning-light border border-warning/20 flex items-start gap-2">
              <ShieldAlert size={14} className="text-warning shrink-0 mt-0.5" />
              <p className="text-[11px] text-text-secondary leading-tight">
                Grounded in documented records only. Doctors retain full diagnostic authority.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Right Main Chat Area ── */}
      <Card className="flex flex-col h-[600px] p-0 overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-border-subtle bg-bg-secondary/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-primary-light text-brand-primary">
              <Brain size={18} />
            </div>
            <div>
              <h2 className="text-sm font-display font-bold text-text-primary">
                {activeSession?.title && activeSession.title !== "New conversation"
                  ? activeSession.title
                  : `Clinical AI Assistant — ${patientName}`}
              </h2>
              <p className="text-xs text-text-muted">
                Persistent database sessions · Multi-turn patient history retrieval
              </p>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {loadingMessages ? (
            <div className="h-full flex flex-col items-center justify-center text-text-muted gap-2">
              <LoadingSpinner size="md" />
              <p className="text-xs">Loading conversation history...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-8">
              <div className="p-3 rounded-2xl bg-brand-primary-light text-brand-primary mb-3">
                <Brain size={28} />
              </div>
              <h3 className="font-display font-bold text-base text-text-primary mb-1">
                Ask about {patientName}'s records
              </h3>
              <p className="text-xs text-text-muted mb-6 leading-relaxed">
                Query diagnoses, medications, follow-up instructions, past SOAP notes, and consultations. All chats are saved to the database.
              </p>

              {/* Prompt Suggestions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full text-left">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendQuestion(q)}
                    disabled={sending}
                    className="flex items-start gap-2 p-2.5 rounded-xl border border-border-default bg-bg-base hover:bg-brand-primary-light hover:border-brand-primary text-xs text-text-secondary hover:text-brand-primary transition-all group disabled:opacity-50"
                  >
                    <ChevronRight
                      size={13}
                      className="shrink-0 mt-0.5 text-text-muted group-hover:text-brand-primary transition-colors"
                    />
                    <span className="line-clamp-2">{q}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => <MessageBubble key={msg.id || idx} message={msg} />)
          )}

          {sending && (
            <div className="flex items-start gap-3 animate-fade-in-up">
              <div className="p-1.5 rounded-lg bg-brand-primary-light text-brand-primary shrink-0 mt-0.5">
                <Brain size={15} />
              </div>
              <div className="bg-bg-secondary border border-border-default rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-text-muted flex items-center gap-2 shadow-sm">
                <LoadingSpinner size="sm" />
                Retrieving patient records & synthesizing grounded answer…
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-danger-light border border-danger/20 text-xs text-danger">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleSubmit}
          className="p-3 border-t border-border-subtle bg-bg-secondary/20 flex gap-2 items-end"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask about ${patientName}'s clinical history... (Shift+Enter for newline)`}
            rows={2}
            disabled={sending}
            className="flex-1 resize-none px-3.5 py-2.5 text-sm border border-border-default rounded-xl bg-bg-base focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/20 disabled:opacity-50 text-text-primary"
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!input.trim() || sending}
            className="h-10 px-4 rounded-xl flex items-center justify-center shrink-0"
          >
            {sending ? <LoadingSpinner size="sm" /> : <SendHorizontal size={16} />}
          </Button>
        </form>
      </Card>
    </div>
  );
};
