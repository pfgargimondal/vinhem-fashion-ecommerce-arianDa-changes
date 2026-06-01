import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { UseFormattedDate } from "../../hooks/UseFormattedDate";
import http from "../../http";
import "./Css/Blog.css";
import "./Css/BlogResponsive.css";
import { toast } from "react-toastify";
import { FooterBlog, HeaderBlog } from "../../components";
import Loader from "../../components/Loader/Loader";
import { optimizeImage } from "../../utils/optimizeImage";

export const BlogDetails = () => {
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [popularblogs, setPopularBlogs] = useState([]);
  const [imageBaseUrl, setImageBaseUrl] = useState("");
  const [blogvedio, setBlogVedio] = useState("");
  const [blogCategories, setBlogCategories] = useState([]);
  const [allblogCategories, setAllBlogCategories] = useState([]);
  const [blogTags, setBlogTags] = useState([]);
  const [comments, setComments] = useState([]);

  const blogDate = UseFormattedDate(blogs.blog_date);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      setLoading(true);
      try {
        const res = await http.get(`/blogs/${slug}`);
        const data = res.data;
        setBlogs(data.data);
        setPopularBlogs(data.popularblog);
        setImageBaseUrl(data.image_url);
        setBlogVedio(data.blog_vedio);
      } catch (error) {
        console.error("Error fetching blog details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetails();
  }, [slug]);

  useEffect(() => {
    const fetchTagsAndCategories = async () => {
      setLoading(true);
      try {
        const res = await http.get("/fetch-blog-tags");
        const data = res.data;
        setBlogCategories(data.blog_category);
        setBlogTags(data.data);
        setAllBlogCategories(data.allBlog_categories);
      } catch (error) {
        console.error("Error fetching tags/categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTagsAndCategories();
  }, []);

  useEffect(() => {
    if (!blogs?.id) return;

    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await http.get(`/show-comment/${blogs.id}`);
        const data = res.data.data;

        setComments(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [blogs?.id]);

  const [formData, setFormData] = useState({
    comment: "",
    full_name: "",
    email: "",
    website_link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();
    const formattedDateTime = now.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const newComment = {
      blog_id: blogs.id,
      full_name: formData.full_name,
      email: formData.email,
      website_link: formData.website_link,
      comment: formData.comment,
      date_time: formattedDateTime,
    };
    setLoading(true);
    try {
      const response = await http.post("/store-comment", newComment);
      if (response.status === 200 || response.data?.success) {
        toast.success("Comment submitted successfully!");

        setComments((prev) => [...prev, newComment]);

        setFormData({
          comment: "",
          full_name: "",
          email: "",
          website_link: "",
        });

        const res = await http.get(`/show-comment/${blogs.id}`);
        const data = res.data.data;
        setComments(Array.isArray(data) ? data : [data]);
      } else {
        toast.error("Failed to submit comment!");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookShare = () => {
    const encodedURL = encodeURIComponent(slug);
    const facebookURL = `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`;
    window.open(facebookURL, "_blank", "noopener,noreferrer");
  };

  const handleTwitterShare = () => {
    const url = encodeURIComponent(slug);
    const text = encodeURIComponent("Check out this blog!");

    window.open(
      `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      "_blank"
    );
  };

  const handleInstagramShare = async () => {
    const shareData = {
      title: document.title,
      text: "Check out this blog!",
      url: slug,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(slug);
        alert("Blog link copied! Paste it on Instagram.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLinkedinShare = () => {
    const url = encodeURIComponent(slug);

    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <HeaderBlog />
      <div className="container my-5">
        <div className="row">
          <main className="col-lg-8">
            <article className="mb-5">
              <div className="doaejojewr pb-4">
                <div className="lolmdslkjflsdm position-relative d-flex align-items-center">
                  <div className="article-number p-2">
                    <h4 className="text-light text-center mb-0">{blogDate}</h4>
                  </div>

                  <div className="oiajdoimewr w-100 bg-white px-5 py-3">
                    <h2 className="article-title">{blogs?.title}</h2>
                    <ul className="dmlmljkf mb-0 ps-0 d-flex align-items-center">
                      <li>
                        <div className="article-subtitle">
                          by {blogs?.author_name}
                        </div>
                      </li>
                      <li>
                        <i className="fa-solid list-dot fa-circle"></i>
                      </li>
                      <li>
                        <div className="article-subtitle">Lifestyle</div>
                      </li>
                    </ul>
                  </div>
                </div>

                <img
                  src={optimizeImage(`${imageBaseUrl}/${blogs?.blog_image}`)}
                  className="img-fluid mb-3 w-100"
                  alt={blogs?.title}
                />

                <p
                  dangerouslySetInnerHTML={{ __html: blogs.blog_description }}
                ></p>
              </div>

              {comments.length > 0 ? (
                <div className="odmkeokwjrwer mt-5">
                  <h4>COMMENTS</h4>
                  {comments.map((comment, index) => (
                    <div key={index} className="doiewirwer d-flex py-3">
                      <img
                        className="img-fluid me-3 rounded-circle"
                        src="/images/asw.jpg"
                        alt="avatar"
                        width="60"
                        height="60"
                      />
                      <div className="doejiwrwer">
                        <p className="mb-2 fw-bold">{comment.full_name}</p>
                        <p>{comment.comment}</p>
                        <p className="text-muted small">
                          {comment.date_time ||
                            new Date(comment.created_at).toLocaleString(
                              "en-GB",
                            )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="odmkeokwjrwer text-center mt-5">
                  <p>NO COMMENTS</p>
                </div>
              )}

              <div className="odmkeokwjrwer mt-4">
                <h4>LEAVE A REPLY</h4>
                <div className="dgtewqewwqee pt-3">
                  <form className="row" onSubmit={handleSubmit}>
                    <div className="col-lg-12 mb-4">
                      <textarea
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        className="form-control"
                        style={{ height: "10rem" }}
                        placeholder="Write your comment..."
                        required
                      ></textarea>
                    </div>

                    <div className="col-lg-4 mb-4">
                      <input
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="col-lg-4 mb-4">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="E-mail address"
                        required
                      />
                    </div>

                    <div className="col-lg-4 mb-4">
                      <input
                        type="text"
                        name="website_link"
                        value={formData.website_link}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Website"
                      />
                    </div>

                    <div className="d-flex justify-content-end erhbgsdertbhgsdfg">
                      <button className="btn px-5 btn-main btn-transparent" type="submit">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </article>
          </main>

          <aside className="col-lg-4 sidebar ps-lg-5">
            <div className="sidebar-right">
              <div className="mb-5">
                <h5 className="olkdflmroij py-3 px-4 mb-0 text-light section-title">
                  Popular Posts
                </h5>
                <ul className="asdcdfgwedfseee list-unstyled">
                  {popularblogs.slice(0, 3).map((blog) => (
                    <li className="row py-3" key={blog.id}>
                      <div className="col-3">
                        <div className="doejwojrwer overflow-hidden rounded-pill">
                          <img
                            src={optimizeImage(`${imageBaseUrl}/${blog?.blog_image}`)}
                            className="img-fluid"
                            alt={blog?.title}
                          />
                        </div>
                      </div>
                      <div className="col-9 ps-0">
                        <div className="saldmasdsd">
                          <p className="mb-1 lmlmlmlkjlmee">{blog?.title}</p>
                          <Link to={`/blog/${blog.slug}`}>VIEW POST</Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-5">
                <h5 className="olkdflmroij py-3 px-4 mb-0 text-light section-title">
                  Categories
                </h5>
                <ul className="efwcegqwedae d-flex flex-wrap list-unstyled py-3">
                  {blogCategories.map((cat) => (
                    <li className="px-4 mb-2" key={cat.id}>
                      <Link to={`/blog/category/${cat.category.toLowerCase()}`}>
                        {cat.category.toLowerCase()} ({cat.count})
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
                  {blogTags.map((tag, idx) => (
                    <li className="px-3 mb-2" key={idx}>
                      <Link
                        to={`/blog/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        {tag}
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
                          <button onclick={handleFacebookShare} className="social-icon">
                            <i className="fa-brands fa-facebook-f"></i>
                          </button>
                        </li>
                        <li>
                          <button onClick={handleTwitterShare} className="social-icon">
                            <i className="fa-brands fa-x"></i>
                          </button>
                        </li>
                        <li>
                          <button onclick={handleInstagramShare} className="social-icon">
                            <i className="fa-brands fa-instagram"></i>
                          </button>
                        </li>
                        <li>
                          <button onClick={handleLinkedinShare} className="social-icon">
                            <i className="fa-brands fa-linkedin-in"></i>
                          </button>
                        </li>
                        <li>
                          <a href="/" className="social-icon">
                            <i className="fa-brands fa-youtube"></i>
                          </a>
                        </li>
                      </ul>
                    </div> */}

                    <div className="socl-meda-icons">
                      <a href="/" onclick={handleFacebookShare}>
                        <i className="fa-brands fa-facebook-f" />
                      </a>

                      <a href="/" onClick={handleTwitterShare}>
                        <i className="fa-brands fa-x" />
                      </a>

                      <a href="/" onclick={handleInstagramShare}>
                        <i className="fa-brands fa-instagram" />
                      </a>

                      <a href="/" onClick={handleLinkedinShare}>
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
                    <img width="100%" className="dckisehiwehrr" style={{ height: "100%" }} src={optimizeImage(blogvedio.vedio_url)} alt="" />
                  ) : (
                    <img width="100%" className="dckisehiwehrr" style={{ height: "100%" }} src="./images/fashion40.png" alt="" />
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
                    <img width="100%" className="dckisehiwehrr" style={{ height: "100%" }} src={optimizeImage(blogvedio.blog_image_two)} alt="" />
                  ) : (
                    <img width="100%" className="dckisehiwehrr" style={{ height: "100%" }} src="./images/fashion40.png" alt="" />
                  )}
                </div>
              </section>
            </div>
          </aside>
        </div>

      </div>
      <FooterBlog blogCategories={blogCategories} allblogCategories={allblogCategories} />
    </>
  );
};
