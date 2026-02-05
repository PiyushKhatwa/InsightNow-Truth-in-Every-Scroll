import React, { useState, useEffect } from 'react';
import NewsCards from './NewsCards';
import Category from './Category';

function NewsItems({ category, setCategory, country, isLoggedIn }) {

    const [articles, setArticles] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    const resultNews = async () => {
        setLoading(true);
        setError(null);

        try {

            const response = await fetch(
                `${API_BASE}/api/news?country=${country}&category=${category}&page=${pageNumber}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const parsedData = await response.json();

            if (!parsedData.articles || parsedData.articles.length === 0) {
                setError("No articles found.");
                setArticles([]);
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
                <p>You need to be logged in to access news articles.</p>
                <a href="/sign-in" className="btn btn-primary">Sign In</a>
            </div>
        );
    }

    return (
        <div className="container mt-4">

            <Category setCategory={setCategory} isLoggedIn={isLoggedIn} />

            {loading ? (
                <div className="text-center my-5">
                    <div className="spinner-border text-primary" role="status"></div>
                </div>
            ) : error ? (
                <div className="text-center my-5">
                    <div className="alert alert-warning">{error}</div>
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
                    <div className="row g-4">
                        {articles.map((element) => (
                            <div className="col-md-4" key={element.url}>
                                <NewsCards
                                    imageUrl={
                                        element.urlToImage ||
                                        'https://via.placeholder.com/300x200?text=No+Image'
                                    }
                                    title={element.title}
                                    newsUrl={element.url}
                                    sourceName={element.source?.name}
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
                            ← Previous
                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={pageNextHandler}
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default NewsItems;
