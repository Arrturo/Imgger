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

const PAGE_NUMBER = 0;


const SearchingPost = () => {
	const { keywords } = useParams();


	const app = initializeApp(firebaseConfig);
	const analytics = getAnalytics(app);

	const dispatch = useDispatch();

	const [postData, setPostData] = useState([]);
	const [page, setPage] = useState(PAGE_NUMBER);
	const [loading, setLoading] = useState(true);

	const [hasNextPage, setHasNextPage] = useState(true);


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
				`http://127.0.0.1:8000/graphql`,
				{
					query: `
            query{
              search(first: 12, offset: ${page}, keyword: "${keywords}"){
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

			if (!data.data.search.pageInfo.hasNextPage) {
				setHasNextPage(false);
			}
			if (data.data.search.edges.length > 0) {
				setPostData((prev) => [...prev, ...data.data.search.edges]);
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

	return (
		<div className="app">
				<h1 className="text-center text-3xl">
					Search results for: "{keywords}"
				</h1>
			<PostList posts={postData} />
			{loading && <Loader />}
		</div>
	);
};

export default SearchingPost;
