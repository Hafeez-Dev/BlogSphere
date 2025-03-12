import React from "react";
import { Link } from "react-router-dom";
import service from "../appwrite/services";
import parse from "html-react-parser";

function PostCard({ $id, title, featuredImage, $createdAt, content }) {
  return (
    <article className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <div className="relative h-48">
        <img
          src={service.getFilePreview(featuredImage)}
          alt={title}
          className="w-full h-full object-cover rounded-t-2xl"
        />
        <span className="absolute top-4 right-4 px-3 py-1 bg-white rounded-full text-sm font-medium text-blue-600">
          Technology
        </span>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <Link to={`/post/${$id}`}>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {title.slice(0, 50)}...
            </h3>
          </Link>
          <div className="text-gray-600 line-clamp-3 text-sm">
            {parse(content)}...
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={"https://source.unsplash.com/random/100x100"}
              alt="Author"
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">Abdul</p>
              <p className="text-xs text-gray-500">
                {new Date($createdAt).toLocaleDateString()} • 8m read
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-blue-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
    // <div className="flex items-center justify-center w-screen min-h-screen p-10">
    //   <div className="grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-2 max-w-6xl">
    //     <div className="flex flex-col bg-gray-200 rounded-lg p-4 m-2">
    //       <div className="h-40 bg-gray-400 rounded-lg">
    //         <img src={service.getFilePreview(featuredImage)} alt={title} />
    //       </div>
    //       <div className="flex flex-col items-start mt-4">
    //         <h4 className="text-xl font-semibold">{title}</h4>
    //         <Link
    //           to={`/post/${$id}`}
    //           className="p-2 leading-none rounded font-medium mt-3 bg-gray-400 text-xs uppercase"
    //         >
    //           Click Here
    //         </Link>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default PostCard;
