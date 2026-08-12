import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock3,
  Database,
  History,
  Lightbulb,
  Loader2,
  Menu,
  Search,
  Sparkles,
  Trash2,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import "./App.css";

interface ResearchResult {
  id: number;
  research_session_id: number;
  summary: string;
  comparison: string;
  advantages: string;
  disadvantages: string;
  recommendation: string;
  use_cases: string;
  performance: string;
  best_for: string;
  created_at: string;
}

interface Research {
  id: number;
  topic: string;
  status: string;
  created_at: string;
  result?: ResearchResult;
}

type View = "research" | "history" | "detail";

const API_URL =
  "https://ai-tech-scout-backend.vercel.app/api/research";

function App() {
  const [view, setView] = useState<View>("research");
  const [topic, setTopic] = useState("");
  const [research, setResearch] = useState<Research | null>(null);
  const [history, setHistory] = useState<Research[]>([]);
  const [selectedResearch, setSelectedResearch] =
    useState<Research | null>(null);

  const [historySearch, setHistorySearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Research | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const showToast = (message: string) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const mapResearchResponse = (data: any): Research => {
    const source = data.research ?? data;

    const result: ResearchResult | undefined =
      data.result ??
      (source.summary ||
      source.comparison ||
      source.advantages ||
      source.disadvantages ||
      source.recommendation
        ? {
            id: source.result_id ?? 0,
            research_session_id: source.id,
            summary: source.summary ?? "",
            comparison: source.comparison ?? "",
            advantages: source.advantages ?? "",
            disadvantages: source.disadvantages ?? "",
            recommendation: source.recommendation ?? "",
            use_cases: source.use_cases ?? "",
            performance: source.performance ?? "",
            best_for: source.best_for ?? "",
            created_at: source.created_at ?? "",
          }
        : undefined);

    return {
      id: source.id,
      topic: source.topic,
      status: source.status,
      created_at: source.created_at,
      result,
    };
  };

  const loadHistory = async () => {
    setHistoryLoading(true);

    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load history");
      }

      const rawItems = Array.isArray(data)
        ? data
        : data.research || data.sessions || [];

      const items = rawItems.map(mapResearchResponse);

      setHistory(items);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load research history."
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  const openHistory = async () => {
    setMobileMenu(false);
    setError("");
    setView("history");

    await loadHistory();
  };

  const startResearch = async () => {
    if (!topic.trim()) {
      setError("Enter a technology or comparison to begin.");
      return;
    }

    setLoading(true);
    setError("");
    setResearch(null);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create research");
      }

      const completedResearch = mapResearchResponse(data);

      setResearch(completedResearch);
      setTopic("");
      setView("research");

      await loadHistory();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const openResearch = async (id: number) => {
    setDetailLoading(true);
    setSelectedResearch(null);
    setError("");
    setView("detail");
    setMobileMenu(false);

    try {
      const response = await fetch(`${API_URL}/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load research");
      }

      const item = mapResearchResponse(data);

      setSelectedResearch(item);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load this research."
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const deleteResearch = async () => {
    if (!deleteTarget) return;

    const id = deleteTarget.id;

    setDeletingId(id);

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete research");
      }

      setHistory((current) =>
        current.filter((item) => item.id !== id)
      );

      if (research?.id === id) {
        setResearch(null);
      }

      if (selectedResearch?.id === id) {
        setSelectedResearch(null);
        setView("history");
      }

      setDeleteTarget(null);
      showToast("Research session deleted");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete research."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const useExample = (value: string) => {
    setTopic(value);
    setError("");
    setView("research");
  };

  const goResearch = () => {
    setView("research");
    setMobileMenu(false);
    setError("");
  };

  const filteredHistory = history.filter((item) =>
    item.topic.toLowerCase().includes(historySearch.toLowerCase())
  );

  const formatDate = (date: string) =>
    new Date(date).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <main className="app">
      <div className="noise" />
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="ambient ambient-three" />
      <div className="grid-background" />

      <nav className="navbar">
        <div className="nav-inner">
          <button className="brand" onClick={goResearch}>
            <span className="brand-icon">
              <Sparkles size={18} />
            </span>

            <span>
              AI Tech <strong>Scout</strong>
            </span>
          </button>

          <div
            className={`nav-links ${
              mobileMenu ? "mobile-open" : ""
            }`}
          >
            <button
              className={view === "research" ? "active" : ""}
              onClick={goResearch}
            >
              <Search size={16} />
              Research
            </button>

            <button
              className={
                view === "history" || view === "detail"
                  ? "active"
                  : ""
              }
              onClick={openHistory}
            >
              <History size={16} />
              Intelligence
            </button>
          </div>

          <div className="nav-actions">
            <div className="api-status">
              <span className="status-dot" />
              SYSTEM ONLINE
            </div>

            <button
              className="mobile-menu"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenu ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {error && (
        <div className="global-error">
          <XCircle size={17} />
          <span>{error}</span>

          <button
            onClick={() => setError("")}
            aria-label="Close error message"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {toast && (
        <div className="toast">
          <CheckCircle2 size={17} />
          <span>{toast}</span>
        </div>
      )}

      {view === "research" && (
        <section className="research-page">
          <div className="hero-orb">
            <div className="orb-ring ring-one" />
            <div className="orb-ring ring-two" />
            <div className="orb-ring ring-three" />

            <div className="orb-core">
              <Brain size={30} />
            </div>

            <span className="orb-particle particle-one" />
            <span className="orb-particle particle-two" />
            <span className="orb-particle particle-three" />
          </div>

          <div className="hero-badge">
            <span className="badge-live" />
            AI TECHNOLOGY INTELLIGENCE
          </div>

          <h1>
            Know what to build
            <span>before you build it.</span>
          </h1>

          <p className="hero-subtitle">
            Scout emerging technologies, compare engineering
            choices and turn complex decisions into actionable
            intelligence.
          </p>

          <div
            className={`research-input ${
              loading ? "is-loading" : ""
            }`}
          >
            <div className="input-icon">
              <Search size={20} />
            </div>

            <input
              id="research-topic"
              name="research-topic"
              value={topic}
              disabled={loading}
              placeholder="Explore a technology, framework or comparison..."
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  startResearch();
                }
              }}
            />

            <button
              onClick={startResearch}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="spin" />
                  Analyzing
                </>
              ) : (
                <>
                  Scout
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </div>

          <div className="quick-topics">
            <span>EXPLORE</span>

            <button
              onClick={() =>
                useExample("Zustand vs Redux Toolkit")
              }
            >
              Zustand vs Redux
            </button>

            <button
              onClick={() =>
                useExample("Spring Boot vs Node.js")
              }
            >
              Spring Boot vs Node.js
            </button>

            <button
              onClick={() =>
                useExample(
                  "React Server Components vs traditional React"
                )
              }
            >
              React Server Components
            </button>
          </div>

          {loading && (
            <div className="ai-thinking">
              <div className="thinking-visual">
                <div className="thinking-orbit" />
                <Brain size={22} />
              </div>

              <div className="thinking-content">
                <div className="thinking-title">
                  <strong>Scout is analyzing</strong>
                  <span>LIVE</span>
                </div>

                <span>
                  Mapping technologies, trade-offs and
                  engineering signals...
                </span>
              </div>

              <div className="thinking-bars">
                <i />
                <i />
                <i />
                <i />
              </div>
            </div>
          )}

          {!loading && research?.result && (
            <ResearchResultView
              research={research}
              formatDate={formatDate}
              onHistory={openHistory}
            />
          )}

          {!research && !loading && (
            <>
              <div className="research-stats">
                <div>
                  <strong>AI</strong>
                  <span>POWERED ANALYSIS</span>
                </div>

                <div>
                  <strong>24/7</strong>
                  <span>INTELLIGENCE</span>
                </div>

                <div>
                  <strong>∞</strong>
                  <span>RESEARCH MEMORY</span>
                </div>
              </div>

              <div className="research-features">
                <Feature
                  icon={<Brain />}
                  title="AI Analysis"
                  text="Transform complicated technology decisions into clear engineering intelligence."
                  type="purple"
                />

                <Feature
                  icon={<Zap />}
                  title="Deep Comparison"
                  text="Expose practical trade-offs, strengths, weaknesses and hidden costs."
                  type="blue"
                />

                <Feature
                  icon={<Database />}
                  title="Persistent Memory"
                  text="Every completed investigation becomes part of your private intelligence archive."
                  type="green"
                />
              </div>
            </>
          )}
        </section>
      )}

      {view === "history" && (
        <section className="workspace-page">
          <div className="archive-hero">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-line" />
                INTELLIGENCE ARCHIVE
              </div>

              <h1>
                Your technology
                <span>memory.</span>
              </h1>

              <p>
                Every investigation you've run, preserved as
                an evolving intelligence timeline.
              </p>
            </div>

            <button
              className="new-research"
              onClick={goResearch}
            >
              <Sparkles size={16} />
              New Investigation
            </button>
          </div>

          <div className="archive-metrics">
            <div className="metric">
              <span>SESSIONS</span>
              <strong>{history.length}</strong>
            </div>

            <div className="metric">
              <span>VISIBLE</span>
              <strong>{filteredHistory.length}</strong>
            </div>

            <div className="metric">
              <span>STATUS</span>
              <strong className="metric-live">
                <i />
                ONLINE
              </strong>
            </div>
          </div>

          <div className="history-toolbar">
            <div className="history-search">
              <Search size={17} />

              <input
                id="history-search"
                name="history-search"
                value={historySearch}
                onChange={(e) =>
                  setHistorySearch(e.target.value)
                }
                placeholder="Search intelligence..."
              />

              {historySearch && (
                <button
                  onClick={() => setHistorySearch("")}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="history-count">
              {filteredHistory.length}{" "}
              {filteredHistory.length === 1
                ? "investigation"
                : "investigations"}
            </div>
          </div>

          {historyLoading ? (
            <div className="archive-loading">
              <div className="loading-core">
                <Database size={22} />
              </div>

              <strong>
                Synchronizing intelligence...
              </strong>

              <span>
                Retrieving your research archive
              </span>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="empty-state">
              <div className="empty-orb">
                <Search size={25} />
              </div>

              <div className="empty-eyebrow">
                NO SIGNALS FOUND
              </div>

              <strong>
                {history.length === 0
                  ? "Your intelligence archive is empty"
                  : "No matching investigations"}
              </strong>

              <span>
                {history.length === 0
                  ? "Start your first investigation and build your technology memory."
                  : "Try another search term."}
              </span>

              {history.length === 0 && (
                <button onClick={goResearch}>
                  Begin first investigation
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          ) : (
            <div className="timeline">
              <div className="timeline-line" />

              {filteredHistory.map((item, index) => (
                <div
                  className="timeline-entry"
                  key={item.id}
                  style={{
                    animationDelay: `${index * 90}ms`,
                  }}
                >
                  <div className="timeline-node">
                    <span />
                  </div>

                  <article className="history-card">
                    <button
                      className="history-open"
                      onClick={() =>
                        openResearch(item.id)
                      }
                    >
                      <div className="history-card-top">
                        <span className="session-label">
                          SESSION{" "}
                          {String(index + 1).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <span className="history-status">
                          <i />
                          {item.status}
                        </span>
                      </div>

                      <h2>{item.topic}</h2>

                      <p>
                        Technology intelligence
                        investigation · Research session #
                        {item.id}
                      </p>

                      <div className="history-card-bottom">
                        <span>
                          <Clock3 size={13} />
                          {formatDate(
                            item.created_at
                          )}
                        </span>

                        <span className="open-label">
                          OPEN INTELLIGENCE
                          <ArrowRight size={15} />
                        </span>
                      </div>
                    </button>

                    <button
                      className="delete-history"
                      title="Delete research"
                      aria-label={`Delete research ${item.topic}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setDeleteTarget(item);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </article>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {view === "detail" && (
        <section className="detail-page">
          <button
            className="back-button"
            onClick={openHistory}
          >
            <ArrowLeft size={17} />
            Back to intelligence
          </button>

          {detailLoading ? (
            <div className="empty-state detail-loading">
              <div className="thinking-icon large">
                <Brain size={28} />
              </div>

              <strong>
                Decrypting research session...
              </strong>

              <span>
                Retrieving saved intelligence.
              </span>
            </div>
          ) : selectedResearch?.result ? (
            <ResearchResultView
              research={selectedResearch}
              formatDate={formatDate}
              detail
            />
          ) : (
            <div className="empty-state">
              <div className="empty-orb">
                <XCircle size={25} />
              </div>

              <strong>Research unavailable</strong>

              <span>
                This research session may have been
                deleted or no longer exists.
              </span>

              <button onClick={openHistory}>
                Return to archive
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </section>
      )}

      <footer className="footer">
        <div className="footer-brand">
          <span className="brand-icon small">
            <Sparkles size={14} />
          </span>

          AI Tech Scout
        </div>

        <span>
          Technology intelligence for the builders of
          tomorrow.
        </span>

        <span>
          REACT · NODE · POSTGRESQL · AI
        </span>
      </footer>

      {deleteTarget && (
        <div
          className="modal-backdrop"
          onClick={() => {
            if (!deletingId) {
              setDeleteTarget(null);
            }
          }}
        >
          <div
            className="delete-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="delete-modal-icon">
              <Trash2 size={22} />
            </div>

            <div className="modal-eyebrow">
              REMOVE INTELLIGENCE
            </div>

            <h2>Delete this investigation?</h2>

            <p>
              This will permanently remove
              <strong>
                {" "}
                "{deleteTarget.topic}"{" "}
              </strong>
              from your research archive.
            </p>

            <div className="modal-actions">
              <button
                className="cancel-delete"
                disabled={!!deletingId}
                onClick={() =>
                  setDeleteTarget(null)
                }
              >
                Keep it
              </button>

              <button
                className="confirm-delete"
                disabled={!!deletingId}
                onClick={deleteResearch}
              >
                {deletingId ? (
                  <>
                    <Loader2
                      size={16}
                      className="spin"
                    />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete permanently
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Feature({
  icon,
  title,
  text,
  type,
}: {
  icon: ReactNode;
  title: string;
  text: string;
  type: string;
}) {
  return (
    <div className="feature">
      <div className={`feature-icon ${type}`}>
        {icon}
      </div>

      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
    </div>
  );
}

function ResearchResultView({
  research,
  formatDate,
  onHistory,
  detail = false,
}: {
  research: Research;
  formatDate: (date: string) => string;
  onHistory?: () => void;
  detail?: boolean;
}) {
  if (!research.result) return null;

  return (
    <div
      className={`result-view ${
        detail ? "detail-result" : ""
      }`}
    >
      <div className="result-header">
        <div>
          <div className="eyebrow">
            <span className="eyebrow-line" />
            AI RESEARCH SESSION
          </div>

          <h2>{research.topic}</h2>

          <div className="result-info">
            <span>SESSION #{research.id}</span>
            <span>•</span>
            <span>
              {formatDate(research.created_at)}
            </span>
          </div>
        </div>

        <div className="completed">
          <CheckCircle2 size={15} />
          Intelligence ready
        </div>
      </div>

      <div className="summary-panel">
        <div className="summary-signal">
          <div className="summary-icon">
            <Brain size={23} />
          </div>
        </div>

        <div>
          <span className="panel-label">
            EXECUTIVE INTELLIGENCE
          </span>

          <p>{research.result.summary}</p>
        </div>
      </div>

      <div className="result-cards">
        <ResultCard
          icon={<Zap />}
          type="blue"
          title="Comparison"
          text={research.result.comparison}
        />

        <ResultCard
          icon={<CheckCircle2 />}
          type="green"
          title="Advantages"
          text={research.result.advantages}
        />

        <ResultCard
          icon={<XCircle />}
          type="red"
          title="Disadvantages"
          text={research.result.disadvantages}
        />

        <ResultCard
          icon={<Database />}
          type="blue"
          title="Use Cases"
          text={research.result.use_cases}
        />

        <ResultCard
          icon={<Zap />}
          type="green"
          title="Performance"
          text={research.result.performance}
        />

        <ResultCard
          icon={<Brain />}
          type="purple"
          title="Best For"
          text={research.result.best_for}
        />

        <ResultCard
          icon={<Lightbulb />}
          type="yellow"
          title="Recommendation"
          text={research.result.recommendation}
          featured
        />
      </div>

      {!detail && onHistory && (
        <button
          className="view-archive"
          onClick={onHistory}
        >
          Open intelligence archive
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}

function ResultCard({
  icon,
  type,
  title,
  text,
  featured = false,
}: {
  icon: ReactNode;
  type: string;
  title: string;
  text: string;
  featured?: boolean;
}) {
  return (
    <article
      className={`result-panel ${
        featured ? "featured" : ""
      }`}
    >
      <div className="panel-heading">
        <div className={`result-icon ${type}`}>
          {icon}
        </div>

        <span>{title}</span>
      </div>

      <p>{text}</p>
    </article>
  );
}

export default App;