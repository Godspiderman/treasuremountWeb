"use client";
import { useSelector } from "react-redux";
import "./GlobalLoader.scss"; // Style for your loader
import { selectIsLoading } from "@/app/redux/slices/loadingSlice";

const GlobalLoader = () => {
  const isLoading = useSelector(selectIsLoading);

  if (!isLoading) return null;

  return (
    <div className="global-loader">
      <div className="spinner"></div>
    </div>
  );
};

export default GlobalLoader;
