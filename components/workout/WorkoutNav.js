import Image from 'next/image';
import { useState } from 'react';

import useWorkoutStore from '../../stores/workout/useWorkoutStore';
import WorkoutChoice from './modal/WorkoutChoice';

export default function WorkoutNav() {
	const { getWorkoutGroup, getCurWorkoutState, curWorkoutState } =
		useWorkoutStore();
	const pics = [
		{ pic: '/workout_avatar/squat.PNG', name: 'squatGroup' },
		{ pic: '/workout_avatar/benchpress.PNG', name: 'benchGroup' },
		{ pic: '/workout_avatar/deadlift.PNG', name: 'deadliftGroup' },
	];
	const [isModal, setIsModal] = useState(false);
	const [choiceData, setChoiceData] = useState('');
	const WorkoutGroups = getWorkoutGroup();
	/**
	 * 로드된 운동종류 중 선택된 그룹을 모달에 전달하고
	 * 모달을 띄운다.
	 * @param {String} val
	 */
	const onClick = (val) => {
		const res = WorkoutGroups[`${val}`];
		setChoiceData(res);
		setIsModal(true);
	};

	return (
		<div>
			<div className="h-20 rounded-full bg-gradient-to-r from-orange-700 via-red-500 to-amber-600 p-0.5 mt-3 md:h-14 md:w-5/6 md:mx-auto">
				<div className="flex rounded-full w-full h-full bg-stone-900 justify-around items-center">
					{pics.map((el, idx) => (
						<div
							key={idx}
							className="w-14 h-14 z-0 relative md:w-12 md:h-12"
							onClick={() => onClick(el.name)}
						>
							<Image
								src={el.pic}
								fill
								sizes="(max-width: 1200px) 8vw"
								className="rounded-full z-0"
								alt={el.name}
								priority
							/>
						</div>
					))}
				</div>
			</div>
			{isModal ? (
				<WorkoutChoice data={choiceData} setIsModal={setIsModal} />
			) : null}
		</div>
	);
}
