import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { IoIosArrowDown } from "react-icons/io";
import { AuthContext } from "../../../Provider/AuthProvider";
import { message } from "antd";
const Home = () => {
    const [flatData, setFlatData] = useState([]);
    const [activeButton, setActiveButton] = useState("flat");
    const [searchValue, setSearchValue] = useState("");
    const [priceSort, setPriceSort] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [flatsPerPage] = useState(30);
    const { auths } = useContext(AuthContext);
    const user = auths?.user;
    const [dropdownOpenPage, setDropDownPage] = useState(false);
    const [dropdownOpen, setDropDown] = useState(false);
    const pageRef = useRef();
    const imgRef = useRef();
    const dropdownRefPage = useRef();
    const dropdownRef = useRef();
  
  window.addEventListener("click", (e) => {
    if (e.target !== dropdownRef.current && e.target !== imgRef.current) {
      setDropDown(false);
    }
    if (e.target !== dropdownRefPage.current && e.target !== pageRef.current) {
      setDropDownPage(false);
    }
  });
  
  const handleDropDownPage = () => {
    setDropDownPage(!dropdownOpenPage);
  };
  
  const handleClick = (button) => {
    setActiveButton(button);
  };
  
  useEffect(() => {

  
    fetchData();
  }, [searchValue, priceSort]);
  
//   console.log("flatdataUUUU", flatData);
const fetchData = async () => {
    const res = await axios.get(`http://localhost:5000/flatList?location=${searchValue}&sort=${priceSort}`);
    setFlatData(res.data);
  };
  
    //search
    const handleSearchChange = (e) => {
      setSearchValue(e.target.value);
    };
  
    const handlePriceSort = (sortOrder) => {
      setPriceSort(sortOrder);
    };
  
    // add To flat Wishlist-----------------------
    const addToWishlist = async (flat) => {
      console.log(flat);
      try {
        const flatData = {
          userEmail: user?.email,
          userId: user?._id,
          flatWishList: flat,
          roommateWishList: "",
        };
        message.success("Successfully Added WishList!");
        console.log("hello", flatData);
  
        await axios.post(`http://localhost:5000/wishList`, flatData);
        console.log("Added to wishlist:", flat);
      } catch (error) {
        console.error("Error adding to wishlist:", error);
      }
    };
  
    const dropDownIcon = (e) => {
      e.stopPropagation();
      setDropDownPage(!dropdownOpenPage);
  };

    // Logic for pagination
    const indexOfLastFlat = currentPage * flatsPerPage;
    const indexOfFirstFlat = indexOfLastFlat - flatsPerPage;
    const currentFlats = flatData.slice(indexOfFirstFlat, indexOfLastFlat);
    
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    return (
        <>
        <div className="lg:px-14 flex justify-center lg:gap-10  px-2">
          {/* this is a two button */}
  
          <div className="flex justify-evenly flex-wrap lg:gap-10 gap-5 py-5 lg:px-6">
            <div className="flex border border-black rounded-lg">
              <Link to="/findFlat">
                <button
                  className={`md:px-6 px-2 py-3 rounded-lg mr-2 text-[10px] md:text-sm lg:text-base ${
                    activeButton === "flat"
                      ? "bg-green-400 text-black font-semibold border border-black"
                      : "bg-white text-black font-semibold"
                  }`}
                  onClick={() => handleClick("flat")}
                >
                  Find Flat
                </button>
              </Link>
              <Link to="/findSublet">
                <button
                  className={`md:px-6 px-2 py-3 rounded-lg mr-2 text-[10px] md:text-sm lg:text-base  ${
                    activeButton === "sublet"
                      ? "bg-green-400 text-black font-semibold border border-black"
                      : "bg-white text-black font-semibold"
                  }`}
                  onClick={() => handleClick("sublet")}
                >
                  Find Sublet
                </button>
              </Link>
  
              <Link to="/findRoommate">
                <button
                  className={`md:px-6 px-2 py-3 rounded-lg text-[10px] md:text-sm lg:text-base ${
                    activeButton === "roommate"
                      ? "bg-green-400 text-black font-semibold border border-black"
                      : "bg-white text-black font-semibold"
                  }`}
                  onClick={() => handleClick("roommate")}
                >
                  Find Roommate
                </button>
              </Link>
            </div>
            {/* search functionality */}
  
            <div className="">
              <input
                value={searchValue}
                onChange={handleSearchChange}
                className="border border-black rounded-lg w-56 lg:px-6 px-1 py-2 md:py-3"
                placeholder="   Search Location"
              />
            </div>
  
            <div className="relative">
              <button
                ref={pageRef}
                onClick={handleDropDownPage}
                className="border px-5 rounded-lg py-2 md:py-3 lg:py-3 border-black"
              >
                Sort
                <IoIosArrowDown
               
                  className={`inline ml-[137px] lg:ml-28 xl:ml-28 ${
                    dropdownOpenPage ? "rotate-180" : "rotate-0"
                  } ml-1`}
                  size={16}
                  onClick={dropDownIcon}
                />
              </button>
              <ul
                ref={dropdownRefPage}
                className={`absolute py-2 px-1 z-[1000] overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg  w-40 ${
                  dropdownOpenPage ? "block top-[50px]" : "hidden"
                }`}
              >
                <li>
                  <button
                    onClick={() => handlePriceSort("High To Low")}
                    className="rounded whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent flex items-center gap-2"
                  >
                    Price (high to low)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePriceSort("Low To High")}
                    className="rounded whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent flex items-center gap-2"
                  >
                    Price (low to high)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePriceSort("Low To High")}
                    className="rounded whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent flex items-center gap-2"
                  >
                    Relevance
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handlePriceSort("Low To High")}
                    className="rounded whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent flex items-center gap-2"
                  >
                    newest arrivals
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
  
        {/* find Flat cards */}
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:px-14 px-6">
          {currentFlats.map((flat, index) => (
            <Link key={index} to={`/flatDetails/${flat._id}`} className="">
              <div className="max-w-[350px] font-sans rounded-2xl space-y-6 my-5 mx-auto bg-white">
                <div className="flex justify-center w-full relative">
                  <div className="flex justify-end items-center left-4 right-4 top-4 absolute">
                    <button
                      className="flex items-center"
                      onClick={() => addToWishlist(flat)}
                    >
                      <svg
                        width={30}
                        className="hover:fill-red-500 hover:stroke-red-500 stroke-2 fill-transparent stroke-white"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ cursor: "pointer" }}
                      >
                        <g strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"></path>
                        </g>
                      </svg>
                    </button>
                  </div>
                  <img
                    className="rounded-xl bg-black/40 w-full object-cover h-[230px] md:h-[290px] lg:h-[309px] border border-gray-150"
                    src={`http://localhost:5000/images/${flat.flatList.images[0]}`}
                    alt="Flat Image"
                  />
                </div>
                <div className="flex-1 text-sm mt-8 gap-3 space-y-2">
                  <div>
                    <h3 className="text-gray-900">
                      Location {flat.flatList.description.location.address},{" "}
                      {flat.flatList.description.location.city},{" "}
                      {flat.flatList.description.location.postalCode}
                    </h3>
                    <p className="mt-1.5 text-pretty text-xs text-gray-500">
                      HomeType:<span className="uppercase"> {flat.flatList.description.type},</span>
                    </p>
                    <p className="mt-1.5 text-pretty text-xs text-gray-500">
                      Bedroom: {flat.flatList.description.bedroom} bedroom Flat
                    </p>
                  </div>
                  <p className="text-gray-900 font-bold text-lg">
                    $ {flat.flatList.description.rent}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
  
        {/* for pagination */}
  
        <div className=" flex flex-wrap justify-center mb-10 mt-24 gap-2 md:gap-5">
          <button
            className="join-item px-2 py-1 md:text-base text-sm rounded-md btn btn-outline mr-1 md:mr-2"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &larr; Previous
          </button>
          {Array.from(
            { length: Math.ceil(flatData.length / flatsPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`join-item px-3 md:px-4 md:text-base btn rounded-md btn-outline mr-1 md:mr-2 ${
                  currentPage === i + 1 ? "bg-green-400 text-white" : ""
                }`}
              >
                {i + 1}
              </button>
            )
          )}
          <button
            className="join-item px-2 py-1 md:text-base rounded-md text-sm btn btn-outline mr-1 md:mr-2"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === Math.ceil(flatData.length / flatsPerPage)}
          >
            Next &rarr;
          </button>
        </div>
      </>
    );
};

export default Home;