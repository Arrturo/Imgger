import React, { useState, useEffect, useProps } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { Form, Button, Row, Col, Table, Image } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { postsList, deletePost } from "../actions/postActions";


function PostsAdminScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const postList = useSelector((state) => state.postList);
  const { posts } = postList;
  

  useEffect(() => {
    if (userInfo && userInfo.user.isStaff === true) {
      dispatch(postsList());
    } else {
      navigate(`/login`);
    }
  }, [dispatch, navigate]);

  const deletePostHandler = (id, name) => {
    if (
        window.confirm(
          `Are you sure to delete post: "${name}" ?`
        )
      ) {
        dispatch(deletePost(id));
      }
      window.location.reload();
}

  return (
    <div>
      <h1 className="text-4xl text-center mb-5">
        Added posts in PySquad ({posts?.length})
      </h1>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Table striped hover responsive className="table-sm mb-5">
          <thead className="text-center">
            <tr>
              <th>Id</th>
              <th>Image</th>
              <th>Title</th>
              <th>Author</th>
              <th>Created at</th>
              <th></th>
            </tr>
          </thead>

          <tbody className="text-center">
            {posts.map((post) => (
              <tr key={post?.node?.id}>
                    <td>{post?.node?.id}</td>
                    <td>
                      <a href={`http://localhost:3000/post/${post?.node?.id}`}>
                        <Image
                          className="max-h-28 "
                          src={post?.node?.image?.url}
                          alt={post?.node?.title}
                        />
                      </a>
                    </td>
                    <td>{post?.node?.title}</td>
                    <td>{post?.node?.user?.username}</td>
                    <td>
                      {post?.node?.createTime?.substring(0, 10)}{" "}
                      {post?.node?.createTime?.substring(15, 19)}
                    </td>
                    <td>
                      <Button varinat="light" className="btn-m">
                        <i class="fa-regular fa-pen-to-square text-lime-500"></i>
                      </Button>
                      <Button varinat="danger" className="btn-m" onClick={() => deletePostHandler(post?.node?.id, post?.node?.title)}>
                        <i class="fa-solid fa-trash-can text-red-500"></i>
                      </Button>
                    </td>
                </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default PostsAdminScreen;
