import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Redux/rootReducer";
import { logout } from "../Redux/Reducers/authSlice";
import { Link, useNavigate } from "react-router-dom";
import Notification from "./Notification";
import { CapitalizeFirstLetter } from "../Helper";

function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout(false));
    navigate("/");
  };

  return (
    <>
      <div className="nk-header nk-header-fixed is-light">
        <div className="container-fluid">
          <div className="nk-header-wrap">
            <div className="nk-menu-trigger d-xl-none ms-n1">
              <a
                href="#"
                className="nk-nav-toggle nk-quick-nav-icon"
                data-target="sidebarMenu"
              >
                <em className="icon ni ni-menu"></em>
              </a>
            </div>
            <div className="nk-header-brand d-xl-none">
              <Link to="/" className="logo-link">
                <img
                  className="logo-light logo-img"
                  src={require("../images/bold_port.png")}
                  alt="logo"
                />
                <img
                  className="logo-dark logo-img"
                  src={require("../images/bold_port.png")}
                  alt="logo-dark"
                />
              </Link>
            </div>
            <div className="nk-header-search ms-3 ms-xl-0"></div>
            <div className="nk-header-tools">
              <ul className="nk-quick-nav">
                <Notification />
                <li className="dropdown user-dropdown">
                  <a
                    href="#"
                    className="dropdown-toggle me-n1"
                    data-bs-toggle="dropdown"
                  >
                    <div className="user-toggle">
                      <div className="user-avatar sm">
                        <em className="icon ni ni-user-alt"></em>
                      </div>
                      <div className="user-info d-none d-xl-block">
                        <div className="user-status user-status-active">
                          Administator
                        </div>
                        <div className="user-name dropdown-indicator">
                          {user?.name}
                        </div>
                      </div>
                    </div>
                  </a>
                  <div className="dropdown-menu dropdown-menu-md dropdown-menu-end">
                    <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
                      <div className="user-card">
                        <div className="user-avatar">
                          <em className="icon ni ni-user-alt"></em>
                        </div>
                        <div className="user-info">
                          <span className="lead-text">
                            {CapitalizeFirstLetter(user?.name)}
                          </span>
                          <span className="sub-text">{user?.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown-inner">
                      <ul className="link-list">
                        <li>
                          <Link to="/admin-profile">
                            <em className="icon ni ni-user-alt"></em>
                            <span>View Profile</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="dropdown-inner">
                      <ul className="link-list">
                        <li>
                          <a href="#" onClick={handleLogout}>
                            <em className="icon ni ni-signout"></em>
                            <span>Sign out</span>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavBar;
