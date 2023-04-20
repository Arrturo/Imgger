import React, { useState, useEffect } from "react";
import {
  Link,
  useParams,
  useHistory,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
  FormLabel,
  FormGroup,
} from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { likePost, dislikePost } from "../actions/postActions";
import {
  postsDetails,
  postsList,
  postComments,
  addComment,
  deleteComment,
  editComment,
} from "../actions/postActions";
import CategoryItem from "../components/CategoryItem";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

function PostScreen() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const postDetails = useSelector((state) => state.postDetails);
  const { loading, error, post } = postDetails;

  const PostComments = useSelector((state) => state.postComments);
  const { comments } = PostComments;

  const [comment, setComment] = useState("");

  const [hoveredItemId, setHoveredItemId] = useState(null);
  const [clickedItemId, setClickedItemId] = useState(null);

  const [editMode, setEditMode] = useState(false);
  const [editedComment, setEditedComment] = useState("");

  const handleItemMouseEnter = (itemId) => {
    setHoveredItemId(itemId);
  };

  const handleItemMouseLeave = () => {
    setHoveredItemId(null);
  };

  const likePostHandler = (id) => {
    dispatch(likePost(id));
    // window.location.reload();
  };

  const dislikePostHandler = (id) => {
    dispatch(dislikePost(id));
    window.location.reload();
  };

  useEffect(() => {
    dispatch(postsDetails(id));
    dispatch(postComments(id));
  }, [dispatch]);

  const nextPost = post.nextPost?.id;
  const previousPost = post.previousPost?.id;

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(addComment(id, userInfo?.user?.id, comment));
    window.location.reload();
  };

  const deleteHandler = (id, name) => {
    if (
      window.confirm(
        `Are you sure to delete comment: "${name}" and all subcomments of this comment ?`
      )
    ) {
      dispatch(deleteComment(id));
    }
    window.location.reload();
  };

  const saveChangesHandler = (event) => {
    event.preventDefault();
    dispatch(editComment({ id: clickedItemId, content: editedComment }));
    window.location.reload();
  };

  return (
    <div>
      <Col className="flex justify-between mb-20 border-b-4">
        <a
          href={`/post/${previousPost}`}
          className="btn font-bold bg-amber-300 hover:bg-amber-500 rounded-full my-3"
        >
          <i class="fa-solid fa-circle-chevron-left"></i> Previous
        </a>
        <a
          href="/"
          className="btn font-bold bg-lime-500 hover:bg-lime-700 my-3"
        >
          <i class="fa-solid fa-house"></i>
        </a>
        <a
          href={`/post/${nextPost}`}
          className="btn font-bold bg-amber-300 hover:bg-amber-500 rounded-full my-3"
        >
          Next <i class="fa-solid fa-circle-chevron-right"></i>
        </a>
      </Col>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger" children={error} />
      ) : (
        <div>
          <Row>
            <Col md={1} className="text-2xl grid gap-16 content-center ">
              <ListGroup.Item>
                {post.isLiked ? (
                  <Button
                    variant="outline-success"
                    active="true"
                    onClick={() => likePostHandler(id)}
                  >
                    {" "}
                    <i class="fa-solid fa-thumbs-up"></i> {post.likes}{" "}
                  </Button>
                ) : (
                  <Button
                    variant="outline-success"
                    onClick={() => likePostHandler(id)}
                  >
                    {" "}
                    <i class="fa-regular fa-thumbs-up"></i> {post.likes}{" "}
                  </Button>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                {post.isDisliked ? (
                  <Button
                    variant="outline-danger"
                    active="true"
                    onClick={() => dislikePostHandler(id)}
                  >
                    {" "}
                    <i class="fa-solid fa-thumbs-down"></i> {post.dislikes}{" "}
                  </Button>
                ) : (
                  <Button
                    variant="outline-danger"
                    onClick={() => dislikePostHandler(id)}
                  >
                    {" "}
                    <i class="fa-regular fa-thumbs-down"></i> {post.dislikes}{" "}
                  </Button>
                )}
              </ListGroup.Item>
            </Col>

            <Col md={6}>
              <p className="text-xl">
                Added by:{" "}
                <span className="text-purple-500">{post?.user?.username}</span>{" "}
                at {post?.createTime?.substring(0, 10)}{" "}
                {post?.createTime?.substring(15, 19)}
              </p>
              <Image src={post?.image?.url} alt={post.title} fluid />
            </Col>

            <Col md={5}>
              <ListGroup.Item variant="flush" className="mb-5">
                <p className="text-2xl">Tags:</p>
                {<CategoryItem name={post?.category?.name} />}
              </ListGroup.Item>

              <ListGroup.Item variant="flush">
                <h2 className="text-4xl text-center">{post.title}</h2>
              </ListGroup.Item>

              <ListGroup.Item variant="flush">
                <h2 className="text-base text-center mt-16">
                  {post.description}
                </h2>
              </ListGroup.Item>
            </Col>
          </Row>

          <Row className="flex justify-center">
            <Col md={8}>
              <h1 className="text-3xl my-5 border-b-2 p-2">
                {comments.length} Comments:
              </h1>
              {comments.length === 0 && (
                <Message varing="info">
                  Users have not added any comments yet
                </Message>
              )}

              <div className="my-5 ">
                {comments.map((com) => (
                  <div
                    key={com.node.id}
                    className=" border-b-2 p-3 com"
                    onMouseEnter={() => handleItemMouseEnter(com.node.id)}
                    onMouseLeave={handleItemMouseLeave}
                  >
                    <p className="mb-2 text-sm">
                      <strong className="text-base text-amber-800 pr-2">
                        {com.node.user.id == post?.user?.id ? <span className="text-gray-900"><span className="text-purple-500">{com.node.user.username}</span> (Author)</span> : <span>{com.node.user.username}</span>}
                      </strong>
                      {dayjs(com.node.createTime).fromNow()}
                      {com.node.user.id == userInfo?.user?.id ||
                      userInfo?.user?.isStaff === true ? (
                        <button
                          className="edit-btn float-right px-3"
                          onClick={() =>
                            deleteHandler(com.node.id, com.node.comment)
                          }
                        >
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      ) : null}
                      {com.node.user.id == userInfo?.user?.id ||
                      userInfo?.user?.isStaff === true ? (
                        <button
                          onClick={() => (
                            setEditMode(true),
                            setEditedComment(com.node.comment),
                            setClickedItemId(com.node.id)
                          )}
                          className="edit-btn float-right"
                        >
                          <i class="fa-solid fa-pencil"></i>
                        </button>
                      ) : null}
                    </p>
                    <p className="text-xl flex justify-between pr-5">
                      {editMode && com.node.id === clickedItemId ? (
                        <div>
                          <input
                            className="border-2 p-2"
                            type="text"
                            value={editedComment}
                            onChange={(event) =>
                              setEditedComment(event.target.value)
                            }
                          />
                          <Button
                            className="save-button"
                            onClick={saveChangesHandler}
                          >
                            <i class="fa-solid fa-save"></i> save
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <p>{com.node.comment}</p>
                          <p className="text-base">
                            <button className="mt-2 px-3 hover:text-lime-600 ease-in duration-75"> <i class="fa-solid fa-thumbs-up"></i> 3 </button>
                            <button className="mt-2 hover:text-red-500 ease-in duration-75"> <i class="fa-solid fa-thumbs-down"></i> 1 </button>
                          </p>
                        </div>
                      )}
                      {com.node.id === hoveredItemId ? (
                        <Button
                          type="submit"
                          variant="primary"
                          className="reply-btn"
                        >
                          <i class="fa-solid fa-reply"></i> Reply
                        </Button>
                      ) : null}
                    </p>
                  </div>
                ))}
              </div>

              <h4 className="text-xl text-center mt-5">Add comment</h4>
              {userInfo ? (
                <Form onSubmit={submitHandler}>
                  <FormGroup controlId="comment" className="mt-1">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      row="5"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholer="Enter a comment"
                    ></Form.Control>
                  </FormGroup>

                  <Button
                    type="submit"
                    variant="primary"
                    className="button-primary mt-3 mb-5"
                  >
                    <i class="fa-solid fa-share-nodes"></i> Share
                  </Button>
                </Form>
              ) : (
                <Message variant="info">
                  You must be{" "}
                  <Link to="/login" className="text-red-700">
                    logged in{" "}
                  </Link>{" "}
                  to add a comment
                </Message>
              )}
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}

export default PostScreen;
