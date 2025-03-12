import React, { useState, useEffect } from "react";
import appwriteService from "../appwrite/services";
import { useParams, useNavigate, Link } from "react-router-dom";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { ContentLoader } from "../components/Loaders";

function Post() {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);
  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    try {
      if (slug) {
        appwriteService.getPost(slug).then((post) => {
          if (post) setPost(post);
        });
      } else navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [slug, navigate]);

  const handleDelete = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage);
        navigate("/");
      }
    });
  };

  return loading ? (
    <ContentLoader />
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Image Section */}
        <div className="relative mb-10 rounded-3xl overflow-hidden shadow-2xl">
          {post.featuredImage ? (
            <div className="relative aspect-video">
              <img
                src={appwriteService.getFilePreview(post.featuredImage)}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent" />
            </div>
          ) : (
            <div className="w-full h-96 bg-gray-100 flex items-center justify-center rounded-3xl">
              <p className="text-gray-500 font-medium">No featured image</p>
            </div>
          )}

          {/* Author Actions */}
          {isAuthor && (
            <div className="absolute right-6 top-6 flex gap-3">
              <Link
                to={`/edit-post/${post.$id}`}
                className="inline-flex items-center bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <svg
                  className="w-5 h-5 text-green-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit
              </Link>
              <button
                onClick={handleDelete}
                className="inline-flex items-center bg-white/90 backdrop-blur-sm px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-shadow text-red-600"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Article Header */}
        <div className="max-w-3xl mx-auto mb-12 text-center">
          <div className="mb-6 flex justify-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
              {post.category || "Uncategorized"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-gray-600">
            <div className="flex items-center">
              <img
                src={
                  post.author?.avatar ||
                  "https://source.unsplash.com/random/100x100"
                }
                alt={post.author?.name}
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
              />
              <span className="ml-2 font-medium">
                {post.author?.name || "Anonymous"}
              </span>
            </div>
            <span>•</span>
            <time className="font-medium">
              {new Date(post.$createdAt).toLocaleDateString()}
            </time>
            <span>•</span>
            <span className="font-medium">{post.readTime || "5"} min read</span>
          </div>
        </div>

        {/* Article Content */}
        <article className="prose prose-lg max-w-3xl mx-auto px-4 sm:px-0">
          <div className="border-t border-gray-200 pt-12"></div>
          {post.content && typeof post.content === "string" ? (
            parse(post.content)
          ) : (
            <p className="text-gray-600 text-center">No content available</p>
          )}
        </article>

        {/* Social Sharing */}
        <div className="max-w-3xl mx-auto mt-16 border-t border-gray-200 pt-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>
              <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z" />
                </svg>
              </button>
            </div>
            <button className="flex items-center text-gray-600 hover:text-blue-600">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              Bookmark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
