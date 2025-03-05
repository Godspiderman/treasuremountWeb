"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllBlogs } from "@/app/services/api";
import { useDispatch } from "react-redux";
import { startLoading, stopLoading } from "@/app/redux/slices/loadingSlice";

const Blogpage = () => {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        dispatch(startLoading());
        const response = await getAllBlogs();
        console.log("API Response: ", response);
        setBlogs(response);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        dispatch(stopLoading());
      }
    };

    fetchBlogs();
  }, []);

  

  const handleBlogClick = (id) => {
    router.push(`/pages/Blog/BlogView?id=${id}`);
  };

  return (
    <div className="blogpage">
     
        <div className="blogpageContainer">
          <div className="blogpageHead">
            <h2>Our Blog</h2>
            <p>Stay updated with our latest posts</p>
          </div>

          <div className="blogpageContainerContent">
            {blogs.map((blog) => (
              <div
                className="BlogContentCard"
                key={blog.id}
                onClick={() => handleBlogClick(blog.id)}
              >
                <img
                  src={blog.imageUrl}
                  alt="Blog image"
                  className="blogImage"
                />
                <h2>{blog.heading}</h2>
                <p>{blog.shortDescription}</p>
                <Link href={`/pages/Blog/BlogView?id=${blog.id}`}>
                  Read More
                </Link>
              </div>
            ))}
          </div>
        </div>
      
    </div>
  );
};

export default Blogpage;
