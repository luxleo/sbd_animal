/**
 * workout name을 categorical data로 바꾼다.
 * @param {String} workout_name
 * @returns categorized Number(0,1,2)
 */
function getCategorizedWorkoutName(workout_name) {
	if (workout_name === 'squat') {
		return 0;
	} else if (workout_name === 'bench press') {
		return 1;
	} else if (workout_name === 'deadlift') {
		return 2;
	} else {
		return;
	}
}

/**
 * min-max normalization된 데이터 역 정규화
 * @param {Array} data (bodymass,liftmass,workout_name)
 * @returns
 */
export function normalizeTestData(data) {
	const min_bodymass = 50;
	const max_bodymass = 120;

	const min_liftmass = 20;
	const max_liftmass = 420;

	const res = [];
	res.push((data[0] - min_bodymass) / (max_bodymass - min_bodymass));
	res.push((data[1] - min_liftmass) / (max_liftmass - min_liftmass));
	res.push(getCategorizedWorkoutName(data[2]));

	return res;
}

/**
 * 모델이 예측한 percentile값이 100이상이면 100반환하고
 * 0보다 작으면 0을 반환한다.
 * @param {float} val
 * @returns
 */
export function normalizePredictionResult(val) {
	if (val > 100) {
		return 100;
	} else if (val < 0) {
		return 0;
	}
	return val.toFixed(1);
}
