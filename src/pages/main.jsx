import axios from 'axios';
import { useState, useEffect } from 'react';
import Navbar from '../component/navbar';
import Button from 'react-bootstrap/Button';
import NewsItem from '../component/nesitem';
import SkeletonLoader from '../component/SkeletonLoader';

function Main() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextPage, setNextPage] = useState(null); // Store the nextPage value
  const [page, setPage] = useState(1); // Track the current page number
  const ApiKey = process.env.REACT_APP_GNEWS_API_KEY;

  // Fetch everything
  const fetchEveryNews = async (page = null) => {
    setLoading(true);
    try {
      const response = await axios.get('https://newsdata.io/api/1/news', {
        headers: {
          'X-ACCESS-KEY': ApiKey, // Pass API key in the header
        },
        params: {
          language: 'en',
          page: page, // Include the page parameter if it exists
        },
      });

      console.log(response);

      // Extract articles and nextPage from the response
      const newArticles = response.data.results;
      const nextPage = response.data.nextPage;

      // Summarize each article (if content is available)
      const articlesWithSummaries = await Promise.all(
        newArticles.map(async (article) => {
          const summary = await summarizeArticle(article.description || article.content);
          return { ...article, summary };
        })
      );

      // Append new articles to the existing articles
      setArticles((prevArticles) => [...prevArticles, ...articlesWithSummaries]);

      // Update the nextPage value
      setNextPage(nextPage);

      // Increment the page number (optional, for UI purposes)
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
    setLoading(false);
  };

  // Summarize article content
  const summarizeArticle = async (content) => {
    if (!content) return 'No content available for summarization.'; // Handle empty content

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
      return 'Summary not available.';
    }
  };

  // Load more articles
  const loadMoreArticles = () => {
    if (nextPage) {
      fetchEveryNews(nextPage); // Fetch the next page of articles
    }
  };

  // Fetch initial articles on component mount
  useEffect(() => {
    fetchEveryNews();
  }, []);

  return (
    <div className="light-main-bg">
      <Navbar />
{/* Loading Indicator */}
{loading && (
        <div className="feed">
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </div>
      )}

      {/* News Feed */}
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
              url={item.url}
              publishedAt={item.pubDate}
              summary={item.summary} // Pass the summary to NewsItem
            />
          ))}
        </div>
      )}

      
      {/* Load More Button */}
      {nextPage && !loading && (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <Button variant="primary" onClick={loadMoreArticles}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

export default Main;