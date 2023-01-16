import ErrorMessage from "../errorMessage/ErrorMessage";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import "./404.scss";

const Page404 = () => {
  // useEffect(() => {

  // }, []);
  const navigate = useNavigate();

  const goBack = (e) => {
    e.preventDefault();
    navigate(-1);
  };

  return (
    <div className="error">
      <ErrorMessage />
      <p className="error_message">Page doesn't exist</p>
      <Link className="error_link" to="" onClick={goBack}>
        Back
      </Link>
    </div>
  );
};

export default Page404;
