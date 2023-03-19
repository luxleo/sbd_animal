import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { postMyInquery } from '../../utils/fetch/bulletinBoard/inquery';
import useAuthStore from '../../stores/authentication/useAuthStore';

export default function PostInquery() {
	const [payload, setPayload] = useState({
		title: '',
		content: '',
	});
	const { setUpdateCount } = useAuthStore();
	const router = useRouter();
	const onInputChange = (e) => {
		setPayload((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};
	const onClickHandler = () => {
		if (payload.title.length > 3 && payload.content !== '') {
			postMyInquery(payload)
				.then(() => {
					router.push('/bulletinBoard');
				})
				.catch(() => {
					setUpdateCount();
				});
		} else {
			alert('문의 작성을 마쳐주세요');
		}
	};
	return (
		<div className="pt-10 ">
			<div className="flex w-full mb-3 border-b-2 border-white p-2">
				<Link href="/bulletinBoard/">
					<div className="w-1/6 text-2xl text-center">{'<'}</div>
				</Link>
				<div className="w-4/6 text-2xl text-center">문의작성</div>
				<div className="w-1/6"></div>
			</div>
			<div className="flex flex-col h-[100vh]">
				<div className="mb-3">
					<label htmlFor="input_title" className="mr-1">
						제목:
					</label>
					<input
						type="text"
						placeholder="제목.."
						id="input_title"
						name="title"
						onChange={onInputChange}
						className="bg-stone-700"
						minLength={3}
						maxLength={50}
						value={payload.title}
					/>
					<span>제목은 3글자 이상 50글자 이하로 작성해주세요.</span>
				</div>
				<div className="flex flex-col">
					<label htmlFor="input_content">내용</label>
					<textarea
						id="input_content"
						name="content"
						onChange={onInputChange}
						className="bg-stone-700 h-[30vh]"
						placeholder="문의내용을 입력하세요"
						value={payload.content}
					/>
				</div>
				<div
					className="p-1 mt-3 rounded-md bg-lime-700 text-center"
					onClick={onClickHandler}
				>
					문의하기
				</div>
			</div>
			<style jsx>
				{`
					span {
						display: none;
					}
					input:invalid ~ span {
						display: block;
						color: red;
						padding: 3px;
						font-size: 12px;
					}
				`}
			</style>
		</div>
	);
}
