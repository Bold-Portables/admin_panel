import React, { Fragment } from "react";
import TopNavBar from "../../Common/NavBar";
import Footer from "../../Common/Footer";
import Sidebar from "../../Common/Sidebar";

export interface LayoutProps {
  children: React.ReactNode;
}

const PrivateLayout = ({ children }: LayoutProps) => {
  return (
    <Fragment>
      <Sidebar />
      <div className="nk-wrap">
        <TopNavBar />
        {children}
        <Footer />
      </div>
    </Fragment>
  );
};

export default PrivateLayout;
