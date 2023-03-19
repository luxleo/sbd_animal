import myAxios from '../customAxios';

const url = 'bulletin_board/';

export async function getMyInquery() {
	const URL = url + 'inquery/';
	const res = await myAxios.get(URL);
	return res;
}

export async function postMyInquery(payload) {
	const URL = url + 'inquery/';
	const res = await myAxios.post(URL, payload);
	return res;
}

/**
 *
 * @param {Array} data :삭제할 id list
 * @returns
 */
export async function deleteInqueries(data) {
	const URL = url + 'inquery/';
	const res = await myAxios.delete(URL, { data: { delete_id_list: data } });
	return res;
}

export async function getMyDetailInquery(id) {
	const URL = url + `inquery/${id}/`;
	const res = await myAxios.get(URL);
	return res;
}
export async function putInquery(id, data) {
	const URL = url + `inquery/${id}/`;
	const res = await myAxios.put(URL, data);
	return res;
}
export async function postReply(data) {
	const URL = url + 'inquery/reply/';
	const res = await myAxios.post(URL, data);
	return res;
}
export async function putReply(data) {
	const URL = url + 'inquery/reply/';
	const res = await myAxios.put(URL, data);
	return res;
}
export async function deleteReply(id) {
	const URL = url + 'inquery/reply/';
	const res = myAxios.delete(URL, { data: { id: id } });
	return res;
}
