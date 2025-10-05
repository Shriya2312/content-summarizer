import { useState } from 'react';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import './App.css';

function App() {
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize Groq
  const groq = createOpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
  });

  const handleSummarize = async () => {
    if (!content.trim()) return;

    setIsLoading(true);
    setError(null);
    setSummary('');

    try {
      const result = await generateText({
        model: groq('llama-3.3-70b-versatile'),
        system: 'You are a professional content summarizer. ' +
                'You create clear, concise summaries that capture the key points. ' +
                'Keep summaries between 3-5 sentences.',
        prompt: `Summarize the following content:\n\n${content}`,
      });

      setSummary(result.text);
    } catch (err) {
      setError(err.message || 'Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setContent('');
    setSummary('');
    setError(null);
  };

  return (
    <div className="summarizer-container">
      <div className="summarizer-header">
        <h1>Content Summarizer</h1>
      </div>

      <div className="summarizer-content">
        <div className="input-section">
          <label htmlFor="content">Enter content to summarize:</label>
          <textarea
            id="content"
            className="content-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste your article, blog post, or any text content here..."
            disabled={isLoading}
            rows={12}
          />
          <div className="char-count">
            {content.length} characters
          </div>
          
          <div className="button-group">
            <button
              onClick={handleSummarize}
              className="summarize-button"
              disabled={!content.trim() || isLoading}
            >
              {isLoading ? '⏳ Summarizing...' : 'Summarize'}
            </button>
            <button
              onClick={handleClear}
              className="clear-button"
              disabled={isLoading}
            >
              Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="error-box">
            <strong>Error:</strong> {error}
          </div>
        )}

        {summary && (
          <div className="output-section">
            <label>Summary:</label>
            <div className="summary-output">
              <p>{summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
