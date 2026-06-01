import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BlogItem } from "./Components/BlogItem";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import http from "../../http";
import "./Css/Blog.css";
import "./Css/BlogResponsive.css";
import { FooterBlog, HeaderBlog } from "../../components";
import Loader from "../../components/Loader/Loader";
import { optimizeImage } from "../../utils/optimizeImage";

export const Blog = () => {
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [popularblogs, setPopularBlogs] = useState([]);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogCategories, setBlogCategories] = useState([]);
  const [allblogCategories, setAllBlogCategories] = useState([]);
  const [blogTags, setBlogTags] = useState([]);
  const [blogvedio, setBlogVedio] = useState("");

  const [blogBanner, setBlogBanner] = useState([]);
  const [blogBannerimageBaseUrl, setBlogBannerImageBaseUrl] = useState("");

  const location = useLocation();
  const pathName = location.pathname;

  // SEARCH QUERY
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search") || "";

  let urlLastSegment = "";
  let urlTagLastSegment = "";

  // CATEGORY URL
  if (pathName.includes("/category")) {
    urlLastSegment = pathName.split("/").filter(Boolean).pop();
  }

  // TAG URL
  if (pathName.includes("/tag")) {
    urlTagLastSegment = pathName.split("/").filter(Boolean).pop();
  }

  const blogsPerPage = 3;

  // FETCH BLOGS
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);

      try {
        const getresponse = await http.get("/blogs");

        const dataBlogs = getresponse.data;

        const decodedCategory = decodeURIComponent(urlLastSegment || "");

        const decodedTag = decodeURIComponent(urlTagLastSegment || "").replace(
          /-/g,
          " ",
        );

        let filteredBlogs = dataBlogs.data;

        // CATEGORY FILTER
        if (urlLastSegment) {
          filteredBlogs = filteredBlogs.filter(
            (datablog) =>
              datablog.head_category_slug?.toLowerCase() ===
              decodedCategory.toLowerCase(),
          );
        }

        // TAG FILTER
        else if (urlTagLastSegment) {
          filteredBlogs = filteredBlogs.filter((dtBl) => {
            let tags = [];
            try {
              tags = JSON.parse(dtBl.tags || "[]");
            } catch (e) {
              console.warn("Invalid tags JSON:", dtBl.tags);
            }
            return tags.some(
              (tag) => tag.toLowerCase() === decodedTag.toLowerCase(),
            );
          });
        }

        // SEARCH FILTER
        if (searchQuery) {
          filteredBlogs = filteredBlogs.filter(
            (blog) =>
              blog.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              blog.blog_description
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              blog.short_description
                ?.toLowerCase()
                .includes(searchQuery.toLowerCase()),
          );
        }

        setBlogs(filteredBlogs);
        setPopularBlogs(dataBlogs.popularblog);
        setImageBaseUrl(dataBlogs.image_url);
        setBlogBanner(dataBlogs.blog_banner);
        setBlogBannerImageBaseUrl(dataBlogs.banner_image_url);
        setBlogVedio(dataBlogs.blog_vedio);

        // RESET PAGINATION
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [pathName, urlLastSegment, urlTagLastSegment, searchQuery]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const getresponse = await http.get("/fetch-blog-tags");
        const dataCategoriesTags = getresponse.data;

        setBlogCategories(dataCategoriesTags.blog_category);
        setBlogTags(dataCategoriesTags.data);

        setAllBlogCategories(dataCategoriesTags.allBlog_categories);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  const handlePageChange = (pageNumber) => {
    setLoading(true);

    setCurrentPage(pageNumber);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handlePrevPage = () => {
    setLoading(true);

    currentPage > 1 && setCurrentPage((prev) => prev - 1);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const handleNextPage = () => {
    setLoading(true);

    currentPage < totalPages && setCurrentPage((prev) => prev + 1);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }



  // const UseFormattedDate = (dateString) => {
  //     if (!dateString) return "";
  //     const date = new Date(dateString);
  //     return date.toLocaleDateString("en-US", {
  //         day: "2-digit",
  //         month: "short",
  //         year: "numeric",
  //     });
  // };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <HeaderBlog />

      <div className="dsgbtgfewfrrr555 container-fluid mb-4"></div>

      <section className="dsgbtgfewfrrr container mb-4">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={5}
          slidesPerView={1}
          // navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          className="featured-swiper"
        >
          {blogBanner.map((blogBannerItem) => (
            <SwiperSlide key={blogBannerItem?.id}>
              <div className="lklklkdssdd-slider">
                <img
                  src={optimizeImage(`${blogBannerimageBaseUrl}/${blogBannerItem?.image}`)}
                  alt={blogBannerItem?.image}
                  className="img-fluid w-100"
                />

                {/* <div className="dasdesrweedewr d-none position-absolute w-100 p-3 pb-5 d-none d-md-block">
                                    <h3 className="lmlmlmlkjlmee mb-2 text-light">{popularblog?.title}</h3>

                                    <div className="idenjwirwer">
                                        <p dangerouslySetInnerHTML={{
                                            __html: popularblog.blog_description ? popularblog.blog_description.replace(/<[^>]+>/g, "").slice(0, 120) + "..." : ""
                                        }} className="text-light"></p>
                                        
                                        <Link to={`/blog/${popularblog.slug}`} className="text-light">CONTINUE READING</Link>
                                    </div>
                                </div> */}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <div className="container my-5">
        <div className="row">
          <main className="col-lg-8">
            {currentBlogs.map((blog) => (
              <BlogItem blog={blog} imageBaseUrl={imageBaseUrl} key={blog.id} />
            ))}

            {blogs.length > blogsPerPage && (
              <div className="fvgsdsedwewew d-flex justify-content-center align-items-center my-4 flex-wrap">
                <button
                  className={`${currentPage === 1 ? "" : "btn-main"} btn mx-1`}
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Prev
                </button>

                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    className={`btn mx-1 ${currentPage === number ? "active" : "btn-main asfedeer"}`}
                    onClick={() => handlePageChange(number)}
                  >
                    {number}
                  </button>
                ))}

                <button
                  className={`${currentPage === totalPages ? "" : "btn-main"} btn mx-1`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </main>

          <aside className="col-lg-4 sidebar ps-lg-5">
            <div className="sidebar-right">
              <div className="mb-5">
                <h5 className="olkdflmroij py-3 px-4 mb-0 text-light section-title">
                  Popular Posts
                </h5>

                <ul className="asdcdfgwedfseee list-unstyled">
                  {popularblogs.slice(0, 3).map((popularBlog) => {
                    // const blogDate = UseFormattedDate(blog.blog_date);

                    return (
                      <li className="row py-3">
                        <div className="col-3">
                          <div className="doejwojrwer overflow-hidden rounded-pill">
                            <img
                              src={optimizeImage(`${imageBaseUrl}/${popularBlog?.blog_image}`)}
                              className="img-fluid"
                              alt={popularBlog?.title}
                            />
                          </div>
                        </div>

                        <div className="col-9 ps-0">
                          <div className="saldmasdsd">
                            <p className="mb-1 lmlmlmlkjlmee">
                              {popularBlog?.title}
                            </p>

                            {/* <h6>{blogDate}</h6> */}

                            <Link to={`/blog/${popularBlog.slug}`}>
                              VIEW POST
                            </Link>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="mb-5">
                <h5 className="olkdflmroij py-3 px-4 mb-0 text-light section-title">
                  Categories
                </h5>

                <ul className="efwcegqwedae d-flex flex-wrap list-unstyled py-3">
                  {blogCategories.map((blogCategory) => (
                    <li className="px-4 mb-2">
                      {/* <Link to={`/blog/category/${blogCategory?.category?.toLowerCase().replace(/\s+/g, "-")}`}>{blogCategory?.category.toLowerCase()} ({blogCategory.count})</Link> */}
                      <Link to={""}>
                        {blogCategory?.category.toLowerCase()} (
                        {blogCategory.count})
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-5">
                <h5 className="olkdflmroij py-3 px-4 mb-0 text-light section-title">
                  Tags
                </h5>

                <ul className="efwcegqwedae d-flex flex-wrap list-unstyled py-3">
                  {blogTags.map((blogTag) => (
                    <li className="px-3 mb-2">
                      <Link
                        to={`/blog/tag/${blogTag.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {blogTag}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-5">
                <h5 className="olkdflmroij py-3 px-4 text-light section-title">
                  Follow Us On
                </h5>

                {/* <ul className="opsdjfopsdjkfopsdkof d-flex align-items-center justify-content-around follow-card list-inline py-3 mx-4">
                                    <li className="list-inline-item">
                                        <a href="/">
                                            <i class="fa-brands p-2 text-light fa-facebook-f"></i>
                                        </a>
                                    </li>

                                    <li className="list-inline-item">
                                        <a href="/">
                                            <i class="fa-brands p-2 text-light fa-x"></i>
                                        </a>
                                    </li>

                                    <li className="list-inline-item">
                                        <a href="/">
                                            <i class="fa-brands p-2 text-light fa-instagram"></i>
                                        </a>
                                    </li>

                                    <li className="list-inline-item">
                                        <a href="/">
                                            <i class="fa-brands p-2 text-light fa-linkedin-in"></i>
                                        </a>
                                    </li>

                                    <li className="list-inline-item">
                                        <a href="/">
                                            <i class="fa-brands p-2 text-light fa-youtube"></i>
                                        </a>
                                    </li>
                                </ul> */}

                {/* <div className="social-icons-container">
                                    <ul className="mb-0 ps-0">
                                        <li>
                                            <a href="/">
                                                <i className="fa-brands fa-facebook-f" />
                                            </a>
                                        </li>

                                        <li>
                                            <a href="/">
                                                <i className="fa-brands fa-x" />
                                            </a>
                                        </li>

                                        <li>
                                            <a href="/">
                                                <i className="fa-brands fa-instagram" />
                                            </a>
                                        </li>

                                        <li>
                                            <a href="/">
                                                <i className="fa-brands fa-linkedin-in" />
                                            </a>
                                        </li>

                                        <li>
                                            <a href="/">
                                                <i className="fa-brands fa-youtube" />
                                            </a>
                                        </li>
                                    </ul>
                                </div> */}

                {/* <div className="footer-social-icons">
                  <ul className="social-icons ps-0">
                    <li>
                      <a href="/" className="social-icon">
                        {" "}
                        <i className="fa-brands fa-facebook-f"></i>
                      </a>
                    </li>
                    <li>
                      <a href="/" className="social-icon">
                        {" "}
                        <i className="fa-brands fa-x"></i>
                      </a>
                    </li>
                    <li>
                      <a href="/" className="social-icon">
                        {" "}
                        <i className="fa-brands fa-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="/" className="social-icon">
                        {" "}
                        <i className="fa-brands fa-linkedin-in"></i>
                      </a>
                    </li>
                    <li>
                      <a href="/" className="social-icon">
                        {" "}
                        <i className="fa-brands fa-youtube"></i>
                      </a>
                    </li>
                  </ul>
                </div> */}

                <div className="socl-meda-icons">
                  <a href="/">
                    <i className="fa-brands fa-facebook-f" />
                  </a>

                  <a href="/">
                    <i className="fa-brands fa-x" />
                  </a>

                  <a href="/">
                    <i className="fa-brands fa-instagram" />
                  </a>

                  <a href="/">
                    <i className="fa-brands fa-linkedin-in" />
                  </a>

                  <a href="/">
                    <i className="fa-brands fa-youtube" />
                  </a>
                </div>
              </div>

              <section className="sgfthrherwygtiydfsdde video-sidebar-section">
                <div className="video-wrapper">
                  {/* {blogvedio?.vedio_url && (
                                        <iframe
                                            width="100%"
                                            height="400"
                                            src={blogvedio.vedio_url.replace('shorts/', 'embed/')}
                                            title="YouTube Shorts Video"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    )} */}
                  {blogvedio?.vedio_url ? (
                    <img
                      width="100%"
                      className="dckisehiwehrr"
                      style={{ height: "100%" }}
                      src={optimizeImage(blogvedio.vedio_url)}
                      alt=""
                    />
                  ) : (
                    <img
                      width="100%"
                      className="dckisehiwehrr"
                      style={{ height: "100%" }}
                      src="./images/fashion40.png"
                      alt=""
                    />
                  )}
                </div>

                <div className="video-wrapper d-none">
                  {/* {blogvedio?.vedio_url && (
                                        <iframe
                                            width="100%"
                                            height="400"
                                            src={blogvedio.vedio_url.replace('shorts/', 'embed/')}
                                            title="YouTube Shorts Video"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    )} */}
                  {blogvedio?.blog_image_two ? (
                    <img
                      width="100%"
                      className="dckisehiwehrr"
                      style={{ height: "100%" }}
                      src={optimizeImage(blogvedio.blog_image_two)}
                      alt=""
                    />
                  ) : (
                    <img
                      width="100%"
                      className="dckisehiwehrr"
                      style={{ height: "100%" }}
                      src="./images/fashion40.png"
                      alt=""
                    />
                  )}
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>

      <FooterBlog
        blogCategories={blogCategories}
        allblogCategories={allblogCategories}
      />
    </>
  );
};
