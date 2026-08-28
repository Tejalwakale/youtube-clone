// CategoryFilter component
const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {

  // Categories displayed at the top of the home page
  const categories = [
    "All",
    "Coding",
    "JavaScript",
    "Music",
    "Gaming",
    "News",
    "Comedy",
  ];

  return (
    <div className="category-container">

      {/* Display each category as a button */}
      {categories.map((category) => (
        <button
          key={category}
          className={
            selectedCategory === category
              ? "category-button active"
              : "category-button"
          }
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}

    </div>
  );
};

// Export CategoryFilter component
export default CategoryFilter;