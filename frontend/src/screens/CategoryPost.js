import React, { useEffect, useState } from "react";
import axios from "axios";
import PostList from "../components/PostList";
import Loader from "../components/Loader";
import { categoriesList } from "../actions/categoriesActions";
import CategoryItem from "../components/CategoryItem";
import { useDispatch, useSelector } from "react-redux";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import "firebase/auth";
import firebaseConfig from "../firebaseConfig.json";
import "firebase/firestore";
import "firebase/storage";
import { useParams } from "react-router-dom";
import { url } from "../constants/host";
import { Button } from "react-bootstrap";

const PAGE_NUMBER = 0;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const CategoryPost = () => {
	const { category } = useParams();
	const dispatch = useDispatch();

	const [postData, setPostData] = useState([]);
	const [page, setPage] = useState(PAGE_NUMBER);
	const [loading, setLoading] = useState(true);

	const [hasNextPage, setHasNextPage] = useState(true);

	const CategoriesList = useSelector((state) => state.categoriesList);
	const { error, categories } = CategoriesList;

	const chosenCategory = categories.find((cat) => cat?.node?.id == category);

	const categoryName = chosenCategory ? chosenCategory?.node?.name : null;

	const [isExpanded, setIsExpanded] = useState(false);
	const [categoriesCount, setCategoriesCount] = useState(12);

	useEffect(() => {
		dispatch(categoriesList());
	}, [dispatch]);

	useEffect(() => {
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
              posts(first: 12, offset: ${page}, category: "${category}"){
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
	}, [page]);

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
		setCategoriesCount(12);
	};

	return (
		<div className="app">
			<div className="categories">
				EXPLORE TAGS{" "}
				{categories.length > 12 &&
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
			<h1 className="text-center text-3xl my-5">
				Posts with category: {categoryName}
			</h1>
			{postData.length > 0 ? (
				<PostList posts={postData} />
			) : (
				<p className="text-4xl text-center">No posts in this category :(</p>
			)}
			{loading && <Loader />}
		</div>
	);
};

export default CategoryPost;
