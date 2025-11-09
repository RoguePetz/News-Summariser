"use client"

import { useState } from "react"
import { Clock, ExternalLink, Bot, MessageCircle } from "lucide-react"

export default function NewsItem({
  source,
  source_icon,
  title,
  description,
  urlToImage,
  url,
  publishedAt,
  summary,
  category,
  summarizeArticle,
  setShowChat,
  setSelectedNews,
  news,
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [currentSummary, setCurrentSummary] = useState(summary)

  const handleSummarize = async () => {
    setIsLoading(true)
    try {
      const summaryText = await summarizeArticle(description, title);
      setCurrentSummary(summaryText)
    } catch (error) {
      console.error("Error summarizing:", error)
    }
    setIsLoading(false)
  }

  const handleChat = () => {
    setSelectedNews(news)
    setShowChat(true)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const cardStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    border: "1px solid #f3f4f6",
    overflow: "hidden",
    transition: "all 0.3s ease",
  }

  const cardContentStyle = {
    padding: "16px",
  }

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  }

  const sourceInfoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }

  const sourceIconStyle = {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    objectFit: "cover",
  }

  const sourceTextStyle = {
    fontSize: "12px",
    fontWeight: "500",
    color: "#6b7280",
  }

  const dateStyle = {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#6b7280",
    fontSize: "12px",
  }

  const contentStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  }

  const textContentStyle = {
    flex: 1,
    order: 2,
  }

  const titleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "8px",
    lineHeight: "1.4",
    cursor: "pointer",
    transition: "color 0.3s ease",
  }

  const descriptionStyle = {
    color: "#6b7280",
    marginBottom: "12px",
    fontSize: "14px",
    lineHeight: "1.5",
  }

  const categoriesStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "4px",
    marginBottom: "12px",
  }

  const categoryTagStyle = {
    padding: "4px 8px",
    backgroundColor: "#dbeafe",
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: "500",
    borderRadius: "16px",
  }

  const summaryStyle = {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "12px",
    marginBottom: "12px",
  }

  const summaryTitleStyle = {
    fontWeight: "500",
    color: "#111827",
    marginBottom: "8px",
    fontSize: "14px",
  }

  const summaryTextStyle = {
    color: "#374151",
    fontSize: "12px",
  }

  const actionsStyle = {
    display: "flex",
    // flexDirection: "column",
    gap: "8px",
  }

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "none",
  }

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#3b82f6",
    color: "white",
  }

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#2563eb",
    color: "white",
  }

  const outlineButtonStyle = {
    ...buttonStyle,
    border: "1px solid #d1d5db",
    color: "#374151",
    backgroundColor: "white",
  }

  const imageContainerStyle = {
    width: "100%",
    height: "192px",
    flexShrink: 0,
    order: 1,
  }

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "8px",
  }

  return (
    <article
      style={{
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        border: "1px solid #f3f4f6",
        overflow: "hidden",
        transition: "all 0.3s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)")}
      onMouseOut={(e) => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)")}
    >
      <div style={cardContentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={sourceInfoStyle}>
            {source_icon && <img src={source_icon || "/placeholder.svg"} alt={source} style={sourceIconStyle} />}
            <span style={sourceTextStyle}>{source}</span>
          </div>
          <div style={dateStyle}>
            <Clock size={12} />
            <span>{formatDate(publishedAt)}</span>
          </div>
        </div>

        {/* Content */}
        <div style={contentStyle}>
          <div style={textContentStyle}>
            {/* Categories */}
            {category && category.length > 0 && (
              <div style={categoriesStyle}>
                {category.map((cat, index) => (
                  <span key={index} style={categoryTagStyle}>
                    {cat}
                  </span>
                ))}
              </div>
            )}
            <h2
              style={titleStyle}
              onMouseOver={(e) => (e.target.style.color = "#2563eb")}
              onMouseOut={(e) => (e.target.style.color = "#111827")}
            >
              {title}
            </h2>

            <p style={descriptionStyle}>{description}</p>

            {/* Summary */}
            {currentSummary && (
              <div style={summaryStyle}>
                <h4 style={summaryTitleStyle}>Summary</h4>
                <p style={summaryTextStyle}>{currentSummary}</p>
              </div>
            )}

            {/* Actions */}
            <div style={actionsStyle}>
              <button
                onClick={handleSummarize}
                disabled={isLoading}
                style={{
                  ...primaryButtonStyle,
                  opacity: isLoading ? 0.5 : 1,
                  cursor: isLoading ? "not-allowed" : "pointer",
                }}
                onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = "#2563eb")}
                onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = "#3b82f6")}
              >
                <Bot size={14} style={isLoading ? { animation: "spin 1s linear infinite" } : {}} />
                {isLoading ? "Summarizing..." : "Summarize"}
              </button>

              <button
                onClick={handleChat}
                style={secondaryButtonStyle}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#1d4ed8")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#2563eb")}
              >
                <MessageCircle size={14} />
                Chat
              </button>

              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...outlineButtonStyle, textDecoration: "none" }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#f9fafb")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "white")}
              >
                <ExternalLink size={14} />
                Read More
              </a>
            </div>
          </div>

          {/* Image */}
          {urlToImage && (
            <div style={imageContainerStyle}>
              <img src={urlToImage || "/placeholder.svg"} alt={title} style={imageStyle} />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @media (min-width: 640px) {
          .content {
            flex-direction: row;
            gap: 16px;
          }
          
          .text-content {
            order: 1;
          }
          
          .image-container {
            width: 96px;
            height: 96px;
            order: 2;
          }
          
          .actions {
            flex-direction: row;
            gap: 12px;
          }
        }
        
        @media (min-width: 1024px) {
          .image-container {
            width: 128px;
            height: 128px;
          }
        }
      `}</style>
    </article>
  )
}
