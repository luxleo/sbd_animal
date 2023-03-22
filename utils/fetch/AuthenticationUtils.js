import myAxios from './customAxios';

/**
 * 유저가 입력한 이메일로 인증코드 전송하고 클라이언트단으로 전달 및 저장하여
 * 유효성검사실시
 * @param {String} username
 * @param {String} email_address
 * @returns
 */
export async function getVerificationCode(username, email_address) {
	const url = 'verification_code';
	const res = await myAxios
		.get(url, {
			params: {
				email_address: email_address,
				username: username,
			},
		})
		.then((res) => {
			return res;
		});
	return res;
}

/**
 * 유저가 기입한 email,username,password,height,weight를 기반으로
 * 회원가입 실시
 * @param {Object} userInfo
 * @returns
 */
export async function postCreateUser(userInfo) {
	const url = 'accounts/signup/';
	const res = await myAxios.post(url, userInfo).then((res) => {
		return res;
	});
	return res;
}
/**
 * 유저 정보 jwt를 쿠키에 저장한다.
 * @param {Object} signInInfo
 * @returns
 */
export async function getJwtAfterLogin(signInInfo) {
	const url = 'accounts/login/';
	const res = await myAxios.post(url, signInInfo).then((res) => {
		console.log('cookie', res, res.headers['set-cookie']);
		return res;
	});
	// setAuthState({ authState: 'authenticated' });

	return res;
}
/**
 * 쿠키에 저장된 값들을 넘겨 authentication체크 한다.
 * @returns {string} state of authentication
 */
export async function getIsAccessCodeValid() {
	const url = 'accounts/test_access_code/';
	const res = await myAxios.get(url);
	return res;
}

export async function getUserProfile() {
	const url = 'accounts/profile/';
	const res = await myAxios.get(url);

	return res;
}

export async function editProfile(data) {
	const url = 'accounts/profile/';
	const res = await myAxios.put(url, data);
	return res;
}
