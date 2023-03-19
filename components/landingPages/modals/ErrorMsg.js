export default function ErrorMsg({ isError, setIsError }) {
	const errorState = isError;
	const setErrorState = setIsError;
	const onClick = () => {
		setErrorState({ error_msg: '', error_bool: false });
	};
	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-25
        backdrop-blur-sm flex justify-center items-center"
		>
			<div className="w-88 flex flex-col bg-stone-800 ">
				<div className="text-sm text-amber-200 font-bold flex-1 mb-6">
					{errorState.error_msg.split('\n').map((line, idx) => (
						<p key={idx}>{line}</p>
					))}
				</div>
				<button
					className="flex-1 bg-transparent hover:bg-amber-700 text-amber-200 hover:text-amber-200 text-sm font-bold py-1 px-4 rounded border-2 border-amber-500 focus:outline-none focus:shadow-outline"
					onClick={() => {
						onClick();
					}}
				>
					Close
				</button>
			</div>
		</div>
	);
}
