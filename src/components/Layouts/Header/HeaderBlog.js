import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../../../assets/images/logo.png";

import "./Css/HeaderBlog.css";
import Loader from "../../Loader/Loader";
import http from "../../../http";

export const HeaderBlog = () => {
    const [hbModal, setHbModal] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [blogsHeader, setBlogsHeader] = useState([]);

    // const handleSearch = (e) => {
    //     e.preventDefault();
    //     const searchValue = searchRef.current?.value?.trim();

    //     searchValue && navigate(`/all-products?search=${encodeURIComponent(searchValue)}`);
        
    //     searchRef.current.value = "";
    // }

    const handleSearch = (e) => {
        e.preventDefault();
        const searchValue = searchRef.current?.value?.trim();

        if (searchValue) {
            navigate(`/blog?search=${encodeURIComponent(searchValue)}`);
        } else {
            navigate(`/blog`);
        }
        searchRef.current.value = "";
    };


    const handleHbModalToggle = () => {
        const html = document.querySelector("html");

        html.classList.add("overflow-hidden");

        setHbModal(!hbModal);
    };


    const handleHbModalClose = () => {
        const html = document.querySelector("html");

        html.classList.remove("overflow-hidden");

        setHbModal(false);
    };

    useEffect(() => {
        const fetchBlogHeader = async () => {
            setLoading(true);
            try {
                const getresponse = await http.get("/fetch-blog-header");
                const dataheaderCategories = getresponse.data.data;

                setBlogsHeader(dataheaderCategories);

            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogHeader();
    }, []);

    

    
    if (loading) {
        return <Loader />;
    }


  return (
    <>
        <div id="header-blog" className="pt-3 pb-4">
            <div className="container-flud">
                <div className="doiwejuirjweoirwept position-relative">
                    <label className="dewnrwejorewr" htmlFor="daer">
                        <i class="fa-solid dbghsdfadarttt d-block d-lg-none d-md-none fa-bars"></i>

                        <input type="checkbox" id="daer" className="d-none position-absolute" />

                        <div className="dwejnrkhweijrwer fghdrgtdrrtgewewr d-none mt-4">
                            <ul className="mb-0 ps-0">
                                <li className="mx-3">
                                    <Link to="/blog">HOME</Link>
                                </li>
                                {blogsHeader.map(blogHeaderItem => (
                                    <li className="mx-3">
                                        <Link to={`/blog/category/${blogHeaderItem?.head_category_slug}`}>{blogHeaderItem.head_category}</Link>
                                    </li>
                                ))}
                                <li className="mx-3">
                                    <Link to="https://www.vinhemfashion.com/">SHOP NOW</Link>
                                </li>
                            </ul>
                        </div>
                    </label>

                    <div className="deowjrkjweirew text-center">
                        <Link to="/blog"><img src={Logo} alt="" /></Link>
                    </div>

                    <div className="dasfsreer position-absolute">
                        <i className="fa-solid fa-magnifying-glass" onClick={handleHbModalToggle}></i>
                    </div>
                </div>

                <div className="dwejnrkhweijrwer mt-4">
                    <ul className="mb-0 ps-0">
                        <li className="mx-3">
                            <Link to="/blog">HOME</Link>
                        </li>
                        {blogsHeader.map(blogHeaderItem => (
                            <li className="mx-3">
                                <Link to={`/blog/category/${blogHeaderItem?.head_category_slug}`}>{blogHeaderItem.head_category}</Link>
                            </li>
                        ))}
                        <li className="mx-3">
                            <Link to="https://www.vinhemfashion.com/">SHOP NOW</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div onClick={handleHbModalClose} className={`${hbModal ? "hb-modal-backdrop" : "hb-modal-backdrop hb-modal-backdrop-hide"} position-fixed w-100 h-100`}></div>

        <div className={`${hbModal ? "hb-modal" : "hb-modal hb-modal-hide"} position-fixed`}>
            <form onSubmit={handleSearch}>
                <div className="diewhirjwer position-realtive">
                    <input ref={searchRef} type="text" className="form-control" placeholder="Search Here" />

                    <button className="btn position-absolute px-3 btn-main"><i class="bi bi-search"></i></button>
                </div>
            </form>            
        </div>
    </>
  )
}