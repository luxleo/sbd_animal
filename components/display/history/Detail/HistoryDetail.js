import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import HistoryRep from './HistoryRep';

import { deleteLog } from '../../../../utils/fetch/workout/log';

export default function HistoryDetail({ log, reps }) {
	const [rankPhoto, setRankPhoto] = useState('/rank_avatars/avatar_wolf.png');

	const getRankImage = (percentile) => {
		const numPercentile = Number(percentile);
		switch (true) {
			case numPercentile < 5:
				setRankPhoto('/rank_avatars/avatar_rat.png');
				break;
			case numPercentile < 20:
				setRankPhoto('/rank_avatars/avatar_rabbit.png');
				break;
			case numPercentile < 50:
				setRankPhoto('/rank_avatars/avatar_fox.png');
				break;
			case numPercentile < 80:
				setRankPhoto('/rank_avatars/avatar_wolf.png');
				break;
			case numPercentile < 95:
				setRankPhoto('/rank_avatars/avatar_tiger.png');
				break;
			case numPercentile < 101:
				setRankPhoto('/rank_avatars/avatar_dragon.png');
				break;
		}
	};
	const router = useRouter();
	/**
	 * 로그 삭제후 history로 redirect
	 * @param {Number} id
	 */
	const deleteLogHandler = async (id) => {
		await deleteLog(id);
		router.push('/history');
	};

	useEffect(() => {
		if (log?.percentile) {
			getRankImage(log?.percentile);
		}
	}, []);
	return (
		<div className="pt-2">
			<div className="flex flex-col rounded-md bg-stone-700">
				<div className="flex items-center pb-2 mb-2 border-b-2 border-stone-500">
					<div className="pt-3 align-center w-2/3 text-center text-2xl">
						{log?.workout_type.name}
					</div>
					<div className="w-1/3 align-center text-center text-md">
						{log?.created_at}
					</div>
				</div>
				<div className="flex pb-2 mb-2 border-b-2 border-stone-500">
					<div className="w-1/3 flex-col px-2">
						<div className="text-center">1RM</div>
						<div className="text-center">{log?.max_1rm} kg</div>
					</div>
					<div className="w-1/3 flex-col px-2">
						<div className="text-center">총 칼로리</div>
						<div className="text-center">{log?.total_cal} kcal</div>
					</div>
					<div className="w-1/3 flex-col px-2">
						<div className="text-center">총 무게</div>
						<div className="text-center">{log?.total_lift} kg</div>
					</div>
				</div>
				{log?.percentile ? (
					<>
						<div className="flex pb-2">
							<div className="w-1/4 flex-col px-2">
								<div className="text-center">랭크</div>
								<div className="w-12 h-12 relative mx-auto">
									<Image
										src={rankPhoto}
										fill
										sizes="(max-width: 768px) 100vw"
										className="rounded-full"
										alt="Rank Avatar"
										priority
									/>
								</div>
							</div>
							<div className="w-3/4 flex-col px-2">
								<div className="text-center">체중별 백분위</div>
								<div className="text-amber-700">
									<input
										type="range"
										min="0"
										max="100"
										value={log?.percentile}
										readOnly
										className="w-full bg-stone-600 rounded-lg accent-amber-600"
										list="ranks"
									/>
									<datalist id="ranks" className="flex">
										<option
											value="5"
											label="5%"
											className="w-[8%] text-end text-xs"
										></option>
										<option
											value="20"
											label="20%"
											className="w-[15%] text-end text-xs"
										></option>
										<option
											value="50"
											label="50%"
											className="w-[28%] text-end text-xs"
										></option>
										<option
											value="80"
											label="80%"
											className="w-[29%] text-end text-xs"
										></option>
										<option
											value="95"
											label="95%"
											className="w-[14%] text-end text-xs"
										></option>
									</datalist>
								</div>
								<div>{`${log?.body_weight}kg중 ${log?.percentile}% 보다 강합니다`}</div>
							</div>
						</div>
					</>
				) : null}
			</div>
			<div className="mt-2">
				<div className="flex w-full h-8 border-2 border-stone-700">
					<div className="w-1/5 h-full text-center border-r-2 border-stone-700 ">
						<span className="inline-block align-middle">세트수</span>
					</div>
					<div className="w-1/5 h-full text-center border-r-2 border-stone-700 text-xs">
						<span className="inline-block align-middle">운동무게(kg)</span>
					</div>
					<div className="w-1/5 h-full text-center  border-r-2 border-stone-700">
						<span className="inline-block align-middle">reps</span>
					</div>
					<div className="w-1/5 h-full text-center  border-r-2 border-stone-700">
						<span className="inline-block align-middle">kcal</span>
					</div>
					<div className="w-1/5 h-full text-center">
						<span className="inline-block align-middle">1RM</span>
					</div>
				</div>
				<div className="max-h-80 overflow-y-auto">
					{reps?.map((el, idx) => (
						<HistoryRep repData={el} key={idx} />
					))}
				</div>
			</div>
			<div className="pt-2">
				<button
					className="bg-none w-full t h-8 text-center rounded-md border-2 border-rose-800 text-rose-600"
					onClick={() => deleteLogHandler(log?.id)}
				>
					로그 삭제
				</button>
			</div>
		</div>
	);
}
