import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '../component/navbar';
import Button from 'react-bootstrap/Button';
import NewsItem from '../component/nesitem';
import SkeletonLoader from '../component/SkeletonLoader';
import { createWorker } from 'tesseract.js';

function Main() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [page, setPage] = useState(1);
  const ApiKey = process.env.REACT_APP_GNEWS_API_KEY;
  const [imageText, setImageText] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    category: '',
    language: 'en',
    country: '',
    query: ''
  });
  const [expandedText, setExpandedText] = useState('');



  const extractText = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const worker = await createWorker();
      const { data: { text } } = await worker.recognize(file);
      setImageText(text);
      await worker.terminate();
      await expandText(text);
    };
    input.click();
  };

  // useEffect(() => {
  //   const processImageText = async () => {
  //     if (imageText) {
  //       try {
  //         const summary = await summarizeArticle(imageText);
  //         console.log('Summary:', summary);
  //       } catch (error) {
  //         console.error('Error summarizing extracted text:', error);
  //       }
  //     }
  //   };
  //   processImageText();
  // }, [imageText]);


  const expandText = async (text) => {
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
        {
          inputs: `Expand the following text in detail: "${text}"`,
          parameters: { min_length: 300 }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setExpandedText(response.data[0]?.summary_text || "No expansion available.");
    } catch (error) {
      console.error("Hugging Face BART failed:", error);
      setExpandedText("Expansion service failed. Original text: " + text);
    }
  };

  const fetchEveryNews = async (page = null, reset = false) => {
    setLoading(true);
    try {
      const params = {
        language: activeFilters.language,
        page: page,
      };

      // Only add filters if they have values
      if (activeFilters.category) params.category = activeFilters.category;
      if (activeFilters.country) params.country = activeFilters.country;
      if (activeFilters.query) params.q = activeFilters.query;

      console.log('Fetching with params:', params);

      const response = await axios.get('https://newsdata.io/api/1/news', {
        headers: {
          'X-ACCESS-KEY': ApiKey,
        },
        params: params,
      });

      const newArticles = response.data.results;
      const nextPage = response.data.nextPage;

      const articlesWithSummaries = await Promise.all(
        newArticles.map(async (article) => {
          const summary = await summarizeArticle(article.description || article.content);
          return { ...article, summary };
        })
      );

      if (reset) {
        setArticles(articlesWithSummaries);
      } else {
        setArticles((prevArticles) => [...prevArticles, ...articlesWithSummaries]);
      }

      setNextPage(nextPage);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
    setLoading(false);
  };

  const summarizeArticle = async (content) => {
    if (!content) return 'No content available for summarization.';
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
        { inputs: content },
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
      return '';
    }
  };

  // const loadMoreArticles = () => {
  //   if (nextPage) {
  //     fetchEveryNews(nextPage);
  //   }
  // };

  // Fetch news whenever filters change
  useEffect(() => {
    fetchEveryNews(null, true);
  }, [activeFilters]);

  return (
    <div className="light-main-bg">
      <Navbar setActiveFilters={setActiveFilters} />
      
      <div className="add-button" onClick={extractText}>
        +
      </div>

      {loading && (
        <div className="feed">
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </div>
      )}

      {!loading && (
        <div className="feed">
          {articles.map((item, index) => (
            <NewsItem
              key={index}
              source={item.source_name}
              source_icon={item.source_icon}
              title={item.title}
              description={item.description}
              urlToImage={item.image_url}
              url={item.link}
              publishedAt={item.pubDate}
              summary={item.summary}
            />
          ))}
        </div>
      )}

      {/* {nextPage && !loading && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <Button variant="primary" onClick={loadMoreArticles}>
            Load More
          </Button>
        </div>
      )} */}
    </div>
  );
}

export default Main;