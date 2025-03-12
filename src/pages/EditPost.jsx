import React, { useState, useEffect } from "react";
import { PostForm } from "../components";
import { useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/services";

function EditPost() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      setLoading(true);
      
      appwriteService.getPost(slug)
        .then((postData) => {
          if (postData) {
            setPost(postData);
          } else {
            setError("Post not found");
            navigate("/");
          }
        })
        .catch((err) => {
          setError(err.message || "An error occurred");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      navigate("/");
    }
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-lg text-red-600 mb-4">
          {error || "Post not found"}
        </div>
        <button 
          onClick={() => navigate("/")} 
          className="text-primary-600 hover:text-primary-700"
        >
          &larr; Back to Home
        </button>
      </div>
    );
  }

  // Only render PostForm when we have post data
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Edit Post</h1>
      <PostForm post={post} />
    </div>
  );
}

export default EditPost;
