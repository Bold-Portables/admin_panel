import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { withoutAuthAxios } from "../config/config";
import {
  setAccessToken,
  setIsAuthenticated,
  setuser,
} from "../Redux/Reducers/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { RootState } from "../Redux/rootReducer";
import { useAppDispatch } from "../Redux/store";

import IsLoadingHOC from "../Common/IsLoadingHOC";
import { trimObjValues } from "../Helper";

interface MyComponentProps {
  setLoading: (isComponentLoading: boolean) => void;
}

const Login = (props: MyComponentProps) => {
  const { setLoading } = props;
  const navigate = useNavigate();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const requestPayload = trimObjValues(userInput);
    setLoading(true);
    await withoutAuthAxios()
      .post("/auth/login", requestPayload)
      .then(
        (response) => {
          setLoading(false);
          if (response.data.status === 1) {
            const resData = response.data.data;
            const user = resData.user;
            if (user && user.user_type === "ADMIN") {
              toast.success("You are logged in successfully");
              dispatch(setAccessToken(resData.token));
              dispatch(setuser(resData.user));
              dispatch(setIsAuthenticated(true));
              navigate("/");
              window.location.reload();
            } else {
              toast.error(`You don't have authorization!!`);
            }
          } else {
            toast.error(response.data.message);
          }
        },
        (error) => {
          setLoading(false);
          if (error.response.data.message) {
            toast.error(error.response.data.message);
          } else {
            const obj = error.response.data.errors[0];
            const errormsg = Object.values(obj) || [];
            if (errormsg && errormsg.length > 0) {
              toast.error(`${errormsg[0]}`);
            }
          }
        }
      )
      .catch((error) => {
        console.log("errorrrr", error);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="nk-wrap nk-wrap-nosidebar">
      <div className="nk-content ">
        <div className="nk-block nk-block-middle nk-auth-body  wide-xs">
          <div className="brand-logo pb-3 pt-3 text-center bg-white">
            <a className="logo-link">
              <img
                className="logo-light logo-img logo-img-lg"
                src={require("../images/bold_port.png")}
                alt="logo"
              />
              <img
                className="logo-dark logo-img logo-img-lg"
                src={require("../images/bold_port.png")}
                alt="logo-dark"
              />
            </a>
          </div>
          <div className="card">
            <div className="card-inner card-inner-lg">
              <div className="nk-block-head">
                <div className="nk-block-head-content">
                  <h4 className="nk-block-title">Sign-In</h4>
                  <div className="nk-block-des">
                    <p>
                      Access the Bold Portable panel using your email and
                      passcode.
                    </p>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="default-01">
                      Email
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="default-01"
                      placeholder="Email"
                      required
                      value={userInput.email}
                      onChange={handleChange}
                      name="email"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <a
                      className={`form-icon form-icon-right passcode-switch lg ${
                        showPassword ? "is-hiden" : "is-shown"
                      } `}
                      onClick={() => setShowPassword(!showPassword)}
                      data-target="password"
                    >
                      {showPassword ? (
                        <em className="passcode-icon icon-show icon ni ni-eye"></em>
                      ) : (
                        <em className="passcode-icon icon-hide icon ni ni-eye-off"></em>
                      )}
                    </a>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control form-control-lg"
                      id="password"
                      placeholder="Password"
                      required
                      value={userInput.password}
                      name="password"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group pt-3">
                  <button
                    type="submit"
                    className="btn btn-lg btn-primary btn-block"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IsLoadingHOC(Login);
