import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../Redux/rootReducer";
import PrivateLayout from "../Layout/Private";

export interface LayoutProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: LayoutProps) {
  const { accessToken } = useSelector((state: RootState) => state.auth);

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <PrivateLayout children={children} />;
}

export default PrivateRoute;
