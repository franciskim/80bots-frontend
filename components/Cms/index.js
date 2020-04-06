import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import Modal from "../default/Modal";
import { css } from "@emotion/core";
import { NOTIFICATION_TYPES } from "/config";
import { connect } from "react-redux";
import { Button, Paginator } from "/components/default";
import { Card, CardBody } from "/components/default/Card";
import {
  Table,
  Thead,
  Filters,
  LimitFilter,
  SearchFilter,
  Th
} from "/components/default/Table";
import { addNotification } from "/store/notification/actions";
import { getPosts, deletePost } from "../../store/cms/actions";
import Link from "next/link";
import Icon from "../default/icons";
import { withTheme } from "emotion-theming";

const Container = styled(Card)`
  border-radius: 0.25rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
`;

const AddButtonWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
  button {
    margin-right: 20px;
    &:last-child {
      margin-right: 0;
    }
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const IconButton = styled(Button)`
  display: inline-flex;
  justify-content: center;
  padding: 2px;
  margin-right: 5px;
  width: 27px;
  height: 27px;
  &:last-child {
    margin-right: 0;
  }
`;

const AddButton = styled(Button)`
  padding: 10px 15px;
  margin-right: 10px;
`;

const A = styled.a`
  color: inherit;
  text-decoration: none;
`;

const modalStyles = css`
  min-width: 800px;
  max-width: 800px;
  overflow-y: visible;
  @media (max-height: 900px) {
    max-height: 700px;
    overflow-y: scroll;
  }
`;

const Cms = ({ getPosts, deletePost, posts, total, theme }) => {
  const [clickedPost, setClickedPost] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [order, setOrder] = useState({ value: "", field: "" });
  const [search, setSearch] = useState(null);

  const deleteModal = useRef(null);

  useEffect(() => {
    getPosts({ page, limit });
  }, []);

  const modalDeletePost = () => {
    setClickedPost(null);
    deletePost(clickedPost.id)
      .then(() => {
        addNotification({
          type: NOTIFICATION_TYPES.SUCCESS,
          message: "Post removed!"
        });
        getPosts({
          page,
          limit,
          sort: order.field,
          order: order.value,
          search
        });
        deleteModal.current.close();
      })
      .catch(() =>
        addNotification({
          type: NOTIFICATION_TYPES.ERROR,
          message: "Post delete failed"
        })
      );
  };

  const searchPosts = value => {
    setSearch(value);
    getPosts({
      page,
      limit,
      sort: order.field,
      order: order.value,
      search: value
    });
  };

  const onOrderChange = (field, value) => {
    setOrder({ field, value });
    getPosts({ page, limit, sort: field, order: value, search });
  };

  const OrderTh = props => (
    <Th
      {...props}
      // eslint-disable-next-line react/prop-types
      order={
        props.field === order.field || props.children === order.field
          ? order.value
          : ""
      }
      onClick={onOrderChange}
    />
  );

  const renderRow = (post, idx) => (
    <tr key={idx}>
      <td>{post.title}</td>
      <td>
        <Link href={`/${post.slug}`}>
          <a target="_blank">{post.slug}</a>
        </Link>
      </td>
      <td>{post.type === "bot" ? "Bot Post" : "Post"}</td>
      <td>{post.status}</td>
      <td className="td-controls">
        <IconButton title={"View Post"} type={"primary"}>
          <Link
            href={"/admin/cms/posts/[id]"}
            as={`/admin/cms/posts/${post.id}`}
          >
            <A>
              <Icon name={"eye"} color={theme.colors.white} />
            </A>
          </Link>
        </IconButton>

        <IconButton title={"Edit Post"} type={"primary"}>
          <Link
            href={"/admin/cms/posts/[id]/edit"}
            as={`/admin/cms/posts/${post.id}/edit`}
          >
            <A>
              <Icon name={"edit"} color={theme.colors.white} />
            </A>
          </Link>
        </IconButton>

        <IconButton
          title={"Delete Post"}
          type={"danger"}
          onClick={() => {
            setClickedPost(post);
            deleteModal.current.open();
          }}
        >
          <Icon name={"garbage"} color={theme.colors.white} />
        </IconButton>
      </td>
    </tr>
  );

  return (
    <>
      <AddButtonWrap>
        <AddButton type={"primary"}>
          <Link href={"/admin/cms/add"}>
            <A>Add Post</A>
          </Link>
        </AddButton>
      </AddButtonWrap>
      <Container>
        <CardBody>
          <Filters>
            <LimitFilter
              onChange={({ value }) => {
                setLimit(value);
                getPosts({
                  page,
                  limit: value,
                  sort: order.field,
                  order: order.value,
                  search
                });
              }}
            />
            <SearchFilter
              onChange={value => {
                searchPosts(value);
              }}
            />
          </Filters>

          <Table responsive>
            <Thead>
              <tr>
                <OrderTh field={"title"}>Post title</OrderTh>
                <OrderTh field={"slug"}>Slug</OrderTh>
                <OrderTh field={"slug"}>Type</OrderTh>
                <OrderTh field={"status"}>Status</OrderTh>
                <th>Action</th>
              </tr>
            </Thead>
            <tbody>{posts.map(renderRow)}</tbody>
          </Table>
          <Paginator
            total={total}
            pageSize={limit}
            onChangePage={page => {
              setPage(page);
              getPosts({
                page,
                limit,
                sort: order.field,
                order: order.value,
                search
              });
            }}
          />
        </CardBody>
      </Container>

      <Modal
        ref={deleteModal}
        title={"Delete Post"}
        contentStyles={css`
          min-width: 300px;
        `}
      >
        <Buttons>
          <Button
            type={"danger"}
            onClick={() => {
              setClickedPost(null);
              deleteModal.current.close();
            }}
          >
            Cancel
          </Button>
          <Button type={"primary"} onClick={modalDeletePost}>
            Yes
          </Button>
        </Buttons>
      </Modal>
    </>
  );
};

Cms.propTypes = {
  getPosts: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  theme: PropTypes.shape({
    colors: PropTypes.object.isRequired
  }).isRequired
};

const mapStateToProps = state => ({
  posts: state.cms.posts,
  total: state.cms.total
});

const mapDispatchToProps = dispatch => ({
  getPosts: query => dispatch(getPosts(query)),
  deletePost: id => dispatch(deletePost(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Cms));
