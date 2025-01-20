"use client";

import { getBlogById } from "@/app/services/api";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

const BlogpageView = () => {
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
  const [blog, setBlog] = useState(null);

  const recentBlogs = [
    {
      id: 1,
      image: "/image/tap-1.png",
      shortDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    },
    {
      id: 2,
      image: "/image/tap-3.png",
      shortDescription: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 3,
      image: "/image/tap-4.png",
      shortDescription: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    },
  ];

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const response = await getBlogById(id);
          setBlog(response);
        } catch (error) {
          console.error("Error fetching blog data:", error);
        }
      };
      fetchBlog();
    }
  }, [id]);

  if (!blog) {
    return <p>Loading...</p>;
  }

  return (
    <div className="blogViewContainer">
      <div className="blogViewDetails">
        <div className="blogImg">
          <img src={blog.image} alt={blog.heading} />
        </div>
        <h1>{blog.heading}</h1>
        <h2>{blog.createdDate}</h2>
        <p>{blog.shortDescription}</p>
        <p>{blog.description}</p>
      </div>

      <div className="blogViewCards">
        <h3>RECENT</h3>
        <div className="blogviewRow">
          {recentBlogs.map((recentBlog) => (
            <div className="blogViewCol" key={recentBlog.id}>
              <img className="blogViewCardImage" src={recentBlog.image} alt={`Recent Blog ${recentBlog.id}`} />
              <div className="blogViewCardText">
                <p>{recentBlog.shortDescription}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogpageView;
