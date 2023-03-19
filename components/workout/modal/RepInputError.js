export function RepWeightInputError({ setIsError }) {
	return (
		<div
			className="flex flex-col fixed inset-0 bg-black bg-opacity-25
        backdrop-blur-sm px-5 pt-24"
		>
			<div className="h-12 border-b-2 text-center text-4xl">Error</div>
			<div className="text-center text-2xl">
				weight는 0에서 500사이의 값이어야합니다 (소숫점 한 자리까지).
			</div>
			<div
				className="w-full h-10 bg-transparent border-amber-800 boder-2 text-1xl text-center pt-2 bg-amber-600 rounded-b"
				onClick={() => setIsError(false)}
			>
				close
			</div>
		</div>
	);
}
export function RepRepsInputError({ setIsError }) {
	return (
		<div
			className="flex flex-col fixed inset-0 bg-black bg-opacity-25
        backdrop-blur-sm px-5 pt-24"
		>
			<div className="h-12 border-b-2 text-center text-4xl">Error</div>
			<div className="text-center text-2xl">
				Rep은 0에서 500사이의 자연수 값이어야합니다.
			</div>
			<div
				className="w-full h-10 bg-transparent border-amber-800 boder-2 text-1xl text-center pt-2 bg-amber-600 rounded-b"
				onClick={() => setIsError(false)}
			>
				close
			</div>
		</div>
	);
}
