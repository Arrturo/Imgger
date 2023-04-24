import React, { useState, useEffect, useProps } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { Form, Button, Row, Col, Table, Image, ListGroup } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { myPostsList, likedPostsList, deletePost } from "../actions/postActions";
import Post from "../components/Post"
import Rank from "../components/Rank"

function MyPostsScreen() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userLogin = useSelector((state) => state.userLogin);
    const { loading, error, userInfo } = userLogin;

    const myPosts = useSelector((state) => state.myPostList);
    const { loadingPosts, posts } = myPosts;

    const [myPostsSection, setMyPostsSection] = useState(true);
    const [likedPostsSection, setLikedPostsSection] = useState(false);

    const likedPosts = useSelector((state) => state.likedPostList);
    const { loadingLikedPosts, liked } = likedPosts;

    useEffect(() => {
        if (userInfo) {
          dispatch(myPostsList(userInfo?.user?.id));
          dispatch(likedPostsList())
        } else {
          navigate(`/login`);
        }
      }, [dispatch, navigate]);




  return (
    <div>
        <Row className="myposts-bg rounded-2xl border-4 border-rose-400">
            <Col className="mx-5 grid justify-items-start content-center">
                <p className="text-7xl"><span className="px-4 border-8 rounded-full">
                    <i class="fa-solid fa-user"></i></span> {userInfo?.user?.username}
                    <Rank points={posts?.length}/>
                    </p>
                <p className="text-xl ms-auto">{posts?.length} uploaded posts</p>
            </Col>
        </Row>
        <Row>
            <p className="mt-8 flex justify-around text-3xl">
                <Button variant="outline-success" onClick={() => (setLikedPostsSection(false), setMyPostsSection(true))} className={`font-bold text-2xl ${myPostsSection == true ? 'bg-amber-300' : null} `}>My posts</Button>
                <Button variant="outline-success" onClick={() => (setMyPostsSection(false), setLikedPostsSection(true))} className={`font-bold text-2xl ${likedPostsSection == true ? 'bg-amber-300' : null}`}>Liked posts</Button>
            </p>
        </Row>
        {myPostsSection === true ? 
        <Row className="mt-5">
            <p className="text-center text-3xl">List of posts published by you:</p>
            {loadingPosts && <Loader />}
            {posts?.map(post => (
                <Col key={post?.node?.id} sm={12} md={6} lg={4} xl={3} >
                    <Post key={post?.node?.id} post={post} my={true} />
                </Col>
            ))}
        </Row>
        : null}
        {likedPostsSection === true ? 
            <Row className="mt-5">
             <p className="text-center text-3xl">List of posts liked by you:</p>
                {liked?.map(like => (
                    <Col key={like?.node?.id} sm={12} md={6} lg={4} xl={2} >
                        <Post key={like?.node?.id} post={like} my={true} liked={true} />
                    </Col>
                ))}
            </Row>
        : null}
    </div>
  )
}

export default MyPostsScreen