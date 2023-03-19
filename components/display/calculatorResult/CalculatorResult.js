import Image from 'next/image';
import { useState, useEffect } from 'react';

import mousePic from '../../../public/rank_avatars/avatar_rat.png';
import rabbitPic from '../../../public/rank_avatars/avatar_rabbit.png';
import foxPic from '../../../public/rank_avatars/avatar_fox.png';
import wolfPic from '../../../public/rank_avatars/avatar_wolf.png';
import tigerPic from '../../../public/rank_avatars/avatar_tiger.png';
import dragonPic from '../../../public/rank_avatars/avatar_dragon.png';

export default function CalculatorResult({ resultDisplay, targetWorkout }) {
	const [rankPhoto, setRankPhoto] = useState(wolfPic);

	const getRankImage = (percentile) => {
		const numPercentile = Number(percentile);
		switch (true) {
			case numPercentile < 5:
				setRankPhoto(mousePic);
				break;
			case numPercentile < 20:
				setRankPhoto(rabbitPic);
				break;
			case numPercentile < 50:
				setRankPhoto(foxPic);
				break;
			case numPercentile < 80:
				setRankPhoto(wolfPic);
				break;
			case numPercentile < 95:
				setRankPhoto(tigerPic);
				break;
			case numPercentile < 101:
				setRankPhoto(dragonPic);
				break;
		}
	};
	useEffect(() => {
		if (resultDisplay?.percentile) {
			getRankImage(resultDisplay?.percentile);
		}
	}, [resultDisplay]);
	return (
		<div className="pt-2">
			<div className="flex flex-col rounded-md bg-stone-700">
				<div className="flex justify-center text-2xl h-12 items-center pb-2 mb-2 border-b-2 border-stone-500">
					{targetWorkout?.workoutName}
				</div>
				<div className="flex border-b-2 border-stone-500 h-12">
					<div className="w-1/2 flex-col px-2">
						<div className="flex justify-center items-center text-sm">1RM</div>
						<div className="flex justify-center items-center">
							{resultDisplay?.oneRM} kg
						</div>
					</div>
					<div className="w-1/2 flex-col px-2">
						<div className="flex justify-center items-center text-sm">
							총 칼로리
						</div>
						<div className="flex justify-center items-center">
							{resultDisplay?.calorie} kcal
						</div>
					</div>
				</div>
				{resultDisplay?.percentile ? (
					<>
						<div className="flex pb-2">
							<div className="w-1/4 flex-col">
								<div className="text-center">랭크</div>
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
							</div>
							<div className="w-3/4 flex-col px-2">
								<div className="text-center">체중별 백분위</div>
								<div className="text-amber-700">
									<input
										type="range"
										min="0"
										max="100"
										value={resultDisplay?.percentile}
										readOnly
										className="w-full bg-stone-700 outline outline-0 rounded-lg accent-[#d24912]"
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
								<div>{`${targetWorkout?.bodyWeight}kg중 ${resultDisplay?.percentile}% 보다 강합니다`}</div>
							</div>
						</div>
					</>
				) : null}
			</div>
		</div>
	);
}
