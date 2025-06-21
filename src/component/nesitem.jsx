import React, { useState } from "react";
import SkeletonLoader from "./SkeletonLoader";
import gotolink from '../assets/images/share.png';
import aichat from '../assets/images/newspaper (1).png';
import save from '../assets/images/save-instagram.png';
import { FaRobot } from 'react-icons/fa';
import { Spinner } from 'react-bootstrap';

const NewsItem = ({ source, source_icon, title, description, urlToImage, url, publishedAt, summary, category, summarizeArticle, setShowChat, setSelectedNews, news }) => {
  const [articleSummary, setArticleSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);

  const handleSummarize = async () => {
    setLoadingSummary(true);
    const summarizedText = await summarizeArticle(description || articleSummary || title);
    setArticleSummary(summarizedText);
    setLoadingSummary(false);
  };

  return (
    <div style={{
      background: "white",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      marginBottom: "20px",
      border: "1px solid #e1e5e9"
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: "16px" }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: "10px" }}>
          {source_icon ? (
            <img
              src={source_icon}
              alt="Profile"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover"
              }}
            />
          ) : (
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#f0f4f8"
            }}></div>
          )}
          <div>
            <div style={{ fontWeight: "600", color: "#333" }}>{source}</div>
            <div style={{ fontSize: "12px", color: "#666" }}>
              {new Date(publishedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <button
          onClick={handleSummarize}
          disabled={loadingSummary}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 12px",
            background: "#3a7bd5",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
        >
          {loadingSummary ? (
            <Spinner
              animation="grow"
              variant="light"
              size="sm"
            />
          ) : (
            <>
              <FaRobot size={16} />
              <span>Summarize</span>
            </>
          )}
        </button>
      </div>

      {category && category.length > 0 && (
        <div style={{ display: 'flex', gap: "8px", marginBottom: "12px" }}>
          {category.map((cat, index) => (
            <span
              key={index}
              style={{
                padding: "4px 8px",
                background: "#f0f4f8",
                borderRadius: "4px",
                fontSize: "12px",
                color: "#3a7bd5",
                fontWeight: "500"
              }}
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      <h3 style={{
        fontSize: "18px",
        fontWeight: "600",
        color: "#333",
        marginBottom: "12px",
        lineHeight: "1.4"
      }}>
        {title}
      </h3>

      <div style={{
        fontSize: "14px",
        color: "#555",
        marginBottom: "16px",
        lineHeight: "1.5"
      }}>
        {loadingSummary ? (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Spinner animation="grow" variant="dark" size="sm" />
            <span>Summarising...</span>
          </div>
        ) : articleSummary ? (
          <div>
            <strong style={{ color: "#333" }}>Summary:</strong>
            <p style={{ marginTop: "8px" }}>{articleSummary}</p>
          </div>
        ) : (
          description
        )}
      </div>

      {urlToImage && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: "16px",
          borderRadius: "8px",
          overflow: "hidden"
        }}>
          <img
            src={urlToImage}
            alt={title}
            style={{
              maxWidth: "100%",
              maxHeight: "300px",
              borderRadius: "8px",
              objectFit: "cover"
            }}
          />
        </div>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: "space-between",
        paddingTop: "12px",
        borderTop: "1px solid #f0f4f8"
      }}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#3a7bd5",
            textDecoration: "none",
            fontSize: "14px"
          }}
        >
          <img src={gotolink} width={20} alt="Read full article" />
          <span>Read</span>
        </a>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            color: "#666",
            fontSize: "14px"
          }}
          onClick={() => {
            setShowChat(true)
            setSelectedNews(news)
          }}
        >
          <img src={aichat} width={22} alt="AI Chat" />
          <span>Discuss</span>
        </div>

        <button style={{
          background: "none",
          border: "none",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "#666",
          fontSize: "14px",
          cursor: "pointer"
        }}
        >
          <img src={save} width={18} alt="Save" />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default NewsItem;