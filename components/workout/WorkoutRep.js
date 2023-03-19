import { useState, useEffect } from 'react';

import { TiDeleteOutline } from 'react-icons/ti';
import {
	calc_calories,
	calc_one_rep_max,
} from '../../utils/calculate/RepCalculation';
import useWorkoutStore from '../../stores/workout/useWorkoutStore';

/**
 * 	입력 인자의 범위 0~500의 유효성 검사한다.
 * @param  {numbers} args
 * @returns
 */
const workoutWeightValidator = (val) => {
	let numVal = Number(val);
	if (isNaN(numVal)) {
		return false;
	} else if (numVal <= 0 || numVal > 500) {
		return false;
	} else if (!Number.isInteger(numVal) && numVal.toFixed(1) !== val) {
		return false;
	}
	return true;
};

const repsValidator = (val) => {
	let numVal = Number(val);
	if (isNaN(numVal)) {
		return false;
	} else if (numVal <= 0 || numVal > 500) {
		return false;
	} else if (!Number.isInteger(numVal)) {
		return false;
	}
	return true;
};

/**
 *
 * @todo 파워 측정 기능 추가하기
 */
export default function WorkoutRep({
	repData,
	rep_num,
	userHeight,
	setIsWeightError,
	setIsRepError,
}) {
	const { updateRep, deleteRep } = useWorkoutStore();
	const [newRep, setNewRep] = useState({ ...repData });

	const onChangeWeight = (e) => {
		setNewRep((prev) => ({ ...prev, workout_weight: e.target.value }));
	};
	const onChangeReps = (e) => {
		setNewRep((prev) => ({ ...prev, reps: e.target.value }));
	};
	const onRepDelete = () => {
		deleteRep(rep_num);
	};
	const onRepDone = (e) => {
		if (e.target.checked) {
			const rep_cal = calc_calories(
				userHeight,
				newRep.range,
				newRep.workout_weight,
				newRep.reps
			);
			const oneRM = calc_one_rep_max(newRep.reps, newRep.workout_weight);
			const liftWeight = Number(newRep.workout_weight * newRep.reps);
			if (!workoutWeightValidator(newRep.workout_weight)) {
				setIsWeightError(true);
			} else if (!repsValidator(newRep.reps)) {
				setIsRepError(true);
			} else {
				setNewRep((prev) => ({
					...prev,
					calorie: rep_cal,
					oneRM: oneRM,
					liftWeight: liftWeight,
					is_done: true,
				}));
				updateRep(rep_num, {
					...newRep,
					calorie: rep_cal,
					oneRM: oneRM,
					liftWeight: liftWeight,
					is_done: true,
				});
			}
		} else {
			setNewRep((prev) => ({
				...prev,
				is_done: false,
			}));
			updateRep(rep_num, {
				...newRep,
				is_done: false,
			});
		}
	};
	useEffect(() => {
		setNewRep({ ...repData });
	}, [repData]);
	return (
		<div
			className={`flex w-full ${
				newRep.is_done
					? 'bg-stone-800 border-stone-700'
					: 'bg-stone-700 border-stone-500'
			} h-10 border-b-2 border-t-0 pt-1 md:h-6`}
		>
			<div className="w-2/12 text-center">{rep_num + 1}</div>
			<div className="flex w-2/12 justify-center">
				<input
					type="number"
					min="0"
					max="500"
					value={newRep.workout_weight || ''}
					onChange={onChangeWeight}
					className="text-black block bg-stone-300 text-center disabled:bg-stone-800 disabled:text-stone-200"
					disabled={newRep.is_done ? true : false}
				/>
			</div>
			<div className="flex w-2/12 justify-center">
				<input
					type="number"
					value={newRep.reps || ''}
					min="0"
					max="500"
					onChange={onChangeReps}
					className="text-black block text-center bg-stone-300 disabled:bg-stone-800 disabled:text-stone-200"
					disabled={newRep.is_done ? true : false}
				/>
			</div>
			<div className="w-2/12 text-center">{newRep.calorie}</div>
			<div className="w-2/12 text-center">{newRep.oneRM}</div>
			{!newRep.is_done ? (
				<div className="flex justify-center items-center mr-2">
					<button onClick={onRepDelete} className="text-amber-700 text-2xl">
						<TiDeleteOutline />
					</button>
				</div>
			) : (
				<div className="flex justify-center items-center mr-2"></div>
			)}
			<div className="form-check flex justify-center items-center">
				<input
					className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-stone-700 checked:bg-lime-500 checked:border-lime-600 focus:outline-none transition duration-200 my-1 cursor-pointer"
					type="checkbox"
					onChange={onRepDone}
					checked={newRep.is_done ? true : false}
				/>
			</div>
		</div>
	);
}
