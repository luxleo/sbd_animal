import Image from 'next/image';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';

import { putReply, deleteReply } from '../../utils/fetch/bulletinBoard/inquery';
import useUserStore from '../../stores/authentication/useUserStore';

export default function Reply({ data, setReplyList }) {
	const { user } = useUserStore();
	const [isEditState, setIsEditState] = useState(false);
	const [fixedReplyData, setFixedReplyData] = useState(data);
	const [replyData, setReplyData] = useState(data);
	const onClickHandler = async (e) => {
		if (e.target.id === 'edit') {
			setIsEditState(true);
		} else {
			await deleteReply(fixedReplyData.id);
			setReplyList((prev) =>
				prev.filter((reply) => reply.id !== fixedReplyData.id)
			);
		}
	};
	const onReplyContentChange = (e) => {
		setReplyData((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};
	const onEditModeClickHandler = async (e) => {
		if (e.target.id === 'post edit') {
			data = { id: data.id, content: replyData.content };

			await putReply(data).then((res) => {
				setFixedReplyData((prev) => ({
					...prev,
					content: res.data.content,
				}));
			});
			setIsEditState(false);
		} else {
			setIsEditState(false);
			setReplyData((prev) => ({
				...prev,

				content: data.content,
			}));
		}
	};
	return (
		<article className="p-3 mb-6 text-base rounded-lg bg-gray-900">
			<footer className="flex justify-between items-center mb-2">
				<div className="flex items-center">
					{data.author.username === user.username ? (
						<div className="relative w-8 h-8 rounded-full overflow-hidden">
							<Image
								src={
									user.avatar_url
										? process.env.NODE_ENV === 'development'
											? process.env.NEXT_PUBLIC_MEDIA_HOST + user.avatar_url
											: user.avatar_url
										: '/rank_avatars/user_default_avatar.jpeg'
								}
								sizes="(max-width: 768px) 5vw"
								fill
								alt="Rank Avatar"
							/>
						</div>
					) : null}

					<p className="inline-flex items-center mr-3 text-sm text-white ml-2">
						{data.author.username}
					</p>
					<p className="text-gray-700">
						{format(parseISO(fixedReplyData.created_at), 'do MMM yy')}
					</p>
					{fixedReplyData.author.username === user.username &&
					isEditState === false ? (
						<div className="flex relative left-10">
							<div
								className="rounded-md p-1 text-sm bg-sky-700 mr-2"
								id="edit"
								onClick={onClickHandler}
							>
								수정
							</div>
							<div
								className="rounded-md p-1 text-sm bg-red-700"
								id="delete"
								onClick={onClickHandler}
							>
								삭제
							</div>
						</div>
					) : null}
				</div>
			</footer>
			{isEditState === false ? (
				<p className="text-gray-400">{fixedReplyData.content}</p>
			) : (
				<div>
					<textarea
						className="w-full bg-gray-700"
						value={replyData.content}
						name="content"
						onChange={onReplyContentChange}
					/>
					<div className="flex">
						<div
							className="bg-sky-700 text-sm"
							id="post edit"
							onClick={onEditModeClickHandler}
						>
							수정
						</div>
						<div
							className="bg-gray-700 text-sm"
							id="cancle"
							onClick={onEditModeClickHandler}
						>
							취소
						</div>
					</div>
				</div>
			)}
		</article>
	);
}
