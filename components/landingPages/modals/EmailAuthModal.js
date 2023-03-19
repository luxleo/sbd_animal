export default function EmailAuthModal({
	fn_bool,
	verification_code,
	isError,
	setIsError,
	setIsVerified,
}) {
	const setBool = fn_bool;
	const veri_code_from_parent = verification_code;
	const error_state_from_parent = isError;
	const pop_error_modal = setIsError;
	const onClick = async () => {
		const veri_code_from_user = parseInt(
			(document.getElementById('verification_code').value - 1234) / 2
		);
		if (veri_code_from_user === veri_code_from_parent) {
			//TODO: create user and redirect to login page
			setBool(false);
			setIsVerified(true);
		} else {
			pop_error_modal({
				...error_state_from_parent,
				error_msg: "doesn't match",
				error_bool: true,
			});
		}
	};
	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-25
        backdrop-blur-sm flex justify-center items-center"
		>
			<div className="w-72">
				<form className="bg-stone-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
					<div className="mb-4">
						<label
							className="block text-amber-500 text-sm font-bold mb-2"
							htmlFor="verification_code"
						>
							verification code
						</label>
						<input
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							id="verification_code"
							type="text"
							placeholder="Enter 8digit Verification Code from your email!"
						/>
					</div>
					<div className="flex mt-2">
						<button
							className="flex-1 bg-transparent hover:bg-amber-700 text-amber-500 hover:text-amber-200 text-sm font-bold py-1 px-4 rounded border-2 border-amber-500 focus:outline-none focus:shadow-outline"
							type="button"
							onClick={() => {
								onClick();
							}}
						>
							Verify
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
