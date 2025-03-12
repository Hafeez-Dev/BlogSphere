import React, { useState, useEffect } from "react";
import appwriteService from "../appwrite/services";
import { PostCard } from "../components";
import { PostGridLoader } from "../components/Loaders";

function AllPost() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const postsCount = posts.length || 0;

  useEffect(() => {
    appwriteService.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents);
      }
    })
    .finally(() => setLoading(false));
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation - Same as Landing */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-sm border-b z-50">
        {/* Same navigation as previous design */}
      </nav>

      {/* Content Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              All Articles
            </h1>
            <p className="text-gray-600">
              Explore {postsCount}+ articles on various topics
            </p>
          </div>

          {/* Enhanced Filters */}
          <div className="w-full md:w-auto flex flex-col gap-4">
            <div className="relative w-full md:w-96">
              <input
                type="search"
                placeholder="Search articles..."
                className="w-full px-6 py-3 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <svg
                className="w-5 h-5 absolute right-4 top-3.5 text-gray-400"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "All",
                "Technology",
                "Design",
                "Development",
                "Career",
                "React",
                "JavaScript",
              ].map((tag) => (
                <button
                  key={tag}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${
                      selectedTag === tag
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <PostGridLoader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.$id} {...post} />
            ))}
          </div>
        )}
        {/* Pagination */}
        <div className="mt-16 flex justify-center gap-2">
          <button className="px-4 py-2 rounded-lg bg-white text-gray-600 hover:bg-gray-50">
            Previous
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className={`px-4 py-2 rounded-lg ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}
          <button className="px-4 py-2 rounded-lg bg-white text-gray-600 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AllPost;
