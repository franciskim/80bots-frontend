import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { connect } from "react-redux";

const AllPosts = () => {};

AllPosts.propTypes = {};

const mapStateToProps = state => ({
  posts: state.cms.posts
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(AllPosts);
