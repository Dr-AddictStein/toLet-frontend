import "./SideBar.css";
import { Link, NavLink } from "react-router-dom";
import {
  FaUserCircle,
  FaUserEdit,
  FaRegCommentDots,
  FaHome,
} from "react-icons/fa";
import { ImBlog } from "react-icons/im";
import {
  MdOutlineDashboardCustomize,
  MdOutlineRateReview,
  MdDomainVerification,
  MdQueryStats,
} from "react-icons/md";
import { IoIosStats } from "react-icons/io";
import { useState } from "react";
import { GiFamilyHouse } from "react-icons/gi";
const SideBar = () => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [isDropDownOpen2, setIsDropDownOpen2] = useState(false);


  const sideLinks = (
    <>
     
      <li className="dashLi xl:text-[20px]">
        <NavLink to="/dashboard" className="dashNav flex items-center gap-2">
          <FaUserEdit className="dashIcon text-white"></FaUserEdit>
          All Users
        </NavLink>
      </li>
      <li className="dashLi xl:text-[20px]">
        <NavLink to="/dashboard/listing" className="dashNav flex items-center gap-2">
          <MdOutlineRateReview className="dashIcon text-white"></MdOutlineRateReview>
          Listing
        </NavLink>
      </li>
      <li className="dashLi xl:text-[20px]">
        <NavLink to="/dashboard/customize" className="dashNav flex items-center gap-2">
          <ImBlog className="dashIcon text-white"></ImBlog>
          Customize
        </NavLink>
      </li>
      <li className="dashLi xl:text-[20px]">
        <NavLink to="/dashboard/reportList" className="dashNav flex items-center gap-2">
          <IoIosStats className="dashIcon text-white"></IoIosStats>
          Report Listing
        </NavLink>
      </li>
    </>
  );
 
  const handleDropDownClick = () => {
    setIsDropDownOpen(!isDropDownOpen);
    
  };
  const handleDropDownClick2 = () => {
    setIsDropDownOpen2(!isDropDownOpen2);

  };

  return (
    <div>
      <div className="w-full bg-green-500 shadow-lg xl:min-w-[300px] min-h-screen ">
        <div className="flex items-center  ml-5">
          <Link to="/">
            <div className="flex  items-center">
            <GiFamilyHouse className="md:w-12 lg:h-12 w-10 h-9 mt-2" />
              <h4 className="font-bold poppins-font text-2xl lg:text-[34px] ml-2">
                Tol<span className="text-[#e33226]">et</span>
              </h4>
            </div>
          </Link>
        </div>
        {/* Sidebar Contents (Routes of dashboard) starts here */}
        <div className="p-4">
          <ul className="flex flex-col text-white gap-2 w-full">{sideLinks}</ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
