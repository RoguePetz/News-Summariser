import axios from 'axios';
import { useState, useEffect } from 'react';
import Navbar from '../component/navbar.jsx';
import NewsItem from '../component/nesitem';
import SkeletonLoader from '../component/SkeletonLoader';
import ImportedArticle from '../component/ImportedArticle';
import Chat from '../component/chat';
import { ChevronLeft, ChevronRight, TrendingUp, Clock, Eye } from "lucide-react"
import TrendingCard from "../component/trending-card"
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function Main() {
  const [showModal, setShowModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedNews, setSelectedNews] = useState(false);
  const [articles, setArticles] = useState([]);
  const [trendingNews, setTrendingNews] = useState([])
  const [trendingLoading, setTrendingLoading] = useState(false)
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [prevPages, setPrevPages] = useState([]); // Stack to track previous pages
  const [currentPage, setCurrentPage] = useState(1);
  const ApiKey = process.env.REACT_APP_GNEWS_API_KEY;
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    language: 'en',
    country: '',
    query: '',
  });
  const exportToExcel = () => {
    if (!articles || articles.length === 0) {
      alert("No articles available to export!");
      return;
    }

    // Map only relevant fields to include in Excel
    const dataToExport = articles.map((article, index) => ({
      "S/N": index + 1,
      Title: article.title,
      "Source Name": article?.source_name || "N/A",
      Creator: Array.isArray(article.creator)
        ? article.creator.join(", ") || "N/A"
        : article.creator || "N/A",
      "Published Date": article.pubDate,
      Link: article.link,
      Description: article.description || "N/A",

    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Articles");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, `news_export_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const fetchEveryNews = async (pageToken = null, isNewSearch = false) => {
    setLoading(true);
    try {
      const params = {
        language: activeFilters.language,
        domain: activeFilters?.country ? null : 'bbc,cnn,aljazeera,reuters'
      };

      if (pageToken) params.page = pageToken;
      if (activeFilters.category) params.category = activeFilters.category;
      if (activeFilters.country) params.country = activeFilters.country;
      if (activeFilters.query) params.q = activeFilters.query;

      const response = await axios.get('https://newsdata.io/api/1/news', {
        headers: {
          'X-ACCESS-KEY': ApiKey,
        },
        params: params,
      });

      const newArticles = response.data.results;
      const newNextPage = response.data.nextPage;

      setArticles(newArticles);
      setNextPage(newNextPage);

      if (isNewSearch) {
        setPrevPages([]); // Reset previous pages stack on new search
        setCurrentPage(1);
      } else if (pageToken) {
        // When navigating forward, push current page to history
        setPrevPages(prev => [...prev, currentPage]);
        setCurrentPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    }
    setLoading(false);
  };
  const fetchTrendingNews = async () => {
    setTrendingLoading(true);
    try {
      const response = await axios.get('https://newsdata.io/api/1/latest', {
        headers: {
          'X-ACCESS-KEY': ApiKey,
        },
        params: {
          language: 'en',
          category: 'top', // or 'technology', 'business' etc.
          domain: activeFilters?.country ? null : 'nytimes',
        },
      });

      if (response.data && response.data.results) {
        setTrendingNews(response.data.results.slice(0, 5)); // Take top 5
      }
    } catch (error) {
      console.error("Failed to fetch trending news:", error);
    }
    setTrendingLoading(false);
  };
  const handleNextPage = () => {
    if (nextPage) {
      fetchEveryNews(nextPage);
    }
  };

  const handlePrevPage = () => {
    if (prevPages.length > 0) {
      const prevPage = prevPages[prevPages.length - 1];
      const newPrevPages = prevPages.slice(0, -1); // Remove last page from history

      setPrevPages(newPrevPages);
      setCurrentPage(prev => prev - 1);
      fetchEveryNews(prevPage);
    }
  };

  const summarizeArticle = async (content, title = '') => {
    // Combine title and description for better summarization
    const fullContent = title ? `${title}. ${content}` : content;

    if (!fullContent) return 'No content available for summarization.';

    const cleanedContent = fullContent
      .replace(/<\/?[^>]+(>|$)/g, "")
      .replace(/\s+/g, " ")
      .trim();

    try {
      const response = await axios.post(
        'https://router.huggingface.co/hf-inference/models/facebook/bart-large-xsum',
        {
          inputs: cleanedContent,
          parameters: {
            max_length: 80,
            min_length: 30,
            num_beams: 4,          // Use beam search for better quality
            early_stopping: true,   // Stop early
            repetition_penalty: 1.2, // Avoid repeating phrases
            length_penalty: 0.8,    // Slightly encourage shorter summaries
            do_sample: false        // Keep it deterministic
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data[0].summary_text;
    } catch (error) {
      console.error('Error summarizing article:', error);
      return 'Error occurred while summarizing the article.';
    }
  };


  useEffect(() => {
    fetchEveryNews(null, true); // Initial load with new search
  }, [activeFilters]);
  useEffect(() => {
    // if (!articles) {
    fetchTrendingNews(); // Trending section
    // }
  }, [activeFilters]);

  return (
    <div className="main-container">
      <Navbar setActiveFilters={setActiveFilters} />

      {/* Add Article Button */}
      <button onClick={() => setShowModal(true)} className="add-button">
        +
      </button>
      {/* <div className="news-header">
        <h1>Latest News</h1>
        <p>Stay updated with the latest headlines</p>
        <button
          onClick={exportToExcel}
          className="export-btn"
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "8px 14px",
            cursor: "pointer",
            marginTop: "10px"
          }}
        >
          Export as Excel
        </button>
      </div> */}


      {/* Main Content */}
      <div className="content-wrapper">

        <div className="main-grid">
          {/* Main News Feed - Left Side */}
          <div className="news-feed">
            <div className="news-header">
              <h1>Latest News</h1>
              <p>Stay updated with the latest headlines</p>
            </div>

            {loading ? (
              <div className="skeleton-container">
                <SkeletonLoader />
                <SkeletonLoader />
                <SkeletonLoader />
              </div>
            ) : (
              <>
                <div className="news-list">
                  {articles.map((item, index) => (
                    <NewsItem
                      key={`${item.article_id}-${index}`}
                      source={item.source_name}
                      source_icon={item.source_icon}
                      title={item.title}
                      description={item.description}
                      urlToImage={item.image_url}
                      url={item.link}
                      publishedAt={item.pubDate}
                      summary={item.summary}
                      category={item.category}
                      summarizeArticle={summarizeArticle}
                      setShowChat={setShowChat}
                      setSelectedNews={setSelectedNews}
                      news={item}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="pagination">
                  <button
                    onClick={handlePrevPage}
                    disabled={prevPages.length === 0}
                    className={`pagination-btn ${prevPages.length === 0 ? "disabled" : ""}`}
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <span className="page-indicator">Page {currentPage}</span>

                  <button
                    onClick={handleNextPage}
                    disabled={!nextPage}
                    className={`pagination-btn ${!nextPage ? "disabled" : ""}`}
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Trending News Sidebar - Right Side */}
          <div className="trending-sidebar">
            <div className="trending-container">
              <div className="trending-header">
                <div className="trending-title">
                  <TrendingUp style={{ color: "#3b82f6" }} size={20} />
                  <h2>Trending Now</h2>
                </div>
                <p>Most popular stories today</p>
              </div>

              <div className="trending-list">
                {trendingLoading
                  ? Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="trending-skeleton">
                      <div className="trending-skeleton-content">
                        <div className="trending-skeleton-image"></div>
                        <div className="trending-skeleton-text">
                          <div className="trending-skeleton-line"></div>
                          <div className="trending-skeleton-line short"></div>
                          <div className="trending-skeleton-line shorter"></div>
                        </div>
                      </div>
                    </div>
                  ))
                  : trendingNews.map((article, index) => (
                    <TrendingCard key={article.article_id} article={article} rank={index + 1} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Chat showModal={showChat} setShowModal={setShowChat} selectedNews={selectedNews} />
      <ImportedArticle showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}

export default Main;