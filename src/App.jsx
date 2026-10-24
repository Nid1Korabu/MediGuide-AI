
import { useState } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const healthTopics = [
    {
      icon: "🌙",
      title: "Better Sleep",
      description: "Learn about healthy sleep habits.",
      prompt: "Why is good sleep important for our health?",
    },
    {
      icon: "💧",
      title: "Hydration",
      description: "Understand the importance of water.",
      prompt: "Why is staying hydrated important?",
    },
    {
      icon: "🥗",
      title: "Healthy Eating",
      description: "Explore balanced eating habits.",
      prompt: "What are the basics of a balanced diet?",
    },
    {
      icon: "🏃",
      title: "Daily Activity",
      description: "Learn about regular physical activity.",
      prompt: "What are the general benefits of daily exercise?",
    },
  ];

  async function handleSubmit(event) {
    event.preventDefault();

    if (!question.trim() || loading) {
      return;
    }

    setLoading(true);
    setAnswer("");
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to get an answer. Please try again."
        );
      }

      if (!data.answer || !data.answer.trim()) {
        throw new Error("The AI returned an empty answer. Please try again.");
      }

      setAnswer(data.answer.trim());
    } catch (err) {
      console.error("AI request error:", err);

      setError(
        err.message ||
          "Could not connect to MediGuide AI. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function chooseTopic(prompt) {
    setQuestion(prompt);
    setAnswer("");
    setError("");

    document
      .getElementById("assistant")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function formatAnswer(text) {
    return text
      // Remove escaped Markdown characters if returned by the AI.
      .replace(/\\\*/g, "*")
      // Remove Markdown bold markers.
      .replace(/\*\*/g, "")
      // Remove any unnecessary Markdown heading markers.
      .replace(/^#{1,6}\s+/gm, "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        // Convert Markdown bullets into clean bullet points.
        return line.replace(/^[*+-]\s+/, "• ");
      });
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">✚</span>
          <span>
            MediGuide <span className="brand-ai">AI</span>
          </span>
        </a>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#explore">Explore Health</a>
          <a href="#doctor">Doctor Visit</a>
        </nav>

        <a className="nav-button" href="#assistant">
          Ask a Question
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-content">
            <span className="eyebrow">
              YOUR EVERYDAY HEALTH COMPANION
            </span>

            <h1>
              Understand your health.
              <br />
              <span>One question at a time.</span>
            </h1>

            <p className="hero-description">
              Explore easy-to-understand health information, discover
              healthier habits, and prepare for more informed conversations
              with your healthcare professional.
            </p>

            <a className="primary-button" href="#assistant">
              Explore Health Assistant <span>→</span>
            </a>

            <p className="trust-note">
              ✓ Simple information &nbsp; ✓ Health education &nbsp; ✓
              Doctor-visit preparation
            </p>
          </div>

          <div className="hero-visual">
            <div className="visual-circle">
              <div className="medical-symbol">✚</div>

              <div className="floating-card top-card">
                <span>💚</span>
                <div>
                  <strong>Your health matters</strong>
                  <small>Start with what you want to know.</small>
                </div>
              </div>

              <div className="floating-card bottom-card">
                <span>🌿</span>
                <div>
                  <strong>Small steps, every day</strong>
                  <small>Learn healthy everyday habits.</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="assistant-section" id="assistant">
          <div className="section-heading">
            <span className="eyebrow">HERE TO HELP YOU LEARN</span>
            <h2>What would you like to know?</h2>
            <p>Ask a general health question or choose a topic below.</p>
          </div>

          <form className="question-form" onSubmit={handleSubmit}>
            <span className="search-icon">✳</span>

            <input
              type="text"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about sleep, hydration, healthy habits..."
              aria-label="Enter a general health question"
              maxLength={1000}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Thinking..." : "Ask AI →"}
            </button>
          </form>

          <p className="input-note">
            For general health education only. This tool does not diagnose
            conditions or prescribe treatment.
          </p>

          {loading && (
            <div className="ai-response" role="status">
              MediGuide AI is preparing your answer...
            </div>
          )}

          {error && (
            <div className="ai-response ai-error" role="alert">
              <strong>Unable to get an answer</strong>
              <p>{error}</p>
            </div>
          )}

          {answer && !loading && !error && (
            <div className="ai-response" aria-live="polite">
              <h3>✚ MediGuide AI's Response</h3>

              <div className="answer-text">
                {formatAnswer(answer).map((line, index) => (
                  <p key={`${index}-${line}`}>{line}</p>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="topics-section" id="explore">
          <div className="section-heading">
            <span className="eyebrow">EXPLORE & LEARN</span>
            <h2>Small steps toward better health</h2>
            <p>Choose a topic to explore general health information.</p>
          </div>

          <div className="topic-grid">
            {healthTopics.map((topic) => (
              <button
                type="button"
                className="topic-card"
                key={topic.title}
                onClick={() => chooseTopic(topic.prompt)}
              >
                <span className="topic-icon">{topic.icon}</span>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
                <span className="topic-link">Explore topic →</span>
              </button>
            ))}
          </div>
        </section>

        <section className="doctor-section" id="doctor">
          <div className="doctor-icon">🩺</div>
          <div>
            <span className="eyebrow">BE PREPARED</span>
            <h2>Getting ready for a doctor visit?</h2>
            <p>
              Write down your questions, note when your concerns started,
              and share relevant information with your healthcare
              professional.
            </p>
          </div>
        </section>

        <section className="disclaimer">
          <strong>Important health information</strong>
          <p>
            MediGuide AI is designed for general educational purposes only.
            It is not a medical professional and cannot diagnose, treat, or
            prevent disease. For personal medical advice, consult a qualified
            healthcare professional. For emergencies, contact local emergency
            services.
          </p>
        </section>
      </main>

      <footer className="footer">
        <a className="brand" href="#home">
          <span className="brand-icon">✚</span>
          <span>
            MediGuide <span className="brand-ai">AI</span>
          </span>
        </a>

        <p>Making health information easier to understand.</p>
        <small>© 2026 MediGuide AI · Health education project</small>
      </footer>
    </div>
  );
}

export default App;
