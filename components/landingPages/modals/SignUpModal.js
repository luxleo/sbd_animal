import { useEffect, useState } from 'react';
import {
	getVerificationCode,
	postCreateUser,
} from '../../../utils/fetch/AuthenticationUtils';

import EmailAuthModal from './EmailAuthModal';
import ErrorMsg from './ErrorMsg';
import GetHW from './GetHW';
import { getJwtAfterLogin } from '../../../utils/fetch/AuthenticationUtils';

export default function SignUpModal({ fn, fn_store }) {
	const setAuthState = fn_store;
	const setCurState = fn;

	const [signUpInfo, setSingUpInfo] = useState({
		email: '',
		username: '',
		password: '',
		height: 0,
		weight: 0,
	});
	//INFO: for error message modal control
	const [isError, setIsError] = useState({ error_msg: '', error_bool: false });

	//INFO: sign up stage1: for code verification control
	const [isVeriCodeReady, setIsVeriCodeReady] = useState(false);
	const [verificationCode, setVerificationCode] = useState(0);
	// const {
	// 	isEmailInfoSubmit,
	// 	setIsEmailInfoSubmit,
	// 	verificationCode,
	// 	setVerificationCode,
	// } = useAuthEmailStore();
	//INFO: sign up stage2: get height and weight after verfify email
	const [isVerified, setIsVerified] = useState(false); // INFO: user complete email authentication with verification code from server
	const [isGoodToGo, setIsGoodToGo] = useState(false);
	/**
	 * 유저 생성 호출 -> 만들어진 유저 정보로 token얻기 -> 로그인 시키기 순서로 함수 호출
	 */
	const createAndLoginUser = async () => {
		await postCreateUser(signUpInfo);
		//TODO: 2.authstate 바꾸고 로그인 시키기
		await getJwtAfterLogin(signUpInfo);
		await setAuthState('authenticated');
	};
	const onSubmit = async () => {
		const email_input = document.getElementById('email').value;
		const username_input = document.getElementById('username').value;
		const password = document.getElementById('password').value;
		const password2 = document.getElementById('password2').value;
		const isEmail = (email) =>
			/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
		const isUserName = (username) => /^[a-zA-Zㄱ-힣0-9]{3,20}$/i.test(username);

		// INFO: do validation check on username,email,password
		if (!isUserName(username_input)) {
			setIsError({
				...isError,
				error_msg:
					'username must be at least 3,less than 20 characters\nonly alphabet and 한글,digit are allowed',
				error_bool: true,
			});
			return;
		} else if (!isEmail(email_input)) {
			setIsError({
				...isError,
				error_msg: 'please use email in right format!',
				error_bool: true,
			});
			return;
		} else if (password !== password2) {
			setIsError({
				...isError,
				error_msg: 'password is not match',
				error_bool: true,
			});
			return;
		}
		setSingUpInfo({
			...signUpInfo,
			email: email_input,
			username: username_input,
			password: password,
		});
		const res = await getVerificationCode(username_input, email_input); // await처리 하지 않으면 동기적으로 작용되어 프로미스 바로 반환
		const encoded_code = parseInt((res.data.verification_code - 1234) / 2);
		setVerificationCode(encoded_code);
		//NOTE: make verification code masked in console network section
		setIsVeriCodeReady(true);
	};
	useEffect(() => {
		if (isGoodToGo) {
			//TODO: 2.authstate 바꾸고 로그인 시키기
			createAndLoginUser();
		}
	}, [isGoodToGo]);
	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-25
        backdrop-blur-sm flex justify-center items-center"
		>
			<div className="w-72">
				<form className="bg-stone-800 shadow-md rounded px-8 pt-6 pb-2 mb-2">
					<div className="mb-2">
						<label
							className="block text-amber-500 text-sm font-bold mb-2"
							htmlFor="username"
						>
							Username
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="username"
							type="text"
							placeholder="Username"
						/>
					</div>
					<div className="mb-2">
						<label
							className="block text-amber-500 text-sm font-bold mb-2"
							htmlFor="email"
						>
							Email
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="email"
							type="text"
							placeholder="email"
						/>
					</div>
					<div className="mb-3">
						<label
							className="block text-amber-500 text-xs font-bold mb-1"
							htmlFor="password"
						>
							Password
						</label>
						<input
							className="shadow appearance-none border border-red-500 rounded w-full py-1 px-1 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"
							id="password"
							type="password"
							placeholder="******************"
						/>
						<label
							className="block text-amber-500 text-xs font-bold mb-1"
							htmlFor="password2"
						>
							Confirm password
						</label>
						<input
							className="shadow appearance-none border border-red-500 rounded w-full py-1 px-1 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline"
							id="password2"
							type="password"
							placeholder="******************"
						/>
					</div>
					<div className="flex mt-2">
						<button
							className="flex-1 bg-transparent hover:bg-amber-700 text-amber-500 hover:text-amber-200 text-sm font-bold py-1 px-4 rounded border-2 border-amber-500 focus:outline-none focus:shadow-outline"
							type="button"
							onClick={(e) => onSubmit(e)}
						>
							Register
						</button>
					</div>
					<div className="flex mt-2">
						<button
							className="flex-1 bg-transparent hover:bg-red-700 text-red-500 hover:text-red-200 text-sm font-bold py-1 px-4 rounded border-2 border-red-500 focus:outline-none focus:shadow-outline"
							type="button"
							onClick={() => setCurState('none')}
						>
							Close
						</button>
					</div>
				</form>
				<div className="flex mt-4">
					<button
						className="flex-1 bg-white hover:bg-amber-700 text-gray-700 hover:text-amber-200 text-sm font-bold py-1 px-4 rounded border-2 border-amber-500 focus:outline-none focus:shadow-outline"
						type="button"
						onClick={() => setCurState('login')}
					>
						<span className="text-xs text-gray-400">already Member? </span>Login
					</button>
				</div>
			</div>
			{isVeriCodeReady ? (
				<EmailAuthModal
					fn_bool={setIsVeriCodeReady}
					verification_code={verificationCode}
					isError={isError}
					setIsError={setIsError}
					isVerified={isVerified}
					setIsVerified={setIsVerified}
				/>
			) : null}
			{isVerified ? (
				<GetHW
					fn={setIsVerified}
					userInfo={signUpInfo}
					updateUserInfo={setSingUpInfo}
					isError={isError}
					setIsError={setIsError}
					isGoodToGo={isGoodToGo}
					setIsGoodToGo={setIsGoodToGo}
				/>
			) : null}
			{isError.error_bool ? (
				<ErrorMsg isError={isError} setIsError={setIsError} />
			) : null}
		</div>
	);
}
