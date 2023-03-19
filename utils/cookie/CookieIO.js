/**
 * name에 입력한 key의 쿠키 값을 가져온다
 * @param {string} name
 */
export function getCookieValue(name) {
	const value = document.cookie
		.split('; ')
		.find((row) => row.startsWith(name))
		?.split('=')[1];
	return value;
}
