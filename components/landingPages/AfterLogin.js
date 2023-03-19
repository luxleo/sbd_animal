import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

import useWorkoutStore from '../../stores/workout/useWorkoutStore';
import useTensorflowStore from '../../stores/mymodel/useTensorflowStore';
import useUserStore from '../../stores/authentication/useUserStore';
import { getAllWorkoutType } from '../../utils/fetch/workout/common';

import {
	calc_calories,
	calc_one_rep_max,
} from '../../utils/calculate/RepCalculation';
import {
	normalizeTestData,
	normalizePredictionResult,
} from '../../utils/model_utils/preprocessIO';

import CalculatorResult from '../display/calculatorResult/CalculatorResult';

export default function AfterLogin() {
	//load model
	const { getHawkEye } = useTensorflowStore();
	const [myModel, setMyModel] = useState(null);

	//load signed in user information
	const { getUser } = useUserStore();
	const user = getUser();

	//load workout information
	const {
		setBenchGroup,
		setSquatGroup,
		setDeadliftGroup,
		setIsFetched,
		WorkoutGroups,
		getSpecificWorkoutGroup,
	} = useWorkoutStore();
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

	const [targetWorkout, setTargetWorkout] = useState({
		workoutName: 'squat',
		workoutRange: '0.35',
		height: user.height,
		bodyWeight: user.weight,
		workoutWeight: 20,
		reps: 1,
	});
	const [resultDisplay, setResultDisplay] = useState({
		calorie: 0,
		oneRM: 0,
		percentile: 0,
	});
	const onRadioChange = (e) => {
		const selected_workout = e.target.value;
		switch (true) {
			case selected_workout === 'squat':
				const squat = getSpecificWorkoutGroup(selected_workout)[0];
				setTargetWorkout((prev) => ({
					...prev,
					workoutName: squat.name,
					workoutRange: squat.workout_distance,
				}));
				break;
			case selected_workout === 'bench press':
				const benchPress = getSpecificWorkoutGroup(selected_workout)[0];
				setTargetWorkout((prev) => ({
					...prev,
					workoutName: benchPress.name,
					workoutRange: benchPress.workout_distance,
				}));
				break;
			case selected_workout === 'deadlift':
				const deaflift = getSpecificWorkoutGroup(selected_workout)[0];
				setTargetWorkout((prev) => ({
					...prev,
					workoutName: deaflift.name,
					workoutRange: deaflift.workout_distance,
				}));
				break;
		}
	};
	const onInputValChange = (e) => {
		setTargetWorkout((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};
	const onSubmitHandler = async () => {
		const cur_one_rm = calc_one_rep_max(
			Number(targetWorkout.reps),
			Number(targetWorkout.workoutWeight)
		);
		const rawInput = normalizeTestData([
			Number(targetWorkout.bodyWeight),
			cur_one_rm,
			targetWorkout.workoutName,
		]);
		const tensorInput = tf.tensor2d([rawInput]);
		const preds = await myModel.predict(tensorInput).array();
		const percentile = normalizePredictionResult(preds[0][0]);

		tf.dispose(tensorInput);
		tf.dispose(preds);

		setResultDisplay((prev) => ({
			...prev,
			calorie: calc_calories(
				Number(targetWorkout.height),
				Number(targetWorkout.workoutRange),
				Number(targetWorkout.workoutWeight),
				Number(targetWorkout.reps)
			),
			oneRM: cur_one_rm,
			percentile: percentile,
		}));
	};
	useEffect(() => {
		if (!myModel) {
			setMyModel(getHawkEye());
		}
		if (!WorkoutGroups.isFetched) {
			onInitialLoad();
		}
		return () => {
			setMyModel(null);
		};
	}, []);
	return (
		<div className="flex justify-center w-full">
			<div className="flex flex-col pt-5 w-full">
				<div>랭크 측정기</div>
				<div className="flex w-full justify-between">
					<div>
						<label htmlFor="workout_squat">Squat</label>
						<input
							type="radio"
							name="targetWorkout"
							value="squat"
							id="workout_squat"
							checked={targetWorkout.workoutName === 'squat'}
							onChange={onRadioChange}
						/>
					</div>
					<div>
						<label htmlFor="workout_bench_press">Bench press</label>
						<input
							type="radio"
							name="targetWorkout"
							value="bench press"
							id="workout_bench_press"
							checked={targetWorkout.workoutName === 'bench press'}
							onChange={onRadioChange}
						/>
					</div>
					<div>
						<label htmlFor="workout_deadlift">Deadlift</label>
						<input
							type="radio"
							name="targetWorkout"
							value="deadlift"
							id="workout_deadlift"
							checked={targetWorkout.workoutName === 'deadlift'}
							onChange={onRadioChange}
						/>
					</div>
				</div>
				<div className="flex my-3">
					<div className="w-1/2">
						<label htmlFor="workoutWeight">운동무게</label>
						<input
							className="bg-stone-500 w-1/3 ml-2"
							type="text"
							name="workoutWeight"
							id="workoutWeight"
							pattern="^([2-9]{1}[0-9]{1})|([1-3]{1}[0-9]{2})|([2-9]{1}[0-9]{1}\.[0-9]{0,1})|([1-3]{1}[0-9]{2}\.[0-9]{0,1})$"
							value={targetWorkout.workoutWeight}
							onChange={onInputValChange}
						/>
						kg
						<span>
							운동 무게는 20kg 이상 400kg 미만의 자연수 혹은 소숫점 한자리의
							실수입니다.
						</span>
					</div>
					<div className="w-1/2">
						<label htmlFor="reps">반복횟수</label>
						<input
							className="bg-stone-500 w-1/3 ml-2"
							type="text"
							name="reps"
							id="reps"
							pattern="^([1-9]{1})|([1-9]{1}[0-9]{1})$"
							value={targetWorkout.reps}
							onChange={onInputValChange}
						/>
						<span>반복 횟수는 100회 이하여야 합니다</span>
					</div>
				</div>
				<div className="flex">
					<div className="w-1/2">
						<label htmlFor="height">키</label>
						<input
							className="bg-stone-500 w-1/2 ml-2"
							type="text"
							name="height"
							id="height"
							pattern="^([1-2]{1}[0-9]{2})|([1-2]{1}[0-9]{2}\.[0-9]{0,1})$"
							value={targetWorkout.height}
							onChange={onInputValChange}
						/>
						cm
						<span>키는 100~300cm</span>
					</div>
					<div className="w-1/2">
						<label htmlFor="bodyWeight">체중</label>
						<input
							className="bg-stone-500 w-1/2 ml-2"
							type="text"
							name="bodyWeight"
							id="bodyWeight"
							pattern="^([4-9]{1}[0-9]{1})|([4-9]{1}[0-9]{1}\.[0-9]{0,1})|([1-2]{1}[0-9]{2})|([1-2]{1}[0-9]{2}\.[0-9]{0,1})$"
							value={targetWorkout.bodyWeight}
							onChange={onInputValChange}
						/>
						<span>몸무게는 40~300kg</span>
					</div>
				</div>
				<div
					className="rounded-md bg-lime-600 text-center p-1 mt-2"
					onClick={onSubmitHandler}
				>
					계산
				</div>
				<CalculatorResult
					resultDisplay={resultDisplay}
					targetWorkout={targetWorkout}
				/>
			</div>

			<style jsx>
				{`
					span {
						display: none;
					}
					input:invalid ~ span {
						display: block;
						font-size: 12px;
						padding: 3px;
						color: red;
					}
				`}
			</style>
		</div>
	);
}
