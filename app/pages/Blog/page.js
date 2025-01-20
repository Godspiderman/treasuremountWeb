"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllBlogs } from "@/app/services/api";

const Blogpage = () => {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      const response = await getAllBlogs();
      setBlogs(response);
      console.log(response);
      
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
              onClick={() => handleBlogClick(blog.id)} // Passing the blog's ID here
            >
              <img
                src="/image/home-72.png"
                alt="pet img"
                className="blogImage"
              />
              <h2>{blog.heading}</h2>
              <p>{blog.shortDescription}</p>
              <Link href={`/pages/Blog/BlogView?id=${blog.id}`}>Read More</Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blogpage;
