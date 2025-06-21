import axios from 'axios';
import { useState, useEffect } from 'react';
import Navbars from '../component/Navbar';
import NewsItem from '../component/nesitem';
import SkeletonLoader from '../component/SkeletonLoader';
import ImportedArticle from '../component/ImportedArticle';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Chat from '../component/chat';

function Main() {
  const [showModal, setShowModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedNews, setSelectedNews] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [prevPages, setPrevPages] = useState([]); // Stack to track previous pages
  const [currentPage, setCurrentPage] = useState(1);
  const ApiKey = process.env.REACT_APP_GNEWS_API_KEY;
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    language: 'en',
    country: '',
    query: ''
  });

  const fetchEveryNews = async (pageToken = null, isNewSearch = false) => {
    setLoading(true);
    try {
      const params = {
        language: activeFilters.language,
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

  const summarizeArticle = async (content) => {
    if (!content) return 'No content available for summarization.';

    const cleanedContent = content.replace(/<\/?[^>]+(>|$)/g, "").replace(/\s+/g, " ").trim();

    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/google/pegasus-xsum',
        { inputs: cleanedContent },
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

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f5f7fa',
      paddingBottom: '40px',
      position: 'relative'
    }}>
      <Navbars setActiveFilters={setActiveFilters} />

      <button
        onClick={() => setShowModal(true)}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#3a7bd5',
          color: 'white',
          border: 'none',
          fontSize: '30px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        +
      </button>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        position: 'relative'
      }}>
        {loading ? (
          <div style={{
            // display: 'grid',
            // gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </div>
        ) : (
          <>
            <div style={{
              // display: 'grid',
              // gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px',
              marginTop: '50px'
            }}>
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

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '20px',
              marginTop: '40px'
            }}>
              <button
                onClick={handlePrevPage}
                disabled={prevPages.length === 0}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: prevPages.length > 0 ? '#3a7bd5' : '#e1e5e9',
                  color: 'white',
                  border: 'none',
                  cursor: prevPages.length > 0 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                <ChevronLeft size={24} />
              </button>

              <span style={{
                fontSize: '16px',
                fontWeight: '500',
                color: '#333'
              }}>
                Page {currentPage}
              </span>

              <button
                onClick={handleNextPage}
                disabled={!nextPage}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: nextPage ? '#3a7bd5' : '#e1e5e9',
                  color: 'white',
                  border: 'none',
                  cursor: nextPage ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </>
        )}
      </div>
      <Chat showModal={showChat} setShowModal={setShowChat} selectedNews={selectedNews} />
      <ImportedArticle showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
}

export default Main;