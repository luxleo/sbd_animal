import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

import useWorkoutStore from '../../stores/workout/useWorkoutStore';
import useAuthStore from '../../stores/authentication/useAuthStore';
import useTensorflowStore from '../../stores/mymodel/useTensorflowStore';

import { postLog } from '../../utils/fetch/workout/log';
import {
	normalizeTestData,
	normalizePredictionResult,
} from '../../utils/model_utils/preprocessIO';

import WorkoutRep from './WorkoutRep';
import { RepWeightInputError, RepRepsInputError } from './modal/RepInputError';
const addFloatReturnFixedOne = (a, b) => {
	return Number((a + b).toFixed(1));
};

export default function WorkoutLog({
	getCurWorkoutState,
	user,
	setIsHistoryDetail,
	setUserBodyWeight,
}) {
	// props and state section
	const userHeight = user.height;
	const userWeight = user.weight;
	const { setCurBodyWeight, addRep, resetWorkoutState } = useWorkoutStore();
	const { setUpdateCount } = useAuthStore();
	const { getHawkEye } = useTensorflowStore();

	const [myModel, setMyModel] = useState(null);
	const [isWeightError, setIsWeightError] = useState(false);
	const [isRepError, setIsRepError] = useState(false);
	const [bodyWeightInput, setBodyWeightInput] = useState(userWeight);
	const [bodyweightInputMode, setBodyWeightInputMode] = useState('done');
	// fin
	// start: 완료된 rep으로 부터 log data 작성하기 위한 변수
	let WorkoutState = getCurWorkoutState();
	let doneReps = WorkoutState.reps.filter((el) => el.is_done);
	let allRepsDone =
		WorkoutState.reps.length === doneReps.length && doneReps.length !== 0;
	let total_cal = 0;
	let total_lift = 0;
	let max_1rm = 0;
	let total_reps = 0;
	doneReps.forEach((el) => {
		total_cal = addFloatReturnFixedOne(total_cal, el.calorie);
		total_lift = addFloatReturnFixedOne(total_lift, el.liftWeight);
		total_reps += 1;
		if (max_1rm < el.oneRM) {
			max_1rm = el.oneRM;
		}
	});
	// fin

	/**
	 * 기존의 rep있으면 그 정보 이용하고 없으면 새로운 rep만든다.
	 */
	const onAddRep = () => {
		const lengthOfReps = WorkoutState.reps.length;
		if (lengthOfReps) {
			const prevRepData = WorkoutState.reps[lengthOfReps - 1];
			const newRepData = {
				workout_weight: prevRepData.workout_weight,
				range: WorkoutState.range,
				reps: prevRepData.reps,
				calorie: 0,
				avg_power: 0,
				is_done: false,
				oneRM: 0,
				liftWeight: 0,
			};
			addRep(newRepData);
		} else {
			const defaultRepData = {
				workout_weight: '20',
				range: WorkoutState.range,
				reps: 5,
				calorie: 0,
				avg_power: 0,
				is_done: false,
				oneRM: 0,
				liftWeight: 0,
			};
			addRep(defaultRepData);
		}
	};
	//start: bodyWeight수정 섹션
	const bodyWeightValidator = (val) => {
		let numVal = Number(val);
		if (isNaN(numVal)) {
			return false;
		} else if (numVal <= 0 || numVal > 200) {
			return false;
		} else if (!Number.isInteger(numVal) && numVal.toFixed(1) !== val) {
			return false;
		}
		return true;
	};
	const onBodyWeightChange = () => {
		if (bodyweightInputMode === 'done') {
			setBodyWeightInputMode('edit');
		}
		// case when mode is 'edit'
		else {
			if (bodyWeightValidator(bodyWeightInput)) {
				if (bodyWeightInput !== userWeight) {
					setBodyWeightInput((prev) => Number(prev));
					setCurBodyWeight(Number(bodyWeightInput));
					setUserBodyWeight(Number(bodyWeightInput));
				}
				setBodyWeightInputMode('done');
			}
		}
	};
	const onBodyWeightInputChange = (e) => {
		setBodyWeightInput(e.target.value);
	};
	//fin
	/**
	 * percentile predictor 모델로 percentile 추가하고
	 * Done button click시 서버에 create Log한다.
	 * @todo 기존 저장된 체중과 현재 입력 체중 다르면 DB업데이트,max_power 기능 추가하기
	 */
	const onWorkoutDone = async () => {
		setUpdateCount(); // 로그인 되어있는지 확인하자.
		const payload = {
			logData: {
				workout_type: WorkoutState.workout_id,
				max_1rm: max_1rm,
				total_cal: total_cal,
				total_lift: total_lift,
				body_weight: WorkoutState.curBodyWeight,
				num_sets: WorkoutState.reps.length,
			},
			// 기존 rep에서 불필요한 필드 삭제, 필요한 필드 추가
			repData: WorkoutState.reps.map((el, idx) => {
				const { oneRM, range, is_done, liftWeight, ...newEl } = el;
				newEl.rep_order_number = idx + 1;
				return newEl;
			}),
		};
		//인공지능 model의 필드 순서는 'bodymass','liftmass','workout_name'이다.
		if (myModel) {
			const sbdList = ['squat', 'bench press', 'deadlift'];
			if (sbdList.includes(WorkoutState.name)) {
				const raw_bodymass = payload.logData.body_weight;
				const raw_oneRM = payload.logData.max_1rm;
				const raw_workout_name = WorkoutState.name;
				const raw_input = [raw_bodymass, raw_oneRM, raw_workout_name];

				const tensor_input = normalizeTestData(raw_input);
				const input_data = tf.tensor2d([tensor_input]);
				const preds = await myModel.predict(input_data).array();
				const percentile = normalizePredictionResult(preds[0][0]);
				payload.logData['percentile'] = percentile;
				tf.dispose(input_data);
				tf.dispose(preds);
				// log post요청후 모델 내려서 중복 로딩 에러 방지
				// edit model import way:setMyModel(null);
			}
		}
		const res = await postLog(payload).then((res) => {
			setIsHistoryDetail((prev) => ({
				...prev,
				log: res.data.log,
				reps: res.data.reps,
				isDone: true,
			}));
			return res;
		});
		resetWorkoutState();
		setUpdateCount();
	};
	/**
	 * load model and warming up the model
	 * execute on first rendering with useEffect
	 */
	// edit model import way:
	// const onModel = async () => {
	// 	const modelPath = '/mymodel/hwakeyeJS/model.json';
	// 	const model = await tf.loadLayersModel(modelPath);
	// 	setMyModel(model);
	// 	const sample = tf.tensor2d([[0.32857143, 0.2575, 2]]);
	// 	const preds = model.predict(sample).array();
	// 	tf.dispose(sample);
	// 	tf.dispose(preds);
	// 	return model;
	// };
	useEffect(() => {
		if (!myModel) {
			setMyModel(getHawkEye());
		}

		if (WorkoutState.curBodyWeight === 0) {
			setCurBodyWeight(Number(user.weight));
		}
		return () => {
			setMyModel(null);
		};
	}, []);
	return (
		<div className="mt-5 md:mt-1">
			<div className="flex items-center h-10 md:h-8">
				<div className="w-2/12 border-r-2 border-stone-600 text-center py-2">
					세트
				</div>
				<div className="w-2/12 text-center border-r-2 border-stone-600 py-2">
					무게
				</div>
				<div className="w-2/12 text-center border-r-2 border-stone-600 py-2">
					reps
				</div>
				<div className="w-2/12 text-center border-r-2 border-stone-600 py-2">
					Kcal
				</div>
				<div className="w-2/12 text-center border-stone-600 py-2">1RM</div>
				<div className="w-2/12 pl-1 text-center border-l-2 border-stone-600 py-2">
					fn
				</div>
			</div>
			{isWeightError ? (
				<RepWeightInputError setIsError={setIsWeightError} />
			) : null}
			{isRepError ? <RepRepsInputError setIsError={setIsRepError} /> : null}
			<div className="max-h-80 overflow-y-auto">
				{WorkoutState.reps.map((el, idx) => (
					<WorkoutRep
						key={idx}
						repData={el}
						rep_num={idx}
						userHeight={userHeight}
						setIsWeightError={setIsWeightError}
						setIsRepError={setIsRepError}
					/>
				))}
			</div>

			<div className="flex mt-1 items-center h-10 md:h-8 ">
				<div className="w-2/12 text-center border-r-2 border-stone-600 md:align-text-bottom py-2">
					{total_reps}
				</div>
				<div className="w-4/12 text-center border-r-2 border-stone-600 py-2">
					<span className="text-md">Lift: </span>
					{total_lift}
					<span className="text-md"> kg</span>
				</div>
				<div className="w-2/12 text-center border-r-2 border-stone-600 py-2">
					{total_cal}
				</div>
				<div className="w-2/12 text-center border-stone-600 py-2">
					{max_1rm}kg
				</div>
				<div
					className="w-2/12 text-center border-r-2 border-t-2 border-l-2 text-amber-600 border-amber-600 shadow md:text-sm py-2"
					onClick={() => onAddRep()}
				>
					+
				</div>
			</div>
			<div className="flex w-full items-center mt-2">
				<div className="text-center text-xl pr-2">현재 체중:</div>
				<input
					className="w-1/4 bg-stone-200 text-black disabled:bg-stone-800 disabled:text-white"
					disabled={bodyweightInputMode === 'done' ? true : false}
					value={bodyWeightInput || ''}
					onChange={onBodyWeightInputChange}
				/>
				<div className="text-center text-xl mr-2">Kg</div>
				{bodyweightInputMode === 'done' ? (
					<button
						className="border border-gray-300 rounded-sm text-lime-700"
						onClick={onBodyWeightChange}
					>
						체중수정
					</button>
				) : (
					<button
						className="border border-gray-300 rounded-sm text-stone-700"
						onClick={onBodyWeightChange}
					>
						수정완료
					</button>
				)}
			</div>
			<button
				className="w-full mt-2 bg-lime-500 rounded-md disabled:bg-lime-600 h-10 opacity-80"
				disabled={!allRepsDone || bodyweightInputMode === 'edit'}
				onClick={onWorkoutDone}
			>
				Done
			</button>
		</div>
	);
}
