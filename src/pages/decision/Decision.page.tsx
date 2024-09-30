import { useContext } from "react";
import AuthContext from "../../store/AuthProvider/Auth.context";
import { Redirect } from "react-router";

const DecisionComponent = () => {
  const { token } = useContext(AuthContext);
  return <Redirect to={token ? "/dashboard" : "/"} />;
};

export default DecisionComponent;
