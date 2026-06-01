import { Link } from "react-router-dom";
import Logo from "../../../assets/images/logo.png";

import "./FooterBlog.css";
import Loader from "../../Loader/Loader";
import http from "../../../http";
import { useEffect, useState } from "react";
import { optimizeImage } from "../../../utils/optimizeImage";

export const FooterBlog = ({ blogCategories, allblogCategories }) => {
    const [loading, setLoading] = useState(false);
     // eslint-disable-next-line
    const [blogsHeader, setBlogsHeader] = useState([]);
    const [blogsFooterImage, setBlogsFooterImage] = useState([]);
    const [popularblogs, setPopularBlogs] = useState([]);
    const [recentblogs, setRecentBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogHeader = async () => {
            setLoading(true);
            try {
                const getresponse = await http.get("/fetch-blog-header");
                const dataheaderCategories = getresponse.data.data;
                const dataFooterImage = getresponse.data.blog_footer_image;

                setBlogsHeader(dataheaderCategories);
                setBlogsFooterImage(dataFooterImage);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogHeader();
    }, []);

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const getresponse = await http.get("/blogs");
                const dataBlogs = getresponse.data;

                setPopularBlogs(dataBlogs.popularblog);
                setRecentBlogs(dataBlogs.recentblog);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div id="footer-blog">
            <div className="dweoriwenirjweoijrwer">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-3">
                            <div className="doiwqjejir_inner py-4 h-100">
                                <div className="text-center">
                                    <img src={Logo} className="mb-4" alt="" />
                                </div>
                                {/* <p className="mb-0">
                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                                    Veniam non atque eligendi explicabo ipsum iusto officiis
                                    eveniet alias facilis nemo.
                                </p> */}

                                <h6 className="mb-2 mt-3">
                                    CERTIFIED & VERIFIED BY :
                                </h6>

                                <div className="certification-grid mt-3">
                                    {blogsFooterImage.map((blogsFooterImageItem) => (
                                        <img
                                            src={optimizeImage(blogsFooterImageItem.image)}
                                            alt="CERTIFIED COMPANY"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-3">
                            <div className="doiwqjejir_inner py-4 h-100">
                                <h5 className="mb-3">{"Recent Posts".toUpperCase()}</h5>
                                {recentblogs.map((recentblogsItem) => (
                                    <Link
                                        key={recentblogsItem.slug}
                                        to={recentblogsItem.slug}
                                        target="_blank"
                                        className="d-flex"
                                    >
                                        <i class="fa-solid dbdfsegdgsf me-1 mt-2 fa-circle"></i> {recentblogsItem.title}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="col-lg-3">
                            <div className="doiwqjejir_inner py-4 h-100">
                                <h5 className="mb-3">{"Popular Posts".toUpperCase()}</h5>
                                {popularblogs.map((popularblogsItem) => (
                                    <Link
                                        key={popularblogsItem.slug}
                                        to={popularblogsItem.slug}
                                        target="_blank"
                                        className="d-flex"
                                    >
                                        <i class="fa-solid dbdfsegdgsf me-1 mt-2 fa-circle"></i> {popularblogsItem.title}
                                    </Link>
                                ))}

                                {/* <Link to="">Lorem ipsum dolor sit amet</Link> */}
                            </div>
                        </div>

                        <div className="col-lg-3">
                            <div className="doiwqjejir_inner border-end-0 py-4 h-100">
                                <h5 className="mb-3">{"Categories".toUpperCase()}</h5>
                                {allblogCategories.map((item) => (
                                    <Link
                                        key={item?.blog_category}
                                        to={`${item?.category_url}`}
                                        target="_blank"
                                        className="d-flex"
                                    >
                                        <i class="fa-solid dbdfsegdgsf me-1 mt-2 fa-circle"></i> {item?.blog_category}
                                    </Link>
                                ))}
                                {/* <Link to="">Lorem ipsum dolor sit amet</Link> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="sadfdfgeadetr py-2 text-center text-white">
                <p className="mb-0">Vinhem Fashion Blog <i class="bi bi-c-circle"></i> 2012 - 2026, All Rights Reserved.</p>
            </div>
        </div>
    );
};
