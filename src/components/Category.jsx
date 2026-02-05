import React from 'react';

function Category({ setCategory, isLoggedIn }) {
  // List of categories
  const categories = ['general', 'health', 'business', 'entertainment', 'sports', 'technology', 'science'];

  return (
    <div className="container my-4">
      <div className="row justify-content-center g-2">
        {categories.map((category) => (
          <div className="col-auto" key={category}>
            <button
              className="btn btn-outline-primary"
              onClick={() => setCategory(category)}
              disabled={!isLoggedIn}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;
