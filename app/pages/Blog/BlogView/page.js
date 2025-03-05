"use client";

import { getBlogById, getBlogsByLastThreeDays } from "@/app/services/api";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/app/redux/slices/loadingSlice";
import {FaArrowRight } from "react-icons/fa";

const BlogpageView = () => {
  const searchParams = useSearchParams();
  const id = searchParams?.get("id");
    const router = useRouter();
  const [blog, setBlog] = useState(null);

  const [blogs, setBlogs] = useState([]);

   const dispatch = useDispatch();

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await getBlogsByLastThreeDays();   
      console.log("DSds",response);
      
      setBlogs(response);
    };

    fetchBlogs();
  }, []);
  const handleBlogView = async (id) => {
 
      router.push(`/pages/Blog/BlogView?id=${id}`);
    
  };
  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          dispatch(startLoading());
          const response = await getBlogById(id);
          setBlog(response);
        } catch (error) {
          console.error("Error fetching blog data:", error);
        }
        finally {
          dispatch(stopLoading());
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
          <img src={blog.imageUrl} alt={blog.heading} />
        </div>
        <h1>{blog.heading}</h1>
        {/* <h2>{blog.createdDate}</h2> */}
        <h2>
          {new Date(blog.createdDate)
            .toLocaleDateString("en-GB")
            .replace(/\//g, "-")}
        </h2>

        <p>{blog.shortDescription}</p>
        <p>{blog.description}</p>
      </div>

      <div className="blogViewCards">
        <div className="blog-head">
          <h3>RECENT</h3>
          <button  className="go-back-btn" onClick={() => router.back()}>Back</button>
        </div>
        <div className="blogviewRow">
          {Array.isArray(blogs) && blogs.length > 0 ? (
            blogs.map((recentBlog) => (
              <div className="blogViewCol" key={recentBlog.id}   onClick={() => handleBlogView(recentBlog.id)}>
                <img
                  className="blogViewCardImage"
                  src={recentBlog.imageUrl}
                  alt={`Recent Blog ${recentBlog.id}`}
                />
                <div className="blogViewCardText">
                  <p>{recentBlog.shortDescription}</p>
                </div>
              </div>
            ))
          ) : (
            <p>No recent blogs available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogpageView;
