import React from "react";
import SkeletonLoader from "./SkeletonLoader";
import gotolink from '../assets/images/share.png'
import aichat from '../assets/images/newspaper (1).png'
import save from '../assets/images/save-instagram.png'
const NewsItem = ({ source,source_icon, title, description, urlToImage, url, publishedAt, summary,category }) => {
  // if (!urlToImage) {
  //   return <SkeletonLoader />; // Render skeleton if no image is available
  // }

  console.log(category)
  return (
    <div>
      
      <div className="tweet-card">
      <div className="tweet-profile-pic">
        {source_icon?<img
          src={source_icon} // Replace with actual profile picture URL
          alt="Profile"
          className="profile-pic"
        />:
        <div className="tweet-profile-pic skeleton-pic"></div>}
      </div>
        <div className="tweet-header">
            <strong>{source}</strong> · {new Date(publishedAt).toLocaleDateString()}
        </div>
        {/* Add category tags here */}
        {category && category.length > 0 && (
          <div className="category-tags">
            {category.map((cat, index) => (
              <span key={index} className="category-tag">
                {cat}
              </span>
            ))}
          </div>
        )}
        <div className="tweet-title">{title}</div>
        <div className="tweet-description">{summary||description}</div>
        
        <div style={{display:'flex',justifyContent:'center'}}>
         {urlToImage && <img src={urlToImage} alt={title} className="tweet-image" />}
        </div>
        <div style={{display:'flex', alignItems:'center',gap:'30px'}}>
          <div className="">
            <a href={url} target="_blank" rel="noopener noreferrer" >
              <img src={gotolink} width={30} className=""/>
            </a>
          </div>
          <div>
            <img src={aichat} width={35}/>
          </div>
          <div>
            <img src={save} width={25}/>
          </div>
        </div>
        
    </div>
    </div>
    

  );
};

export default NewsItem;