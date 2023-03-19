import { useCallback, useEffect, useState } from 'react';

import useUserStore from '../../stores/authentication/useUserStore';
import useWorkoutStore from '../../stores/workout/useWorkoutStore';
import WorkoutNav from './WorkoutNav';
import WorkoutLog from './WorkoutLog';
import WorkoutHead from './WorkoutHead';
import HistoryDetail from '../display/history/Detail/HistoryDetail';

export default function WorkoutOrigin() {
	const { getCurWorkoutState, setCurBodyWeight, curWorkoutState } =
		useWorkoutStore();
	const { getUser, setUserWeight } = useUserStore();
	const user = getUser();
	const [isHistoryDetail, setIsHistoryDetail] = useState({
		log: null,
		reps: null,
		isDone: false,
	});
	const checkWorkoutState = useCallback(() => {
		const res = getCurWorkoutState();
		return res;
	}, []);
	const setBodyWeight = useCallback((val) => {
		setCurBodyWeight(val);
	}, []);
	const setUserBodyWeight = useCallback((val) => {
		setUserWeight(val);
	}, []);
	useEffect(() => {
		// user 정보 가져와서 WorkoutState의 user weight 설정
		setBodyWeight(user.weight);
	}, []);
	return (
		<>
			{isHistoryDetail.isDone ? (
				<div className="flex flex-col">
					<HistoryDetail
						log={isHistoryDetail.log}
						reps={isHistoryDetail.reps}
					/>
					<button
						onClick={() =>
							setIsHistoryDetail((prev) => ({
								...prev,
								log: null,
								reps: null,
								isDone: false,
							}))
						}
						className="w-full rounded-md border-amber-600 border-2 mt-2 text-amber-500"
					>
						로그 닫기
					</button>
				</div>
			) : (
				<div>
					<WorkoutNav />
					<WorkoutHead getCurWorkoutState={checkWorkoutState} />
					{curWorkoutState.name !== 'Start Engine' ? (
						<WorkoutLog
							getCurWorkoutState={checkWorkoutState}
							user={user}
							setIsHistoryDetail={setIsHistoryDetail}
							setUserBodyWeight={setUserBodyWeight}
						/>
					) : null}
					<button onClick={checkWorkoutState}>check state</button>
				</div>
			)}
		</>
	);
}
