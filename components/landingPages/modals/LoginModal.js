import { useState } from 'react';

import ErrorMsg from './ErrorMsg';
import useAuthStore from '../../../stores/authentication/useAuthStore';
import { getJwtAfterLogin } from '../../../utils/fetch/AuthenticationUtils';

export default function LoginModal({ fn, fn_store }) {
	const setCurState = fn;
	const setAuthState = fn_store;
	const { setUpdateCount } = useAuthStore();
	//setAuthState
	const [loginInfo, setLoginInfo] = useState({
		email: '',
		password: '',
	});
	const [isError, setIsError] = useState({ error_msg: '', error_bool: false });
	const onEmailChange = (e) => {
		setLoginInfo((prev) => ({ ...prev, email: e.target.value }));
	};
	const onPasswordChange = (e) => {
		setLoginInfo((prev) => ({ ...prev, password: e.target.value }));
	};

	const onLogin = async () => {
		const email = loginInfo.email;
		const password = loginInfo.password;
		const isEmail = (email) =>
			/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
		if (!isEmail(email)) {
			setIsError({
				...isError,
				error_msg: 'please use email in right format!',
				error_bool: true,
			});
			setLoginInfo((prev) => ({
				...prev,
				email: '',
				password: '',
			}));
			return;
		} else {
			await getJwtAfterLogin(loginInfo);
			setAuthState('authenticated');
			setUpdateCount();
		}
	};
	const onRegister = () => {
		setCurState('register');
	};
	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-25
        backdrop-blur-sm flex justify-center items-center"
		>
			<div className="w-72">
				<form className="bg-stone-800 shadow-md rounded px-8 pt-6 pb-4 mb-2">
					<div className="mb-4">
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
							placeholder="Email"
							onChange={onEmailChange}
						/>
					</div>
					<div className="mb-6">
						<label
							className="block text-amber-500 text-sm font-bold mb-2"
							htmlFor="password"
						>
							Password
						</label>
						<input
							className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
							id="password"
							type="password"
							placeholder="******************"
							onChange={onPasswordChange}
						/>
					</div>
					<div className="flex mt-1">
						<button
							className="flex-1 bg-transparent hover:bg-amber-700 text-amber-500 hover:text-amber-200 text-sm font-bold py-1 px-4 rounded border-2 border-amber-500 focus:outline-none focus:shadow-outline"
							type="button"
							onClick={() => onLogin()}
						>
							Log in
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
						onClick={() => onRegister()}
					>
						<span className="text-xs text-gray-300">New? </span>Register
					</button>
				</div>
			</div>
			{isError.error_bool ? (
				<ErrorMsg isError={isError} setIsError={setIsError} />
			) : null}
		</div>
	);
}
