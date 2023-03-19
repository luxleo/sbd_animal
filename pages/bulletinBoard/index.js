import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

import { format, parseISO } from 'date-fns';

import {
	getMyInquery,
	deleteInqueries,
} from '../../utils/fetch/bulletinBoard/inquery';
import useAuthStore from '../../stores/authentication/useAuthStore';

const show10CharTitle = (title) => {
	if (title.length > 10) {
		return title.substring(0, 9);
	} else {
		return title;
	}
};

const stateLabelColor = (label) => {
	if (label === '미응답') {
		return 'text-red-500';
	} else if (label === '응답') {
		return 'text-lime-600';
	} else {
		return 'text-amber-600';
	}
};

export default function BulletinBoard() {
	const { setUpdateCount } = useAuthStore();
	const [inqueries, setInqueries] = useState([]);
	const [deleteIdList, setDeleteIdList] = useState([]);
	const inqueryContainerRef = useRef(null);
	const onCheckedHandler = (e) => {
		if (e.target.checked) {
			setDeleteIdList((prev) => [...prev, e.target.value]);
		} else {
			setDeleteIdList((prev) => prev.filter((el) => el !== e.target.value));
		}
	};
	const onInqueryDelete = async () => {
		await deleteInqueries(deleteIdList).then((res) => {
			setInqueries((prev) =>
				prev.filter((el) => !deleteIdList.includes(String(el.id)))
			);
		});
		setDeleteIdList([]);
		return;
	};
	/**
	 * useRef 이용하여 parent지정후에
	 * parent DOM에 접근하여 getElementsBytagName으로 child nodes를 얻고
	 * 순회하며 checked해제
	 */
	const onDeleteCancle = () => {
		const targetInputs =
			inqueryContainerRef.current.getElementsByTagName('input');
		for (const input of targetInputs) {
			if (input.checked) {
				input.checked = false;
			}
		}
		setDeleteIdList([]);
		return;
	};
	useEffect(() => {
		const fetchData = async () => {
			const res = await getMyInquery();
			return res;
		};
		fetchData()
			.then((res) => {
				setInqueries(res.data);
			})
			.catch(() => {
				setUpdateCount();
			});
	}, []);
	return (
		<div className="mt-6">
			<div className="flex rounded-md p-1 bg-sky-800">
				<div className="w-3/6 text-sm">제목</div>
				<div className="w-1/6 text-sm text-center">응답상태</div>
				<div className="w-2/6 text-sm text-center">날짜</div>
			</div>
			<div className="flex flex-col mb-3" ref={inqueryContainerRef}>
				{inqueries?.map((el) => (
					<div className="flex border-b p-2 " key={`inquery-${el.id}`}>
						<div className="w-1/12">
							<input
								type="checkbox"
								className="w-5 h-5 appearance-none bg-gray-700 checked:bg-amber-700 checked:text-white"
								onChange={onCheckedHandler}
								value={el.id}
								name="delete-signal-checkbox"
							/>
						</div>
						<Link href={`/bulletinBoard/${el.id}`} className="flex w-full">
							<div className="w-6/12">{show10CharTitle(el.title)}</div>
							<div
								className={`w-1/6 text-sm flex justify-center items-center ${stateLabelColor(
									el.state_label
								)}`}
							>
								{el.state_label}
							</div>
							<div className="w-2/6 text-sm flex justify-center items-center">
								{format(parseISO(el.created_at), 'do MMM yy')}
							</div>
						</Link>
					</div>
				))}
			</div>
			{deleteIdList.length == 0 ? (
				<Link href="/bulletinBoard/postInquery">
					<div className="bg-lime-600 rounded-md text-center ">문의하기</div>
				</Link>
			) : (
				<div className="flex">
					<div
						className="w-1/2 flex justify-center items-center bg-red-700 rounded-md"
						onClick={onInqueryDelete}
					>
						선택삭제
					</div>
					<div
						className="w-1/2 flex justify-center items-center bg-gray-600 rounded-md"
						onClick={onDeleteCancle}
					>
						선택취소
					</div>
				</div>
			)}
		</div>
	);
}
