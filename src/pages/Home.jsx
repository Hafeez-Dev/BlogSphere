import React, { useState, useEffect } from "react";
import appwriteService from "../appwrite/services";
import { PostCard } from "../components";
import { Link } from "react-router-dom";
import { PostGridLoader } from "../components/Loaders";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await appwriteService.getPosts();
        if (response) {
          // Sort posts by date (newest first) and take first 6
          const sortedPosts = response.documents.sort(
            (a, b) => new Date(b.$createdAt) - new Date(a.$createdAt)
          );
          setPosts(sortedPosts.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to fetch posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative pt-24 pb-28 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Explore the World of Ideas
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Dive into a universe of knowledge spanning technology, design,
              development, and innovation. Curated content for curious minds.
            </p>
          </div>

          {/* Enhanced Search */}
          <div className="max-w-2xl mx-auto mb-16 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative flex items-center bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <input
                type="text"
                placeholder="Search articles, topics, or authors..."
                className="w-full px-6 py-4 rounded-xl border-0 focus:ring-0 text-lg placeholder-gray-400"
              />
              <button className="pr-6">
                <svg
                  className="w-6 h-6 text-gray-400 hover:text-blue-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Dynamic Categories */}
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "All Topics",
              "Web Development",
              "AI & ML",
              "Design Systems",
              "Career Growth",
              "DevOps",
            ].map((category) => (
              <button
                key={category}
                className="px-5 py-2.5 rounded-full bg-white border hover:border-blue-500 text-gray-600 hover:text-blue-600 
                         shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-28">
        <div className="flex items-end justify-between mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Trending Articles
          </h2>
          <Link
            to="/all-posts"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            View All
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>

        {loading ? (
          <PostGridLoader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard key={post.$id} {...post} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Get exclusive access to premium content, expert insights, and
              early updates. Elevate your learning journey today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-lg bg-white/10 border border-white/20 placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-opacity-90 transition-opacity">
              Get Started Free
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
