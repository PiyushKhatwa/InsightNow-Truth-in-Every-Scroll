import React from 'react';

function NewsCards(props) {
  let { sourceName, newsUrl, imageUrl, title, authorName, publishedAt } = props;
  
  return (
    <div className="card h-100 shadow-sm">
      <img 
        src={imageUrl} 
        className="card-img-top" 
        alt="News thumbnail"
        style={{ 
          height: '200px',
          objectFit: 'cover'
        }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{title}</h5>
        <div className="card-text mb-3">
          <small className="text-muted d-block">
            <strong>Source:</strong> {sourceName}
          </small>
          <small className="text-muted d-block">
            <strong>Author:</strong> {authorName}
          </small>
          <small className="text-muted d-block">
            <strong>Published:</strong> {new Date(publishedAt).toLocaleDateString()}
          </small>
        </div>
        <a 
          href={newsUrl} 
          target='_blank' 
          rel="noopener noreferrer"
          className="btn btn-primary mt-auto"
        >
          Read More
        </a>
      </div>
    </div>
  );
}

export default NewsCards;
