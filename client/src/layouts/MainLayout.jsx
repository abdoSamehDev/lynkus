import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

function Layout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-8 w-full mx-auto bg-light-background dark:bg-dark-background">
      <Navbar />
      <Outlet />
      <Sidebar />
    </div>
  );
}

export default Layout;
