import React, { useState, useEffect, useRef } from "react";
import { copy, linkIcon,  tick } from "../assets/";
import loader from '../assets/loader.svg'
import { useLazyGetSummaryQuery } from "../services/article";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [showSummary, setShowSummary] = useState(false);
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");
  const summaryRef = useRef(null);

  // RTK lazy query
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    // Clear local storage to remove older search history on page refresh
    localStorage.removeItem("articles");
  
    const articlesFromLocalStorage = JSON.parse(localStorage.getItem("articles"));
    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  
    // Function to handle click outside the search and summary sections
    const handleClickOutside = (event) => {
      if (
        summaryRef.current &&
        !summaryRef.current.contains(event.target) &&
        !event.target.closest(".search-section")
      ) {
        setArticle({ url: "", summary: "" });
        setShowSummary(false);
      }
    };
  
    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutside);
  
    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [summaryRef]);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const existingArticle = allArticles.find((item) => item.url === article.url);
  
    if (existingArticle) {
      setArticle(existingArticle);
      setShowSummary(true);
      return;
    }
  
    setShowSummary(false); // Hide previous summary while fetching new data
    setLoading(true); 
    // Start fetching and show the loader
    try {
      const { data } = await getSummary({ articleUrl: article.url });
      if (data?.summary) {
        const newArticle = { ...article, summary: data.summary };
        const updatedAllArticles = [newArticle, ...allArticles];
  
        setArticle(newArticle);
        setAllArticles(updatedAllArticles);
        localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
        setShowSummary(true);
      }
    } catch (error) {
      console.error("Error fetching article summary:", error);
    }  finally {
      setLoading(false); // Set loading to false
    }
  };
   
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e); // Call handleSubmit on Enter key press
    }
  };
  

  const handleCopy = (url) => {
    setCopied(url);
    navigator.clipboard.writeText(url);
    setTimeout(() => setCopied(""), 3000); // Clear the copied state after 3 seconds
  };
  const handleHistoryLinkClick = async (selectedArticle) => {
    setArticle(selectedArticle);
    setShowSummary(false); // Hide the summary while fetching new data
  
    const existingArticle = allArticles.find(
      (item) => item.url === selectedArticle.url
    );
  
    if (existingArticle) {
      setArticle(existingArticle);
      setShowSummary(true); // Display the summary once found in history
    } else {
      const { data } = await getSummary({ articleUrl: selectedArticle.url });
      if (data?.summary) {
        const updatedArticle = { ...selectedArticle, summary: data.summary };
        setArticle(updatedArticle);
        setShowSummary(true); // Display the summary once fetched
      } // Display the summary once fetched
    }
  };

  
  
  return (
    <section
      className={`search-summary-container ${
        showSummary ? "show-summary" : ""
      }`}
    >
      {/* Search Section */}
      <div className={`search-section flex flex-col gap-2 ${
         showSummary ? "w-1/2" : "w-full"
           }`}
           >
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link-icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            type="url"
            placeholder="Paste the article link"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            onKeyDown={handleKeyDown}
            required
            className="url_input peer"
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            ↵
          </button>
        </form>


        {loading && (
        <div className="loader-container">
          <img src={loader} alt="loader" className="loader w-20 h-20 object-contain" />
        </div>
      )}

        {/* Browse History */}
        <div className={`flex flex-col gap-1 max-h-60 overflow-y-auto ${loading ? ' ' : ''}`}>
        {allArticles.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => handleHistoryLinkClick(item)}
              className="link_card"
            >
              <div className="copy_btn" onClick={() => handleCopy(item.url)}>
                <img
                  src={copied === item.url ? tick : copy}
                  alt={copied === item.url ? "tick_icon" : "copy_icon"}
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Section */}
      {showSummary && (
        <div
          ref={summaryRef}
          className={`summary-section summary_box ${
            showSummary ? "visible" : "hidden"
          }`}
        >
          {isFetching ? (
            <img src={loader} alt="loader" className="loader w-20 h-20 object-contain" />
          ) : error ? (
            <p className="font-inter font-bold text-black text-center">
              Well, that wasn't supposed to happen...
              <br />
              <span className="font-satoshi font-normal text-gray-700">
                {error?.data?.error}
              </span>
            </p>
          ) : (
            article.summary && (
              <div className="flex flex-col gap-3">
                <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                  Article <span className="blue_gradient">Summary</span>
                </h2>
                <p className="font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
};

export default Demo;
