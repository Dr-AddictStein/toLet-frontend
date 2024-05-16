import { message } from "antd";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../Provider/AuthProvider";
const FindRoommate = () => {
  const [activeButton, setActiveButton] = useState("roommate");
  const [roomMate, setRoomMate] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [gender, setGender] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [roommatesPerPage] = useState(30);
  const { auths } = useContext(AuthContext);
  const user = auths?.user;
  const [dropdownOpenPage, setDropDownPage] = useState(false);
  const [dropDown, setDropDown] = useState(false);
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
  const handleDropDown = () => {
    setDropDown(!dropDown);
  };
  const handleClick = (button) => {
    console.log("Clicked button:", button);
    setActiveButton(button);
  };

  useEffect(() => {
    const fetchData = async () => {
      let url = "";
      if (activeButton === "flat") {
        url = `http://localhost:5000/flatList?location=${searchValue}&sort=${priceSort}&type=flat`;
      } else if (activeButton === "sublet") {
        url = `http://localhost:5000/flatList?location=${searchValue}&sort=${priceSort}&type=sublet`;
      } else if (activeButton === "roommate") {
        url = `http://localhost:5000/roommateList?location=${searchValue}&sort=${priceSort}&gender=${gender}`;
      }
      const res = await axios.get(url);
      setRoomMate(res.data);
    };

    fetchData();
  }, [activeButton, searchValue, priceSort, gender]);

  console.log("roomMate", roomMate);

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const handlePriceSort = (sortValue) => {
    setPriceSort(sortValue);
    fetchData();
  };

  const handleGenderFilter = (value) => {
    setGender(value);
  };

  console.log(gender,"click");
  const dropDownIcon = (e) => {
    e.stopPropagation();
    setDropDownPage(!dropdownOpenPage);
};

const genderDropDownIcon = (e) => {
  e.stopPropagation();
  setDropDown(!dropDown);
};
  const indexOfLastRoommate = currentPage * roommatesPerPage;
  const indexOfFirstRoommate = indexOfLastRoommate - roommatesPerPage;
  const currentRoommates = roomMate.slice(
    indexOfFirstRoommate,
    indexOfLastRoommate
  );
// Change page
const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // add To Roommate Wishlist ---------------------------

  const addToRoommateWishlist = async (roommate) => {
    console.log(roommate);
    try {
      const roomMates = {
        userEmail: user?.email,
        userId: user?._id,
        roommateWishList: roommate,
        flatWishList: "",
      };
     
      // console.log(roomMates);
      const response = await axios.post(`http://localhost:5000/wishlist`, roomMates);
      if (response.status === 201) {
        // console.log("Added to wishlist:", flat);
        message.success("Successfully Added to Wishlist!");
      } else if (response.status === 409) {
        message.error("Wishlist already exists for this user.");
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        message.error("Wishlist already exists for this user.");
      } else {
        console.error("Error adding to wishlist:", error);
        message.error("An error occurred while adding to wishlist.");
      }
    }
  };
  return (
    <>
      <div className="px-2 lg:px-12 flex flex-wrap justify-center lg:gap-10 gap-5 py-5">
        <div className="flex border border-black rounded-lg">
          <Link to="/findFlat">
            <button
              className={`md:px-6 px-2 py-3 rounded-lg mr-2 text-[10px] md:text-sm lg:text-base  ${
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
              className={`md:px-6 px-2 py-3 rounded-lg mr-2 text-[10px] md:text-sm lg:text-base ${
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

        <div className="flex flex-wrap justify-center items-center gap-5 px-4">
          <input
            value={searchValue}
            onChange={handleSearch}
            className="border border-black rounded-lg w-56 lg:px-6 px-1 py-2 md:py-3"
            placeholder="Search Location"
          />

          <div className="relative">
            <button
              ref={imgRef}
              onClick={handleDropDown}
              className="border px-2 py-2 md:py-3 lg:py-3 border-black  rounded-lg"
            >
              Gender
              <IoIosArrowDown
                className={`inline ml-[137px] lg:ml-28 xl:ml-28${
                  dropDown ? "rotate-180" : "rotate-0"
                } ml-1`}
                size={16}
                onClick={genderDropDownIcon}
              />
            </button>
            <ul
              className={`absolute py-3 px-2 z-[1000] overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg  w-56 ${
                dropDown ? "block top-[50px]" : "hidden"
              }`}
            >
              <li>
                <button
                 onClick={() => handleGenderFilter("female")}
                className="rounded whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent flex items-center gap-2">
                
                  Female
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleGenderFilter("male")}
                className="rounded whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent flex items-center gap-2">
                  Male
                </button>
              </li>
            </ul>
          </div>
          <div className="relative">
            <button
              ref={pageRef}
              onClick={handleDropDownPage}
              className="border px-5 py-2 md:py-3 lg:py-3 border-black  rounded-lg"
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
              className={`absolute py-3 px-1 z-[1000] overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg  w-40 ${
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
      {/* <select
            onChange={handlePriceSort}
            defaultValue={"bold"}
            className="select select-bordered border border-gray-800 bg-gray-100 px-4 py-2 lg:w-auto w-[20vw] font-bold border-main focus:border-main rounded-lg  join-item"
          >
            <option className="font-bold" value="bold" disabled>
              Rent
            </option>
            <option>High To Low</option>
            <option>Low To High</option>
          </select> */}
      {/* roommate cards  */}

      <div className="flex justify-center mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-5 lg:px-9 px-6">
        {currentRoommates.map((roommate, index) => (
          <Link
            key={index}
            to={`/roommateDetails/${roommate._id}`}
            className="block"
          >
            <div className="bg-white md:px-4 py-5 rounded-lg ">
              <div className="relative border border-gray-150 grid h-[15rem] md:h-[20rem] w-full lg:max-w-[22rem] flex-col items-end justify-end overflow-hidden rounded-xl bg-white bg-clip-border text-center text-gray-700">
                <div
                  className="absolute inset-0 m-0 h-[230px] md:h-[290px] lg:h-[319px] border rounded-md border-gray-150 w-full overflow-hidden bg-black/40   bg-cover bg-clip-border bg-center text-gray-700 shadow-none"
                  style={{
                    backgroundImage: `url('http://localhost:5000/images/${roommate?.roomateList?.images[0]}')`,
                  }}
                >
                  <div className="flex justify-end items-center left-4 right-4 top-4 absolute">
                    <button
                      className="flex justify-end px-5 py-6"
                      onClick={() => addToRoommateWishlist(roommate)}
                    >
                      <svg
                        width={30}
                        className="hover:fill-red-500 hover:stroke-red-500 stroke-2 fill-transparent stroke-white "
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
                </div>
                <div className="relative lg:top-1 -top-5 md:-top-10 p-6 px-6 lg:py-6 md:px-5">
                  <img
                    alt="user"
                    src={`http://localhost:5000/images/${roommate?.roomateList?.contact_person
                    ?.image}`}
                    className="relative inline-block h-[50px] w-[50px] md:h-[70px] md:w-[70px] lg:h-[80px] lg:w-[80px] !rounded-lg border-2 border-white object-cover object-center"
                  />
                </div>
              </div>
              <div className="mt-3 flex-1 text-sm">
                <div>
                  <h3 className="text-gray-900 group-hover:underline group-hover:underline-offset-4">
                    Location:{" "}
                    {roommate.roomateList.description.location.address},
                    {roommate.roomateList.description.location.city},
                  </h3>
                  <p className="mt-2 text-pretty text-xs text-gray-500">
                    HomeType: {roommate.roomateList.description.bedroomType}
                  </p>
                </div>
                <p className="text-gray-900 font-bold text-lg mt-2">
                  $ {roommate.roomateList.description.rent}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      </div>

      {/* for pagination */}

      <div className=" flex flex-wrap justify-center mb-10 mt-24">
        <button
           className="join-item px-2 py-1 md:text-base text-sm rounded-md btn btn-outline mr-2"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &larr; Previous
        </button>
        {Array.from(
          { length: Math.ceil(roomMate.length / roommatesPerPage) },
          (_, i) => (
            <button
              key={i}
              className={`join-item px-3 md:px-4 md:text-base btn rounded-md btn-outline mr-1 md:mr-2 ${
                currentPage === i + 1 ? "bg-green-400 text-white" : ""
              }`}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </button>
          )
        )}
        <button
          className="join-item px-2 py-1 md:text-base rounded-md text-sm btn btn-outline mr-1 md:mr-2"
          onClick={() => paginate(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(roomMate.length / roommatesPerPage)
          }
        >
          Next &rarr;
        </button>
      </div>
    </>
  );
};

export default FindRoommate;
