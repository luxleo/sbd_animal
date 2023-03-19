import { useEffect } from 'react';
import { useRouter } from 'next/router';

import useWorkoutStore from '../../stores/workout/useWorkoutStore';
import { getAllWorkoutType } from '../../utils/fetch/workout/common';
import WorkoutOrigin from '../../components/workout/WorkoutOrigin';

export default function Workout() {
	const {
		setBenchGroup,
		setSquatGroup,
		setDeadliftGroup,
		setIsFetched,
		WorkoutGroups,
	} = useWorkoutStore();
	/**
	 * WorkoutType 받아온 후 운동별로 등록
	 * @todo 맨몸운동이면 체중대비 운동무게 메시지로 띄우기
	 */
	const router = useRouter();
	const onInitialLoad = async () => {
		const benchArr = [];
		const squatArr = [];
		const deadliftArr = [];
		await getAllWorkoutType()
			.then((res) => {
				res.forEach((el) => {
					if (el.category === 'b') {
						benchArr.push(el);
					} else if (el.category === 's') {
						squatArr.push(el);
					} else {
						deadliftArr.push(el);
					}
				});
				setBenchGroup(benchArr);
				setSquatGroup(squatArr);
				setDeadliftGroup(deadliftArr);
				setIsFetched();
			})
			.catch((res) => {
				router.push('/');
				return;
			});
	};
	useEffect(() => {
		if (!WorkoutGroups.isFetched) {
			onInitialLoad();
		}
	}, []);
	return (
		<div className="flex flex-col">
			<WorkoutOrigin />
		</div>
	);
}
