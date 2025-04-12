import React from "react";

const SkeletonLoader = () => {
  return (
    <div>

      <div className="tweet-card">
        {/* Profile Picture Skeleton */}
        <div className="tweet-profile-pic skeleton-pic"></div>

        {/* Content Skeleton */}
        <div className="tweet-content" style={{width:'100%'}}>
          <div className="tweet-header skeleton-header"></div>
          <div className="tweet-title skeleton-title"></div>
          <div className="tweet-description skeleton-description"></div>
          <div className="tweet-image skeleton-image"></div>
          <div className="tweet-link skeleton-link"></div>
        </div>
      </div>
    </div>
    
  );
};

export default SkeletonLoader;