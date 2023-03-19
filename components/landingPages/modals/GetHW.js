import { useState } from 'react';

export default function GetHW({
	fn,
	userInfo,
	updateUserInfo,
	isError,
	setIsError,
	isGoodToGo,
	setIsGoodToGo,
}) {
	const [isEffect, setIsEffect] = useState(false);
	const offCurModal = fn; // 모든 조건 만족시 해당 컴포넌트 종료한다
	const userInfo_from_parent = userInfo; // weight,height 채운 userinfo업데이트한다
	const addHeightWeight = updateUserInfo;
	const error_state_from_parent = isError; // error modal 뛰울 조건
	const pop_error_modal = setIsError;
	const launchFlag = isGoodToGo;
	const setLaunch = setIsGoodToGo;
	const onClick = () => {
		setIsEffect(!isEffect);
		const height = document.getElementById('height').value;
		const weight = document.getElementById('weight').value;
		const validateHeight = (val) => /^[1-2]{1}[0-9]{2}$/i.test(val);
		const validateWeight = (val) => {
			const cond1 = /^([1-2]{1})[0-9]{2}$/i.test(val);
			const cond1_1 = /^([1-2]{1})[0-9]{2}\.[0-9]{1}?$/i.test(val);
			const cond2 = /^([3-9]{1})[0-9]{1}$/i.test(val);
			const cond2_1 = /^([3-9]{1})[0-9]{1}\.[0-9]{1}?$/i.test(val);
			const res = cond1 || cond1_1 || cond2 || cond2_1;
			return res;
		};
		// /(^[1-2]{1}[0-9]{2}\.?[0-9]{1}$|^[1-9]{1}[0-9]{1}\.?[0-9]{1}$)/i.test(
		// 	val
		// );
		if (!validateHeight(height)) {
			pop_error_modal({
				...error_state_from_parent,
				error_msg: 'height must be integer at least 100 and less than 300',
				error_bool: true,
			});
			return;
		} else if (!validateWeight(weight)) {
			pop_error_modal({
				...error_state_from_parent,
				error_msg:
					'weight must be float at least 30 and less than 300, only one decimal',
				error_bool: true,
			});
			return;
		} else {
			addHeightWeight({
				...userInfo_from_parent,
				height: parseInt(height),
				weight: parseFloat(weight),
			});
			offCurModal(false);
			setLaunch((prev) => !prev);
		}
	};
	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-25
        backdrop-blur-sm flex justify-center items-center"
		>
			<div className="w-72 bg-stone-800 shadow-md rounded px-8 py-3 mb-2">
				<h1 className="text-xl mb-2">For calculating energy</h1>
				<div className="flex flex-row w-full mb-2">
					<input
						className="text-base basis-2/3 shadow bg-stone-800  appearance-none border rounded flex-2 py-1 px-3 text-gray-700 leading-tight focus:ring-2 focus:ring-amber-300 focus:outline-none mr-1"
						id="height"
						type="text"
						placeholder="height"
					/>
					<div className="basis-1/3 text-amber-500 text-center">cm</div>
				</div>
				<div className="flex flex-row w-full">
					<input
						className="text-base basis-2/3 shadow bg-stone-800 appearance-none border rounded flex-2 py-1 px-3 text-gray-700 leading-tight focus:ring-2 focus:ring-amber-300 focus:outline-none mr-1"
						id="weight"
						type="text"
						placeholder="weight"
					/>
					<div className="basis-1/3 text-amber-500 text-center">kg</div>
				</div>
				<div className="flex justify-center items-center mt-4">
					<div
						className={`w-16 h-16 rounded-full flex justify-center items-center bg-gradient-to-br from-amber-800 to-orange-300 ${
							isEffect
								? 'shadow-2xl shadow-rose-400 p-0.5 bg-gradient-to-br from-amber-400 to-orange-500'
								: 'p-0.5'
						}`}
						onClick={() => onClick()}
					>
						<div className="flex flex-col justify-center content-center bg-stone-800 w-16 h-16 rounded-full text-center">
							<span className="text-xs inline-block">start </span>
							<hr className={`${isEffect ? 'border-amber-600' : ''}`} />
							<span className="text-xs">engine </span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
