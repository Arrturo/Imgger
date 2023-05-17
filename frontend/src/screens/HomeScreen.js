import React, { useEffect, useState } from "react";
import axios from "axios";
import PostList from "../components/PostList";
import Loader from "../components/Loader";
import { categoriesList } from "../actions/categoriesActions";
import CategoryItem from "../components/CategoryItem";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import "firebase/auth";
import firebaseConfig from "../firebaseConfig.json";
import "firebase/firestore";
import "firebase/storage";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { url } from "../constants/host";
const PAGE_NUMBER = 0;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const HomeScreen = () => {
	const dispatch = useDispatch();

	const [postData, setPostData] = useState([]);
	const [page, setPage] = useState(PAGE_NUMBER);
	const [loading, setLoading] = useState(true);

	const [hasNextPage, setHasNextPage] = useState(true);
	const [sorting, setSorting] = useState(`newest`);

	const CategoriesList = useSelector((state) => state.categoriesList);
	const { error, categories } = CategoriesList;

	const [isExpanded, setIsExpanded] = useState(false);
	const [categoriesCount, setCategoriesCount] = useState(11);

	useEffect(() => {
		dispatch(categoriesList());
	}, [dispatch]);

	useEffect(() => {
		if (sorting === "newest") {
			setTimeout(async () => {
				const config = {
					headers: {
						"Content-type": "application/json",
					},
				};

				const { data } = await axios.post(
					`${url}/graphql`,
					{
						query: `
            query{
              posts(first: 12, offset: ${page}){
                  edges{
                    node{
                      id
                      title
                      description
                      likes
                      dislikes
                      createTime
                      isLiked
                      isDisliked
                      commentsCount
					  views
                      image{
                        url
                      }
                      user{
                          username
                      }
                    }
                  }
                    pageInfo{
                    hasNextPage
                    }
                }
                }
                `,
					},
					config
				);

				if (!data.data.posts.pageInfo.hasNextPage) {
					setHasNextPage(false);
				}
				if (data.data.posts.edges.length > 0) {
					setPostData((prev) => [...prev, ...data.data.posts.edges]);
				}
				setLoading(false);
			}, 1000);
		}
	}, [sorting, page]);

	useEffect(() => {
		if (sorting === "most liked") {
			setTimeout(async () => {
				const config = {
					headers: {
						"Content-type": "application/json",
					},
				};

				const { data } = await axios.post(
					`${url}/graphql`,
					{
						query: `
            query{
              postsByPopularity(first: 12, offset: ${page}){
                  edges{
                    node{
                      id
                      title
                      description
                      likes
                      dislikes
                      createTime
                      isLiked
                      isDisliked
					  views
                      commentsCount
                      image{
                        url
                      }
                      user{
                          username
                      }
                    }
                  }
                    pageInfo{
                    hasNextPage
                    }
                }
                }
                `,
					},
					config
				);

				if (!data.data.postsByPopularity.pageInfo.hasNextPage) {
					setHasNextPage(false);
				}
				if (data.data.postsByPopularity.edges.length > 0) {
					setPostData((prev) => [
						...prev,
						...data.data.postsByPopularity.edges,
					]);
				}
				setLoading(false);
			}, 1000);
		}
	}, [sorting, page]);

	useEffect(() => {
		if (sorting === "views") {
			setTimeout(async () => {
				const config = {
					headers: {
						"Content-type": "application/json",
					},
				};

				const { data } = await axios.post(
					`${url}/graphql`,
					{
						query: `
            query{
              postsByViews(first: 12, offset: ${page}){
                  edges{
                    node{
                      id
                      title
                      description
                      likes
                      dislikes
                      createTime
                      isLiked
                      isDisliked
					  views
                      commentsCount
                      image{
                        url
                      }
                      user{
                          username
                      }
                    }
                  }
                    pageInfo{
                    hasNextPage
                    }
                }
                }
                `,
					},
					config
				);

				if (!data.data.postsByViews.pageInfo.hasNextPage) {
					setHasNextPage(false);
				}
				if (data.data.postsByViews.edges.length > 0) {
					setPostData((prev) => [
						...prev,
						...data.data.postsByViews.edges,
					]);
				}
				setLoading(false);
			}, 1000);
		}
	}, [sorting, page]);

	useEffect(() => {
		if (hasNextPage) {
			window.addEventListener("scroll", handleScroll);
		} else {
			window.removeEventListener("scroll", handleScroll);
		}
		return () => window.removeEventListener("scroll", handleScroll);
	}, [hasNextPage]);

	const handleScroll = async () => {
		if (
			window.innerHeight + document.documentElement.scrollTop + 1 >=
			document.documentElement.scrollHeight
		) {
			setLoading(true);
			setPage((prev) => prev + 12);
		}
	};

	const handleShowMoreCategories = () => {
		setIsExpanded(true);
		setCategoriesCount(categories.length);
	};

	const handleShowLessCategories = () => {
		setIsExpanded(false);
		setCategoriesCount(11);
	};

	return (
		<div className="app">
			<div className="categories">
				EXPLORE TAGS{" "}
				{categories.length > 11 &&
					(isExpanded ? (
						<Button
							className="button-categorieslist"
							onClick={handleShowLessCategories}
						>
							Less tags <i class="fa-solid fa-caret-up"></i>
						</Button>
					) : (
						<Button
							className="button-categorieslist"
							onClick={handleShowMoreCategories}
						>
							More tags <i class="fa-solid fa-caret-down"></i>
						</Button>
					))}
				<br />
				{categories.slice(0, categoriesCount).map((category) => (
					<CategoryItem
						name={category.node.name}
						key={category?.node?.id}
						postsCount={category.node.postsCount}
						id={category.node.id}
					/>
				))}
			</div>
			<br></br>
			<Dropdown className="sort py-3">
				<Dropdown.Toggle
					id="dropdown-button-dark-example1"
					variant="success"
					className="sort-btn"
				>
					Sorting by: {sorting}
				</Dropdown.Toggle>

				<Dropdown.Menu variant="dark">
					<Dropdown.Item
						className="dropdown-item"
						onClick={() => (
							setSorting(null),
							setPostData([]),
							setPage(0),
							setHasNextPage(true),
							setSorting("newest"),
							setLoading(true)
						)}
						active
						disabled={sorting === "newest"}
					>
						{" "}
						Newest{" "}
					</Dropdown.Item>
					<Dropdown.Item
						onClick={() => (
							setSorting(null),
							setPostData([]),
							setPage(0),
							setHasNextPage(true),
							setSorting("most liked"),
							setLoading(true)
						)}
						active
						disabled={sorting === "most liked"}
					>
						{" "}
						Most Liked{" "}
					</Dropdown.Item>
					<Dropdown.Item
						onClick={() => (
							setSorting(null),
							setPostData([]),
							setPage(0),
							setHasNextPage(true),
							setSorting("views"),
							setLoading(true)
						)}
						active
						disabled={sorting === "views"}
					>
						{" "}
						Most viewed{" "}
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
			<PostList posts={postData} />
			{loading && <Loader />}
		</div>
	);
};

export default HomeScreen;
