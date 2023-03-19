import { useEffect, useState } from 'react';

import { logForDashboard } from '../../utils/fetch/workout/log';
import Graph from '../../components/dashboard/graph';

export default function DashBoardIndex() {
	const [SBDLogList, setSBDLogList] = useState({
		squat: {
			default: [],
			oneM: [],
			threeM: [],
			sixM: [],
			isFetched: { default: false, oneM: false, threeM: false, sixM: false },
		},
		'bench press': {
			default: [],
			oneM: [],
			threeM: [],
			sixM: [],
			isFetched: { default: false, oneM: false, threeM: false, sixM: false },
		},
		deadlift: {
			default: [],
			oneM: [],
			threeM: [],
			sixM: [],
			isFetched: { default: false, oneM: false, threeM: false, sixM: false },
		},
		isFetched: false,
	});
	const [selectedWorkout, setSelectedWorkout] = useState({
		name: 'squat',
		field: 'percentile',
		scope_range: 'default',
		data: [],
	});
	const initialSquatLogLoad = async (workout_name) => {
		const res = await logForDashboard(workout_name);
		res.sort((a, b) => a.id - b.id);
		setSBDLogList((prev) => {
			const newState = { ...prev };
			newState[workout_name].default = res;
			newState[workout_name].isFetched.default = true;
			newState.isFetched = true;
			return newState;
		});
		setSelectedWorkout((prev) => ({
			...prev,
			name: workout_name,
			scope_range: 'default',
			data: res,
		}));
	};
	/**
	 * dashboard 페이지 최상단의 select 태그로 선택한 운동의 종류(squat,bench press,deadlift)를
	 * SBDLogList state를 변경하여 그래프로 그린다.
	 * @param {*} e
	 */
	const onSelectValue = (e) => {
		const selected_workout = e.target.value;
		if (!SBDLogList[selected_workout].isFetched.default) {
			initialSquatLogLoad(selected_workout);
			return;
		} else {
			setSelectedWorkout((prev) => ({
				...prev,
				name: selected_workout,
				data: SBDLogList[selected_workout].default,
				scope_range: 'default',
			}));
			return;
		}
		// switch (true) {
		// 	case selected_workout === 'squat':
		// 		if (!SBDLogList[selected_workout].isFetched.default) {
		//             initialSquatLogLoad(selected_workout);
		//             break;
		// 		}else{
		//             setSelectedWorkout((prev) => ({
		//                 ...prev,
		//                 name: selected_workout,
		//                 data: SBDLogList[selected_workout].default,
		//             }));
		//             break;
		//         }

		// 	case selected_workout === 'bench press':
		// 		setSelectedWorkout((prev) => ({
		// 			...prev,
		// 			name: selected_workout,
		// 			data: SBDLogList.benchLogs,
		// 		}));
		// 		break;
		// 	case selected_workout === 'deadlift':
		// 		setSelectedWorkout((prev) => ({
		// 			...prev,
		// 			name: selected_workout,
		// 			data: SBDLogList.deadliftLogs,
		// 		}));
		// 		break;
		// }
	};
	const onRadioValueChanged = (e) => {
		const selectedField = e.target.value;
		setSelectedWorkout((prev) => ({
			...prev,
			field: selectedField,
		}));
	};
	const onScopeRangeChangeHelper1 = async (workout_name, data) => {
		const lastlog = SBDLogList[workout_name][data.prevRange][0];
		const lastday = lastlog.created_at;
		const res = await logForDashboard(workout_name, data.scope_range, lastday);
		res.sort((a, b) => a.id - b.id);
		setSBDLogList((prev) => {
			const newState = { ...prev };
			newState[workout_name][data.curRange] = res;
			newState[workout_name].isFetched[data.curRange] = true;
			return newState;
		});
		return res;
	};
	const onScopeRangeChangeHelper2 = (data) => {
		const res_data = data.sort((a, b) => a.id - b.id);
		setSelectedWorkout((prev) => ({
			...prev,
			data: res_data,
		}));
	};
	const onScopeRangeChange = async (month) => {
		const cur_workout = selectedWorkout.name;
		switch (true) {
			case month === 'latest':
				const new_data = SBDLogList[cur_workout].default;
				onScopeRangeChangeHelper2(new_data);
				break;
			case month === '1':
				if (!SBDLogList[cur_workout].isFetched['oneM']) {
					const input_data = {
						prevRange: 'default',
						curRange: 'oneM',
						scope_range: '1',
					};
					const res = await onScopeRangeChangeHelper1(cur_workout, input_data);
					const new_data = res.concat(SBDLogList[cur_workout]['default']);
					onScopeRangeChangeHelper2(new_data);
					break;
				} else {
					const new_data = SBDLogList[cur_workout].oneM.concat(
						SBDLogList[cur_workout].default
					);
					onScopeRangeChangeHelper2(new_data);
					break;
				}
			case month === '3':
				if (!SBDLogList[cur_workout].isFetched['threeM']) {
					const input_data = {
						prevRange: 'oneM',
						curRange: 'threeM',
						scope_range: '3',
					};
					const res = await onScopeRangeChangeHelper1(cur_workout, input_data);
					const new_data = res.concat(
						SBDLogList[cur_workout]['oneM'].concat(
							SBDLogList[cur_workout]['default']
						)
					);
					onScopeRangeChangeHelper2(new_data);
					break;
				} else {
					const new_data = SBDLogList[cur_workout]['threeM'].concat(
						SBDLogList[cur_workout]['oneM'].concat(
							SBDLogList[cur_workout]['default']
						)
					);
					onScopeRangeChangeHelper2(new_data);
					break;
				}
			case month === '6':
				if (!SBDLogList[cur_workout].isFetched['sixM']) {
					const input_data = {
						prevRange: 'threeM',
						curRange: 'sixM',
						scope_range: '6',
					};
					const res = await onScopeRangeChangeHelper1(cur_workout, input_data);
					const new_data = res.concat(
						SBDLogList[cur_workout]['threeM'].concat(
							SBDLogList[cur_workout]['oneM'].concat(
								SBDLogList[cur_workout]['default']
							)
						)
					);
					onScopeRangeChangeHelper2(new_data);
					break;
				} else {
					const new_data = SBDLogList[cur_workout]['sixM'].concat(
						SBDLogList[cur_workout]['threeM'].concat(
							SBDLogList[cur_workout]['oneM'].concat(
								SBDLogList[cur_workout]['default']
							)
						)
					);
					onScopeRangeChangeHelper2(new_data);
					break;
				}
		}
	};

	/**
	 * 페이지 최초로 렌더링 할 때 (혹은 다른 url에서 재접근 할때)
	 * 유저의 squat,bench press,deadlift운동 만을 조회하고
	 * id의 역순으로 정렬되도록 한다.(오래된 로그 순으로)
	 */
	const loadLogs = async () => {
		const squatList = [];
		const benchList = [];
		const deadList = [];

		const payload = await logForDashboard(
			(workout_name = selectedWorkout.name)
		);
		payload.forEach((el) => {
			const workoutName = el.workout_type.name;
			switch (true) {
				case workoutName === 'squat':
					squatList.push(el);
					break;
				case workoutName === 'bench press':
					benchList.push(el);
					break;
				case workoutName === 'deadlift':
					deadList.push(el);
					break;
			}
		});
		squatList.sort((a, b) => a.id - b.id);
		benchList.sort((a, b) => a.id - b.id);
		deadList.sort((a, b) => a.id - b.id);
		setSBDLogList((prev) => ({
			...prev,
			squatLogs: squatList,
			benchLogs: benchList,
			deadliftLogs: deadList,
			isFetched: true,
		}));
		setSelectedWorkout((prev) => ({
			...prev,
			data: squatList,
		}));
	};
	useEffect(() => {
		if (!SBDLogList.isFetched) {
			//loadLogs();
			initialSquatLogLoad('squat');
		}
	}, []);
	return (
		<div className="w-full flex-col pt-[10%]">
			<div className="flex mb-5">
				<select
					onChange={onSelectValue}
					defaultValue="squat"
					className="bg-stone-800 w-1/2"
				>
					<option value="squat">squat</option>
					<option value="bench press">bench press</option>
					<option value="deadlift">deadlift</option>
				</select>
				<div className="flex w-1/2">
					<div className="flex w-1/2 justify-center">
						<input
							type={'radio'}
							name="selectedWorkoutField"
							value={'percentile'}
							id="percentile"
							checked={selectedWorkout.field === 'percentile'}
							onChange={onRadioValueChanged}
						/>
						<label htmlFor="percentile">백분위</label>
					</div>
					<div className="flex w-1/2 justify-center">
						<input
							type={'radio'}
							name="selectedWorkoutField"
							value={'max_1rm'}
							id="max_1rm"
							checked={selectedWorkout.field === 'max_1rm'}
							onChange={onRadioValueChanged}
						/>
						<label htmlFor="percentile">1RM</label>
					</div>
				</div>
			</div>
			<div className="flex justify-center mb-2 ">
				<div
					className="bg-lime-500 mr-1 rounded-md p-1"
					onClick={() => onScopeRangeChange('latest')}
				>
					최근
				</div>
				<div
					className="bg-lime-500 mr-1 rounded-md p-1"
					onClick={() => onScopeRangeChange('1')}
				>
					1개월
				</div>
				{SBDLogList[selectedWorkout.name].isFetched['oneM'] ? (
					<div
						className="bg-lime-500 mr-1 rounded-md p-1"
						onClick={() => onScopeRangeChange('3')}
					>
						3개월
					</div>
				) : null}
				{SBDLogList[selectedWorkout.name].isFetched['threeM'] ? (
					<div
						className="bg-lime-500 mr-1 rounded-md p-1"
						onClick={() => onScopeRangeChange('6')}
					>
						6개월
					</div>
				) : null}
			</div>
			<div>
				{SBDLogList.isFetched ? (
					<Graph data={selectedWorkout.data} field={selectedWorkout.field} />
				) : null}
			</div>
		</div>
	);
}
