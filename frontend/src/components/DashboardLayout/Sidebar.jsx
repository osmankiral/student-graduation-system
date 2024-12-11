import { FaHome, FaGraduationCap, FaRegUser, FaUserGraduate, FaHive } from "react-icons/fa";
import { Link } from "react-router-dom"; // Link bileşenini içeri aktar

const Sidebar = ({ sidebarToggle }) => {
  return (
    <div
      className={`${
        sidebarToggle ? " hidden " : " block "
      } w-64 bg-gray-800 fixed h-full px-4 py-2`}
    >
      <div className="my-2 mb-4">
        <h1 className="text-2x text-white font-bold">Admin Dashboard</h1>
      </div>
      <hr />
      <ul className="mt-3 text-white font-bold">
        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
          <Link to="/adminpaneli/anasayfa" className="px-3">
            <FaHome className="inline-block w-6 h-6 mr-2 -mt-2" />
            Anasayfa
          </Link>
        </li>
        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
          <Link to="/adminpaneli/ogrenciler" className="px-3">
            <FaUserGraduate className="inline-block w-5 h-6 mr-2 -mt-2" />
            Öğrenciler
          </Link>
        </li>
        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
          <Link to="/adminpaneli/fakulteler" className="px-3">
            <FaGraduationCap className="inline-block w-6 h-6 mr-2 -mt-2" />
            Fakülteler
          </Link>
        </li>
        {/* <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
          <Link to="/adminpaneli/departmanlar" className="px-3">
            <FaHive className="inline-block w-6 h-6 mr-2 -mt-2" />
            Departmanlar
          </Link>
        </li> */}
        <li className="mb-2 rounded hover:shadow hover:bg-blue-500 py-2">
          <Link to="/adminpaneli/kullanicilar" className="px-3">
            <FaRegUser className="inline-block w-6 h-6 mr-2 -mt-2" />
            Kullanıcılar
          </Link>
        </li>
      </ul>
    </div>
  );
};
export default Sidebar;
