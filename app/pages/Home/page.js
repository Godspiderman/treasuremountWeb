import HomePage from "./HomePage";

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

async function fetchHomeData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [
      latestRes,
      topRatedRes,
      bestSellingRes,
      categoriesRes,
      shopsRes,
      blogsRes,
      testimonialsRes,
      bannersRes,
    ] = await Promise.all([
      fetch(`${baseUrl}/api/public/product/homePageCarts?cart=LASTEST&limit=8`, { next: { revalidate: 60 } }).then((res) => res.json()),
      fetch(`${baseUrl}/api/public/product/homePageCarts?cart=TOP&limit=8`, { next: { revalidate: 60 } }).then((res) => res.json()),
      fetch(`${baseUrl}/api/public/product/homePageCarts?cart=BEST&limit=8`, { next: { revalidate: 60 } }).then((res) => res.json()),
      fetch(`${baseUrl}/api/public/subCategory/getAllSubCategory/1`, { next: { revalidate: 60 } }).then((res) => res.json()),
      fetch(`${baseUrl}/api/public/vendor/getAll`, { next: { revalidate: 60 } }).then((res) => res.json()),
      fetch(`${baseUrl}/api/public/blog/getByDate/LastThreeDate`, { next: { revalidate: 60 } }).then((res) => res.json()),
      fetch(`${baseUrl}/api/public/testimonial/getAll`, { next: { revalidate: 60 } }).then((res) => res.json()),
      fetch(`${baseUrl}/api/public/homePage1/getAll`, { next: { revalidate: 60 } }).then((res) => res.json()),
    ]);

    return {
      latestProducts: latestRes,
      topRatedProducts: topRatedRes,
      bestSellingProducts: bestSellingRes,
      categories: categoriesRes,
      shops: shopsRes,
      blogs: blogsRes,
      testimonials: testimonialsRes,
      banners: bannersRes,
    };
  } catch (error) {
    console.error("Error fetching home page data:", error);
    return {
      latestProducts: [],
      topRatedProducts: [],
      bestSellingProducts: [],
      categories: [],
      shops: [],
      blogs: [],
      testimonials: [],
      banners: [],
    };
  }
}

export default async function Home() {
  const data = await fetchHomeData();
  console.log(data);

  return <HomePage initialData={data} />;
}
