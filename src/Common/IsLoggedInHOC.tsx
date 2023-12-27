import React from "react";
import { useJwt } from "react-jwt";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/rootReducer";
import SessionExpiredModal from "./SessionExpiredModal";

const IsLoggedinHOC = (WrappedComponent: any) => {
  const HocComponent = ({ ...props }) => {
    const { accessToken } = useSelector((state: RootState) => state.auth);
    const { isExpired } = useJwt(accessToken);
    if (isExpired) {
      return <SessionExpiredModal />;
    } else {
      return <WrappedComponent {...props} isTokenExpired={isExpired} />;
    }
  };
  return HocComponent;
};
export default IsLoggedinHOC;
