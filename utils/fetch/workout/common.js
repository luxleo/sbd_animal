import myAxios from '../customAxios';

export async function getAllWorkoutType() {
	const url = 'workout/workout_types/';
	const res = await myAxios.get(url);
	return res.data;
}
