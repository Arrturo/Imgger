import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { subcomments, deleteSubcomment, editSubcomment, postComments } from "../actions/postActions";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function SubcommentItem({ subcomment, commentId, post }) {
	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const [editMode, setEditMode] = useState(false);
	const [editedSubcomment, setEditedSubcomment] = useState("");
	

	const dispatch = useDispatch();

	const deleteSubcommentHandler = (subcommentId, commentId) => {
		if (window.confirm(`Are you sure to delete subcomment" ?`)) {
			dispatch(deleteSubcomment(subcommentId));
			setTimeout(() => {
				dispatch(subcomments(commentId));
				dispatch(postComments(post.id));
			}, 100);
		}
	};

	const saveChangesHandler = (event) => {
		event.preventDefault();
		dispatch(editSubcomment({ subcommentId: subcomment.id, description: editedSubcomment }));
		setTimeout(() => {
			dispatch(subcomments(commentId));
			setEditMode(false)
		}, 100);
	};


	return (
		<div className="mt-2 sub-container subcomment">
			<div className="subc py-1 ">
				<p className="text-sm p-2">
					<span className="flex">
						<strong className="text-base text-amber-800 pr-2">
							{subcomment.user.id === post?.user?.id ? (
								<span className="text-gray-900">
									<span className="text-purple-500">
										{subcomment.user.username}
									</span>{" "}
									(Author)
								</span>
							) : (
								<span>{subcomment.user.username}</span>
							)}
						</strong>
						{dayjs(subcomment.createTime).fromNow()}
						<div className="flex">
							{subcomment?.user.id === userInfo?.user?.id ||
							userInfo?.user?.isStaff === true ? (
								<button
									className="edit-btn edit-btn-sub px-3"
									onClick={() =>
										deleteSubcommentHandler(subcomment.id, commentId)
									}
								>
									<i className="fa-solid fa-trash"></i>
								</button>
							) : null}

							{subcomment.user.id == userInfo?.user?.id ||
							userInfo?.user?.isStaff === true ? (
								<button
									className="edit-btn edit-btn-sub mx-5"
									onClick={() => (
										setEditMode(true),
										setEditedSubcomment(subcomment.content)
									)}
								>
									<i class="fa-solid fa-pencil"></i>
								</button>
							) : null}
						</div>
					</span>
					{editMode === true ? (
						<div>
							<input
								className="border-2 p-2"
								type="text"
								value={editedSubcomment}
								onChange={(event) => setEditedSubcomment(event.target.value)}
							/>
							<Button className="save-button" onClick={saveChangesHandler}>
								<i class="fa-solid fa-save"></i> save
							</Button>
						</div>
					) : (
						<div className="content-wrapper my-1">{subcomment.content}</div>
					)}
				</p>
			</div>
		</div>
	);
}

export default SubcommentItem;
