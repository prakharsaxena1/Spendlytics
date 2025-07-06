import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import Loader from "../common/Loader";
import { IsAuthenticatedSelector, IsLoadingSelector } from "../../redux/slices/auth/selector";

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const isAuthenticated = useAppSelector(IsAuthenticatedSelector);
  const isLoading = useAppSelector(IsLoadingSelector);

  if (isLoading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/account?tab=login" replace />;
  }

  return children;
};

export default ProtectedRoute;
