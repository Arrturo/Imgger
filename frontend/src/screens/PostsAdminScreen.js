import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Table, Image } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { postsList, deletePost } from "../actions/postActions";
import ReactPaginate from "react-paginate";

function PostsAdminScreen() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const userLogin = useSelector((state) => state.userLogin);
	const { loading, error, userInfo } = userLogin;

	const postList = useSelector((state) => state.postList);
	const { posts, postsCount } = postList;

	const [activePage, setActivePage] = useState(1);
	const [loadingPage, setLoadingPage] = useState(false);
	const postsPerPage = 10;

	useEffect(() => {
		if (userInfo && userInfo.user.isStaff === true) {
			dispatch(postsList((activePage - 1) * postsPerPage));
		} else {
			navigate(`/login`);
		}
	}, [dispatch, navigate, userInfo, activePage]);

	const deletePostHandler = (id, name) => {
		if (window.confirm(`Are you sure to delete post: "${name}" ?`)) {
			dispatch(deletePost(id));
		}
		window.location.reload();
	};

	const handlePageChange = (pageNumber) => {
		setLoadingPage(true);
		setActivePage(pageNumber);

		setTimeout(() => {
			setLoadingPage(false);
		}, 300);
	};

	return (
		<div>
			<h1 className="text-4xl text-center mb-5">
				Added posts in PySquad ({postsCount})
				{postsCount > 0 && (
					<span>
						{activePage * postsPerPage > postsCount
							? ` - Showing ${
									activePage * postsPerPage - postsPerPage + 1
							  } to ${postsCount} posts`
							: ` - Showing ${
									activePage * postsPerPage - postsPerPage + 1
							  } to ${activePage * postsPerPage} posts`}
					</span>
				)}
			</h1>

			{loading ? (
				<Loader />
			) : error ? (
				<Message variant="danger">{error}</Message>
			) : (
				<>
					<Table striped hover responsive className="table-sm mb-5">
						<thead className="text-center">
							<tr>
								<th></th>
								<th>Image</th>
								<th>Title</th>
								<th>Author</th>
								<th>Created at</th>
								<th></th>
							</tr>
						</thead>
						<tbody className="text-center">
							{posts.map((post, index) => (
								<tr key={post?.node?.id}>
									<td>{index + 1}</td>
									<td>
										<a href={`/post/${post?.node?.id}`}>
											<Image
												className="max-h-28 mx-auto d-block"
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
										<Link to={`/post/${post?.node?.id}/edit`}>
											<Button variant="light" className="btn-m">
												<i className="fa-regular fa-pen-to-square text-lime-500"></i>
											</Button>
										</Link>
										<Button
											variant="danger"
											className="btn-m"
											onClick={() =>
												deletePostHandler(post?.node?.id, post?.node?.title)
											}
										>
											<i className="fa-solid fa-trash-can text-red-500"></i>
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
					<ReactPaginate
						pageCount={Math.ceil(postsCount / postsPerPage)}
						pageRangeDisplayed={5}
						marginPagesDisplayed={2}
						onPageChange={({ selected }) => handlePageChange(selected + 1)}
						containerClassName="pagination justify-content-center"
						pageClassName="page-item"
						pageLinkClassName="page-link"
						activeClassName="active"
						previousClassName="page-item"
						previousLinkClassName="page-link"
						nextClassName="page-item"
						nextLinkClassName="page-link"
						breakClassName="page-item"
						breakLinkClassName="page-link"
						disabledClassName="disabled"
					/>
				</>
			)}
			{loadingPage && <Loader />}
			<br />
		</div>
	);
}

export default PostsAdminScreen;
