import React, { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appwriteService from "../../appwrite/services";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function PostForm({ post }) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is logged in
  useEffect(() => {
    if (!userData) {
      navigate("/login");
    }
  }, [userData, navigate]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const submit = async (data) => {
    if (!userData) {
      setError("You must be logged in to create or edit posts");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (post) {
        // Update existing post
        const file = data.image?.[0]
          ? await appwriteService.uploadFile(data.image[0])
          : null;

        if (file && post.featuredImage) {
          await appwriteService.deleteFile(post.featuredImage);
        }

        const dbPost = await appwriteService.updatePost(post.$id, {
          ...data,
          featuredImage: file ? file.$id : undefined,
        });
        if (dbPost) {
          navigate(`/post/${dbPost.$id}`);
        }
      } else {
        // Create new post
        if (!data.image?.[0]) {
          setError("Featured image is required");
          setLoading(false);
          return;
        }

        const file = await appwriteService.uploadFile(data.image[0]);

        if (file) {
          data.featuredImage = file.$id;
          const dbPost = await appwriteService.createPost({
            ...data,
            userId: userData.$id,
          });

          if (dbPost) {
            navigate(`/post/${dbPost.$id}`);
          }
        }
      }
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const slugTransform = useCallback((value) => {
    if (value && typeof value === "string") {
      return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Z\d\s]/g, "-")
        .replace(/\s/g, "-")
        .substring(0, 20); // Limit slug to 20 characters
    }
    return "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(values.title), { shouldValidate: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);


  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Form header with animated gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent" />
          <h2 className="text-2xl font-bold text-white relative z-10">
            {post ? "Edit Post" : "Craft New Article"}
          </h2>
          <p className="text-blue-100/90 mt-1 relative z-10">
            Share your knowledge with the community
          </p>
        </div>

        {/* Error message with enter animation */}
        {error && (
          <div className="animate-fade-in-up mx-8 mt-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-500 shadow-sm">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="ml-3 flex-1">
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main form */}
        <form onSubmit={handleSubmit(submit)} className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Main content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Post Information Card */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
                  <svg
                    className="w-5 h-5 text-blue-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Article Details
                </h3>

                <div className="space-y-6">
                  <div className="relative form-group">
                    <Input
                      label="Title"
                      placeholder="The Ultimate Guide to Modern Web Development"
                      error={errors.title?.message}
                      icon={
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      }
                      {...register("title", {
                        required: "Title is required",
                      })}
                    />
                  </div>

                  <div className="relative form-group">
                    <Input
                      label="Slug"
                      placeholder="modern-web-dev-guide"
                      hint="Unique URL identifier (auto-generated from title)"
                      error={errors.slug?.message}
                      icon={
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                      }
                      {...register("slug")}
                      onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Content Editor Card */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
                  <svg
                    className="w-5 h-5 text-purple-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                  Article Content
                </h3>

                <div className="rounded-lg border border-gray-200 overflow-hidden shadow-inner">
                  <RTE
                    name="content"
                    control={control}
                    defaultValue={getValues("content")}
                    className="min-h-[400px]"
                  />
                </div>
              </div>
            </div>

            {/* Right column - Settings & Actions */}
            <div className="space-y-8">
              {/* Post Settings Card */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
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
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                  Publication Settings
                </h3>

                <div className="space-y-6">
                  <div className="form-group">
                    <Select
                      options={["draft", "active"]}
                      label="Status"
                      error={errors.status?.message}
                      icon={
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      }
                      {...register("status", {
                        required: "Status is required",
                      })}
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Drafts are only visible to you
                    </p>
                  </div>
                </div>
              </div>

              {/* Featured Image Card */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-5 flex items-center">
                  <svg
                    className="w-5 h-5 text-orange-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Featured Image
                </h3>

                <div className="form-group">
                  <input
                    type="file"
                    className="hidden"
                    id="featured-image"
                    accept="image/png, image/jpg, image/jpeg, image/webp"
                    {...register("image", {
                      required: !post ? "Featured image is required" : false,
                    })}
                  />
                  <label
                    htmlFor="featured-image"
                    className="group relative block w-full h-40 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer bg-white hover:bg-gray-50"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <svg
                        className="w-10 h-10 text-gray-400 group-hover:text-blue-500 mb-3 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <p className="text-sm text-gray-600 group-hover:text-gray-900 font-medium">
                        {post ? "Replace Image" : "Upload Image"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WEBP up to 5MB
                      </p>
                    </div>
                  </label>
                  {errors.image && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.image.message}
                    </p>
                  )}
                </div>

                {/* Image preview */}
                {post && post.featuredImage && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-600 mb-3">
                      Current Preview:
                    </p>
                    <div className="relative rounded-lg overflow-hidden shadow-md">
                      <img
                        src={appwriteService.getFilePreview(post.featuredImage)}
                        alt={post.title}
                        className="w-full h-auto object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  type="submit"
                  variant="gradient"
                  className="w-full py-3.5 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                      <span>
                        {post ? "Saving Changes..." : "Publishing..."}
                      </span>
                    </div>
                  ) : post ? (
                    "Update Article"
                  ) : (
                    "Publish Now"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full py-2.5 px-4 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium shadow-sm hover:shadow-md hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostForm;
