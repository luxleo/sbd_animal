import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { format, parseISO } from 'date-fns';

import {
	getMyDetailInquery,
	postReply,
	putInquery,
} from '../../utils/fetch/bulletinBoard/inquery';
import Reply from '../../components/bulletinBoard/Reply';

export default function InqueryDetail() {
	const router = useRouter();
	const [inqueryDetailData, setInqueryDetailData] = useState(false);
	const [replyList, setReplyList] = useState([]);
	const [replyMessage, setReplyMessage] = useState('');
	const [isEditMode, setIsEditMode] = useState(false);
	const [modifiedInquery, setModifiedInquery] = useState(false);
	const onReplyChange = (e) => {
		setReplyMessage((prev) => e.target.value);
	};
	const onReplySubmit = async () => {
		if (replyMessage.length < 10 || replyMessage.length > 500) {
			alert('댓글은 10글자 이상 500글자 미만으로 작성해주세요');
		} else {
			const data = { inquery_id: inqueryDetailData.id, content: replyMessage };
			await postReply(data).then((res) => {
				setReplyMessage((prev) => '');
				setReplyList((prev) => [...prev, res.data]);
			});
		}
	};
	useEffect(() => {
		const targetId = router.query.id;
		const fetchData = async () => {
			await getMyDetailInquery(targetId).then((res) => {
				const { reply_list, inquery } = res.data;
				setInqueryDetailData(inquery);
				setModifiedInquery(inquery);
				setReplyList(reply_list);
			});
		};
		fetchData();
	}, []);
	return (
		<div className="mt-5 max-h-[80vh] overflow-y-auto">
			{inqueryDetailData ? (
				<div className="flex flex-col">
					<div className="flex bg-sky-800 rounded-md">
						<div
							className="bg-sky-900 rounded-md w-1/6 flex items-center justify-center"
							onClick={() => {
								router.push('/bulletinBoard');
							}}
						>
							뒤로
						</div>
						<div className="p-1 w-3/6 text-center text-2xl">
							{inqueryDetailData.title}
						</div>
						<div className="w-2/6 flex justify-end items-center pr-2 text-sm ">
							{format(parseISO(inqueryDetailData.created_at), 'do MMM yy')}
						</div>
					</div>
					{isEditMode === false ? (
						<>
							<div className="mt-2 bg-stone-800 text-2xl h-[40vh] max-h-[50vh] overflow-y-auto p-1">
								{inqueryDetailData.content}
							</div>
							<button
								className="flex items-center justify-center w-full bg-sky-700 rounded-md my-2"
								onClick={(e) => {
									setIsEditMode(true);
								}}
							>
								수정
							</button>
						</>
					) : (
						<>
							<textarea
								name="content"
								value={modifiedInquery.content}
								className="bg-stone-700 mt-2 h-[40vh] max-h-[50vh] overflow-y-auto"
								onChange={(e) => {
									setModifiedInquery((prev) => ({
										...prev,
										[e.target.name]: e.target.value,
									}));
								}}
							/>
							<div className="flex">
								<button
									className="flex items-center justify-center w-full bg-sky-700 rounded-md my-2 w-1/2"
									onClick={async (e) => {
										await putInquery(modifiedInquery.id, {
											content: modifiedInquery.content,
										}).then((res) => {
											setInqueryDetailData((prev) => ({ ...res.data }));
										});
										setIsEditMode(false);
									}}
								>
									제출
								</button>
								<button
									className="flex items-center justify-center w-full bg-amber-700 rounded-md my-2 w-1/2"
									onClick={(e) => {
										setIsEditMode(false);
										setModifiedInquery((prev) => ({
											...prev,
											content: inqueryDetailData.content,
										}));
									}}
								>
									취소
								</button>
							</div>
						</>
					)}
				</div>
			) : null}

			<div>
				<div className="p-2 flex flex-col border-t-2">
					<label htmlFor="reply" className="mb-2">
						댓글 작성
					</label>
					<textarea
						id="reply"
						className="bg-stone-700 h-[15vh]"
						name="reply"
						value={replyMessage}
						onChange={onReplyChange}
						placeholder="댓글 입력하시겠습니까?"
					/>
					<div
						className="bg-lime-700 text-center p-1 mt-2"
						onClick={onReplySubmit}
					>
						작성 완료
					</div>
				</div>
			</div>
			<div>
				{replyList.map((el) => (
					<Reply data={el} setReplyList={setReplyList} key={`reply-${el.id}`} />
				))}
			</div>
		</div>
	);
}
