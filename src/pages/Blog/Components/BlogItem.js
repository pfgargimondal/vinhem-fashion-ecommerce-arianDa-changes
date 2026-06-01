import { Link } from "react-router-dom";
import { UseFormattedDate } from "../../../hooks/UseFormattedDate";
import { optimizeImage } from "../../../utils/optimizeImage";

export const BlogItem = ({blog, imageBaseUrl}) => {
    const blogDate = UseFormattedDate(blog.blog_date);

  return (
    <article className="fgfrfdrdtreere mb-5 pb-3">
        <div className="lolmdslkjflsdm position-relative d-flex align-items-center">
            <div className="article-number p-2">
                <h4 className="text-light text-center mb-0">{blogDate}</h4>
            </div>

            <div className="oiajdoimewr w-100 bg-white px-5 py-3">
                <h2 className="article-title">{blog?.title}</h2>
                
                <ul className="dmlmljkf mb-0 ps-0 d-flex align-items-center">
                    <li>
                        <div className="article-subtitle">
                            by {blog?.author_name}
                        </div>
                    </li>

                    <li>
                        <i class="fa-solid list-dot fa-circle"></i>
                    </li>

                    <li>
                        <div className="article-subtitle">
                            Lifestyle
                        </div>
                    </li>

                    <li>
                        <i class="fa-solid list-dot fa-circle"></i>
                    </li>

                    <li>
                        <div className="article-subtitle">
                            Share
                        </div>
                    </li>
                </ul>
            </div>
        </div>

        <div className="dosjifrjwer">
            <Link to={`/blog/${blog?.slug}`}>
                <img
                    src={optimizeImage(`${imageBaseUrl}/${blog?.blog_image}`)}
                    className="img-fluid mb-3 w-100"
                    alt="Street Fashion"
                />
            </Link>            

            <div className="diewhirwer">
                <p dangerouslySetInnerHTML={{
                    __html: blog.blog_description ? blog.blog_description.replace(/<[^>]+>/g, "").slice(0, 500) + "..." : ""
                }}></p>

                <Link to={`/blog/${blog?.slug}`}>
                    <button className="btn btn-main mt-3">CONTINUE READING</button>
                </Link>                
            </div>
        </div>

        <Link to={`/blog/${blog?.slug}`}>
            <div className="doiewlewor mt-4 text-center">
                0 COMMENTS
            </div>
        </Link>
    </article>
  )
}