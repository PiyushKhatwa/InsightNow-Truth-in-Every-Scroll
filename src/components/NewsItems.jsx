import React, { useState, useEffect } from 'react';
import NewsCards from './NewsCards';
import Category from './Category';

function NewsItems({ category, setCategory, country, isLoggedIn, setIsLoggedIn }) {
    const [articles, setArticles] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState(null);

    const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'a63ab02946b640f1a45559f967c8e017';
    const countryLabels = {
        in: 'India',
        us: 'USA',
        cn: 'China',
        ru: 'Russia',
        jp: 'Japan',
        fr: 'France',
        ca: 'Canada',
        br: 'Brazil',
        hk: 'Hong Kong',
        ae: 'UAE'
    };

    const resultNews = async () => {
        setLoading(true);
        setError(null);
        setInfo(null);
        
        const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${NEWS_API_KEY}&pageSize=20&page=${pageNumber}`;
        console.log("Fetching URL:", url);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const parsedData = await response.json();
            console.log("API Response:", parsedData);

            if (parsedData.status !== "ok") {
                throw new Error(parsedData.message || "Failed to fetch news");
            }

            if (!parsedData.articles || parsedData.articles.length === 0) {
                const countryLabel = countryLabels[country] || country.toUpperCase();
                const fallbackUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(countryLabel)}&apiKey=${NEWS_API_KEY}&pageSize=20&page=${pageNumber}&sortBy=publishedAt&language=en`;
                console.log("Fallback URL:", fallbackUrl);

                const fallbackResponse = await fetch(fallbackUrl);
                if (!fallbackResponse.ok) {
                    throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
                }
                const fallbackData = await fallbackResponse.json();
                console.log("Fallback API Response:", fallbackData);

                if (fallbackData.status !== "ok") {
                    throw new Error(fallbackData.message || "Failed to fetch news");
                }

                if (!fallbackData.articles || fallbackData.articles.length === 0) {
                    setError("No articles found. Try selecting a different category or country.");
                    setArticles([]);
                    return;
                }

                setInfo(`No top headlines for ${countryLabel}. Showing related articles instead.`);
                setArticles(fallbackData.articles);
                return;
            }

            setArticles(parsedData.articles);
        } catch (error) {
            console.error("Error fetching news:", error);
            setError("Failed to fetch news. Please try again later.");
            setArticles([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        resultNews();
    }, [category, country, pageNumber]);

    useEffect(() => {
        setPageNumber(1);
    }, [category, country]);

    const pagePreviousHandler = () => {
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    const pageNextHandler = () => {
        setPageNumber(pageNumber + 1);
    };

    if (!isLoggedIn) {
        return (
            <div className="container text-center mt-5">
                <h2>Please Sign In to View News</h2>
                <p>You need to be logged in to access the news articles.</p>
                <a href="/sign-in" className="btn btn-primary">Sign In</a>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Category setCategory={setCategory} isLoggedIn={isLoggedIn} />
            
            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="text-center my-5">
                    <div className="alert alert-warning" role="alert">
                        {error}
                    </div>
                    <button 
                        className="btn btn-primary mt-3"
                        onClick={() => {
                            setCategory('general');
                            setPageNumber(1);
                        }}
                    >
                        Try General News
                    </button>
                </div>
            ) : (
                <>
                    {info && (
                        <div className="alert alert-info" role="alert">
                            {info}
                        </div>
                    )}
                    <div className="row g-4">
                        {articles.map((element) => (
                            <div className="col-md-4" key={element.url}>
                                <NewsCards
                                    imageUrl={element.urlToImage || 'https://via.placeholder.com/300x200?text=No+Image'}
                                    title={element.title}
                                    newsUrl={element.url}
                                    sourceName={element.source.name}
                                    description={element.description}
                                    authorName={element.author || 'Anonymous'}
                                    publishedAt={element.publishedAt}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="d-flex justify-content-between my-4">
                        <button 
                            disabled={pageNumber === 1} 
                            className="btn btn-primary" 
                            onClick={pagePreviousHandler}
                        >
                            &larr; Previous
                        </button>
                        <button 
                            className="btn btn-primary" 
                            onClick={pageNextHandler}
                        >
                            Next &rarr;
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default NewsItems;
