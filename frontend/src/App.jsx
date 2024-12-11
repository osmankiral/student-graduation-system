import "./App.css";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminDashBoard from "./pages/AdminDashBoard";
import LoginPanel from "./pages/LoginPanel";
import Students from "./components/Student/Students";
import Faculties from "./components/Faculty/Faculties";
import FacultyDetails from "./components/Faculty/FacultyDetails";
import AddFaculty from "./components/Faculty/AddFaculty";
import AdminHome from "./components/DashboardLayout/AdminHome";
import StudentDetails from "./components/Student/StudentDetails";
import AddStudent from "./components/Student/AddStudent";
import Departments from "./components/Department/Departments";
import Users from "./components/User/Users";
import UserDetail from "./components/User/UserDetail";
import AddUser from "./components/User/AddUser";
import AddDepartment from "./components/Department/AddDepartment";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPanel />} />
          <Route path="/adminpaneli" element={<AdminDashBoard />}>
            <Route path="anasayfa" element={<AdminHome />} />
            <Route path="ogrenciler">
              <Route index element={<Students />} /> {/* Ana liste sayfası */}
              <Route path=":id" element={<StudentDetails />} />{" "}
              <Route path="ekle" element={<AddStudent />} />
            </Route>
            <Route path="fakulteler">
              <Route index element={<Faculties />} /> {/* Ana liste sayfası */}
              <Route path=":id" element={<FacultyDetails />} />{" "}
              <Route path="ekle" element={<AddFaculty />} />
              <Route path="departmanekle" element={<AddDepartment />} />
            </Route>

            <Route path="kullanicilar">
              <Route index element={<Users />} /> {/* Ana liste sayfası */}
              <Route path=":id" element={<UserDetail />} />{" "}
              <Route path="ekle" element={<AddUser />} />
            </Route>
            <Route path="departmanlar" element={<Departments />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
