import Image from 'next/image';
import { useState, useEffect } from 'react';

import wolfPic from '../../../../public/rank_avatars/avatar_wolf.png';

export default function HistoryCard({ log, pic }) {
	const [logData, setLogData] = useState(log);
	const [rankPhoto, setRankPhoto] = useState(wolfPic);

	useEffect(() => {
		if (log.percentile) {
			setRankPhoto(pic);
		}
		setLogData(log);
	}, []);
	return (
		<div className="pt-2">
			<div className="flex flex-col rounded-md bg-stone-700">
				<div className="flex items-center mb-2 border-b-2 border-stone-500">
					<div className="w-1/6">
						{log.percentile ? (
							<div className="w-14 h-14 relative mx-auto">
								<Image
									src={rankPhoto}
									fill
									style={{ objectFit: 'contain' }}
									sizes="(max-width: 768px) 100vw"
									alt="Rank Avatar"
									priority
								/>
							</div>
						) : null}
					</div>
					<div className="py-2 align-center w-3/6 text-start text-2xl">
						{logData.workout_type.name}
					</div>
					<div className="w-2/6 align-center text-end pr-4 text-md">
						{logData.created_at}
					</div>
				</div>
				<div className="flex pb-2 mb-2 border-b-2 border-stone-500 text-sm">
					<div className="w-1/4 flex-col px-2">
						<div className="text-center">1RM</div>
						<div className="text-center">{logData.max_1rm} kg</div>
					</div>
					<div className="w-1/4 flex-col px-2">
						<div className="text-center">세트수</div>
						<div className="text-center">{logData.num_sets}</div>
					</div>
					<div className="w-1/4 flex-col px-2">
						<div className="text-center">총 칼로리</div>
						<div className="text-center">{logData.total_cal} kcal</div>
					</div>
					<div className="w-1/4 flex-col px-2">
						<div className="text-center">총 무게</div>
						<div className="text-center">{logData.total_lift} kg</div>
					</div>
				</div>
				<div className="flex pb-2">
					{logData.percentile ? (
						<>
							<div className="w-1/4 px-2">{logData.percentile}</div>
							<div className="w-3/4 flex-col px-2">
								<div className="text-amber-700">
									<input
										type="range"
										min="0"
										max="100"
										value={logData.percentile}
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
							</div>
						</>
					) : null}
				</div>
			</div>
		</div>
	);
}
