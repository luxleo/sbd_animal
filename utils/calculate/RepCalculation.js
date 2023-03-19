export const calc_calories = (user_height, range, weight, reps) => {
	const dist = (user_height * range) / 100;
	//mgh * 2(왕복) *반복수 => J
	let res = weight * 9.8 * dist * 2 * reps;
	//kcal transformation
	res /= 4200;
	// muslce energy efficiency is 30%
	res *= 3.3;
	return Number(parseFloat(res).toFixed(1));
};

export const calc_one_rep_max = (reps, weight) => {
	if (reps == 1) {
		return weight;
	} else {
		return Number(parseFloat(weight * (1 + 0.028 * reps)).toFixed(1));
	}
};
