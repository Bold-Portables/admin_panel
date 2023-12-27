import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const pathName = location.pathname;

  return (
    <div
      className="nk-sidebar nk-sidebar-fixed is-light"
      data-content="sidebarMenu"
    >
      <div className="nk-sidebar-element nk-sidebar-head">
        <div className="nk-sidebar-brand">
          <Link to="/" className="logo-link nk-sidebar-logo">
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
            <img
              className="logo-small logo-img logo-img-small"
              src={require("../images/favicon.png")}
              alt="logo-small"
            />
          </Link>
        </div>
        <div className="nk-menu-trigger me-n2" id="toggle--button">
          <a
            className="nk-nav-toggle nk-quick-nav-icon d-xl-none"
            data-target="sidebarMenu"
          >
            <em className="icon ni ni-arrow-left"></em>
          </a>
          <a
            className="nk-nav-compact nk-quick-nav-icon d-none d-xl-inline-flex"
            data-target="sidebarMenu"
          >
            <em className="icon ni ni-menu"></em>
          </a>
        </div>
      </div>
      <div className="nk-sidebar-element">
        <div className="nk-sidebar-content">
          <div className="nk-sidebar-menu" data-simplebar>
            <ul className="nk-menu">
              <li
                className={`nk-menu-item ${pathName === "/" ? "active" : ""}`}
              >
                <Link to="/" className="nk-menu-link">
                  <span className="nk-menu-icon">
                    <em className="icon ni ni-dashboard-fill"></em>
                  </span>
                  <span className="nk-menu-text">Dashboard</span>
                </Link>
              </li>

              <li className="nk-menu-item has-sub">
                <a href="#" className="nk-menu-link nk-menu-toggle">
                  <span className="nk-menu-icon">
                    <em className="icon ni ni-card-view"></em>
                  </span>
                  <span className="nk-menu-text">Inventory</span>
                </a>
                <ul className="nk-menu-sub">
                  <li
                    className={`nk-menu-item ${
                      pathName === "/inventory" ? "active" : ""
                    }`}
                  >
                    <Link to="/inventory" className="nk-menu-link">
                      <span className="nk-menu-text">Inventory Management</span>
                    </Link>
                  </li>
                  <li
                    className={`nk-menu-item ${
                      pathName === "/category-management" ? "active" : ""
                    }`}
                  >
                    <Link to="/category-management" className="nk-menu-link">
                      <span className="nk-menu-text">Category Management</span>
                    </Link>
                  </li>
                  <li
                    className={`nk-menu-item ${
                      pathName === "/inventory-type-management" ? "active" : ""
                    }`}
                  >
                    <Link
                      to="/inventory-type-management"
                      className="nk-menu-link"
                    >
                      <span className="nk-menu-text">Types Management</span>
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nk-menu-item has-sub">
                <a href="#" className="nk-menu-link nk-menu-toggle">
                  <span className="nk-menu-icon">
                    <em className="icon ni ni-menu-squared"></em>
                  </span>
                  <span className="nk-menu-text">Service</span>
                </a>
                <ul className="nk-menu-sub">
                  <li
                    className={`nk-menu-item ${
                      pathName === "/service-list" ? "active" : ""
                    }`}
                  >
                    <Link to="/service-list" className="nk-menu-link">
                      <span className="nk-menu-text">Service Management</span>
                    </Link>
                  </li>
                  <li
                    className={`nk-menu-item ${
                      pathName === "/service-request" ? "active" : ""
                    }`}
                  >
                    <Link to="/service-requests" className="nk-menu-link">
                      <span className="nk-menu-text">Service Requests</span>
                    </Link>
                  </li>
                  <li
                    className={`nk-menu-item ${
                      pathName === "/service-category" ? "active" : ""
                    }`}
                  >
                    <Link to="/service-category" className="nk-menu-link">
                      <span className="nk-menu-text">Service Category</span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li
                className={`nk-menu-item ${
                  pathName === "/customers" ? "active" : ""
                }`}
              >
                <Link to="/customers" className="nk-menu-link">
                  <span className="nk-menu-icon">
                    <em className="icon ni ni-users-fill"></em>
                  </span>
                  <span className="nk-menu-text">Customers</span>
                </Link>
              </li>
              <li
                className={`nk-menu-item ${
                  pathName === "/subscriptions" ? "active" : ""
                }`}
              >
                <Link to="/subscriptions" className="nk-menu-link">
                  <span className="nk-menu-icon">
                    <em className="icon ni ni-file-docs"></em>
                  </span>
                  <span className="nk-menu-text">Contracts</span>
                </Link>
              </li>
              <li
                className={`nk-menu-item ${
                  pathName === "/quotations" ? "active" : ""
                }`}
              >
                <Link to="/quotations" className="nk-menu-link">
                  <span className="nk-menu-icon">
                    <em className="icon ni ni-calendar-check-fill"></em>
                  </span>
                  <span className="nk-menu-text">Quotations</span>
                </Link>
              </li>
              <li
                className={`nk-menu-item ${
                  pathName === "/send-email" ? "active" : ""
                }`}
              >
                <Link to="/send-email" className="nk-menu-link">
                  <span className="nk-menu-icon">
                    <em className="icon ni ni-mail-fill"></em>
                  </span>
                  <span className="nk-menu-text">Send Email</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
