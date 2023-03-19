import myAxios from '../customAxios';
const url = 'workout/';

export async function postLog(data) {
	const URL = url + 'logs/';
	const res = await myAxios.post(URL, data);
	return res;
}
export async function deleteLog(id) {
	const URL = url + `logs/${id}/`;
	const res = await myAxios.delete(URL);
	return res;
}

export async function listLog() {
	const URL = url + 'history/';
	const res = await myAxios.get(URL);
	return res;
}

export async function detailLog(id) {
	const URL = url + `logs/${id}/`;
	const res = await myAxios.get(URL).then((res) => res.data);
	return res;
}

export async function logForDashboard(
	workout_name,
	scope_range = 'default',
	last_day = 'None'
) {
	const URL = url + 'dashboard/';
	const res = await myAxios
		.get(URL, {
			params: {
				target_workout_name: workout_name,
				scope_range: scope_range,
				last_day: last_day,
			},
		})
		.then((res) => res.data);
	return res;
}
