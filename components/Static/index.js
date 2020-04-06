import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Error from "next/error";
import StaticPage from "../../pages/admin/cms/posts/staticPost";

export const Static = ({ url, statusCode }) => {
  const [content, setContent] = useState(null);
  useEffect(() => {
    const slug = url.replace("/", "");
    axios
      .get(`/posts/show?slug=${slug}`)
      .then(({ data }) => setContent(<StaticPage {...data} />))
      .catch(() => setContent(<Error statusCode={statusCode} />));
  }, []);

  return content;
};

Static.propTypes = {
  url: PropTypes.string,
  statusCode: PropTypes.number
};

export default Static;
