import React, { useState, useContext, useEffect } from "react";
import { navigate } from "gatsby";
import Layout, { UserData } from "./Layout"
import { logoutUser } from "../services/apiFunction"
import { Button } from "react-bootstrap";
import "bootstrap/dist/js/bootstrap.min.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, RouteComponentProps, } from "@reach/router"


interface INavbarLinks {
  href: string,
  text: string
}
interface IAllRoleLinks {
  owner: INavbarLinks[]
  superAdmin: INavbarLinks[]
  hrAdmin: INavbarLinks[]
  accountEmployee: INavbarLinks[]
  technicalEmployee: INavbarLinks[]
  marketingEmployee: INavbarLinks[]
}

const allRoleLinks: any = {
  owner: [
    { href: "/", text: "Home |" },
    { href: "/account", text: "Accounting |" },
    { href: "/payroll", text: "Payroll |" },
    { href: "/ecommerce", text: "Ecommerce |" },
    { href: "/projects", text: "Projects |" },
    { href: "/marketing", text: "Marketing & New Leads |" },
    { href: "/Owner/myprofile", text: "My Profile |" },
  ],
    superAdmin: [
      { href: "/", text: "Home |" },
      { href: "/account", text: "Accounting |" },
      { href: "/superAdminPayroll", text: "Payroll |" },
      { href: "/ecommerce", text: "Ecommerce |" },
      { href: "/projects", text: "Projects |" },
      { href: "/marketing", text: "Marketing & New Leads |" },
      { href: "/superAdmin/superAdminProfile/", text: "My Profile |" },
  ],
  hrAdmin: [
    { href: "/", text: "Home |" },
    { href: "/hrPayroll", text: "Payroll |" },
    { href: "/projects", text: "Projects |" },
    { href: "/attendance", text: "Attendance system |" },
    { href: "/HR Management/hrProfile/", text: "My Profile |" },
  ],
  accountEmployee: [
    { href: "/", text: "Home |" },
    { href: "/account", text: "Accounting |" },
    { href: "/app/profile1", text: "My Profile |" },
  ],
  technicalEmployee: [
    { href: "/", text: "Home |" },
    { href: "/projects", text: "Projects |" },
    { href: "/app/profile1", text: "My Profile |" },
  ],
  marketingEmployee: [
    { href: "/", text: "Home |" },
    { href: "/marketing", text: "Marketing & New Leads |" },
    { href: "/app/profile1", text: "My Profile |" },
  ],
}

const allRole: string[] = [
  "owner",
  "superAdmin",
  "hrAdmin",
  "technicalEmployee",
  "accountEmployee",
  "marketingEmployee",
]

const Navbar = (props: RouteComponentProps) => {
  function handleKeyDown(e: React.KeyboardEvent<HTMLSpanElement>) { if (e.keyCode === 13) { logout(); } }
  const { user: data } = useContext(UserData)
  const [user, setUser] = useState<any>({})
  const [userRole, setUserRole] = useState<any>("")

  const logout = async () => {
    const { success, message, error } = await logoutUser()
    if (success === false) {
      window.alert(error)
    } else {
      window.alert(message)
      toast.success(message)
      setUser({ success: false })
      navigate("/")
    }
  }
  useEffect(() => {
    if (data?.employee) {
      setUser(data)
      setUserRole(user.employee?.payrollData.role)
    }
    // if (data === undefined) {
    //   callUser();
    // }
  }, [data, userRole])

  return (
    <>
      <nav className="navbar navbar-expand-lg fixed-top gatsbyNav">
        <div className="container-fluid">
          <ToastContainer autoClose={false} className="toastContainer" />
          {/* {console.log("bug3")} */}
          <img
            src="/logo1.png"
            alt="logo"
            className="img-fluid ps-3 logo"
            style={{ width: "12%" }}
          />

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {userRole && allRole.indexOf(userRole ) !== -1 ? (
                // let userRole:any=allRole[allRole.indexOf(user.employee.payrollData.role)]
                // allRoleLinks[`${ userRole }`].map((link: any) => {
                allRoleLinks[userRole as keyof IAllRoleLinks].map((link: any) => {
                  return (
                    <li key={link.href} className="nav-item">
                      <a className="nav-link" href={link.href}>
                        {link.text}
                      </a>
                    </li>
                  )
                })
              ) : (

                <>

                  <li className="nav-item">
                    <a className="nav-link" aria-current="page" href="/" role='homeLink' data-testid="homeBtn">
                      Home |
                    </a>
                  </li>
                  <li className="nav-item">
                    <Link to="/app/login/" className="nav-link" data-testid="loginBtn" role="loginRole">
                      <Button
                        as="input"
                        type="submit"
                        className="loginBtn "
                        onClick={()=>navigate("/app/login/")}
                        value="LOG IN"
                      />
                    </Link>
                  </li>
                </>
              )}
              {user && user.success === true ? (

                <div className="nav-item">
                  <li>
                    <span onClick={logout} onKeyDown={handleKeyDown} className="nav-link">
                      Logout
                    </span>
                  </li>
                </div>
              ) : (
                ""
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
