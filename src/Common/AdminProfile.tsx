import React from "react";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/rootReducer";
import { CapitalizeFirstLetter } from "../Helper";
import IsLoadingHOC from "./IsLoadingHOC";
import IsLoggedinHOC from "./IsLoggedInHOC";

const AdminProfile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <>
      <div className="nk-content ">
        <div className="container-fluid">
          <div className="nk-content-inner">
            <div className="nk-content-body">
              <div className="nk-block">
                <div className="card">
                  <div className="card-aside-wrap">
                    <div className="card-inner card-inner-lg">
                      <div className="nk-block-head">
                        <div className="nk-block-between d-flex justify-content-between">
                          <div className="nk-block-head-content">
                            <h4 className="nk-block-title">
                              Personal Information
                            </h4>
                            <div className="nk-block-des">
                              <p>
                                Basic info, like your name and address, that you
                                use on Nio Platform.
                              </p>
                            </div>
                          </div>
                          <div className="d-flex align-center">
                            <div className="nk-tab-actions me-n1">
                              <a
                                className="btn btn-icon btn-trigger"
                                data-bs-toggle="modal"
                                href="#profile-edit"
                              >
                                <em className="icon ni ni-edit"></em>
                              </a>
                            </div>
                            <div className="nk-block-head-content align-self-start d-lg-none">
                              <a
                                href="#"
                                className="toggle btn btn-icon btn-trigger"
                                data-target="userAside"
                              >
                                <em className="icon ni ni-menu-alt-r"></em>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="nk-block">
                        <div className="nk-data data-list">
                          <div className="data-head">
                            <h6 className="overline-title">Basics</h6>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Full Name</span>
                              <span className="data-value">
                                {CapitalizeFirstLetter(user?.name)}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Display Name</span>
                              <span className="data-value">
                                {CapitalizeFirstLetter(user?.name)}
                              </span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Email</span>
                              <span className="data-value">{user?.email}</span>
                            </div>
                          </div>
                          <div className="data-item">
                            <div className="data-col">
                              <span className="data-label">Phone Number</span>
                              <span className="data-value text-soft">
                                {user?.mobile}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EditProfile />
    </>
  );
};

export default IsLoadingHOC(IsLoggedinHOC(AdminProfile));
