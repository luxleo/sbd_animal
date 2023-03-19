export default function WorkoutHead({ getCurWorkoutState }) {
	const curWorkoutName = getCurWorkoutState().name;
	return (
		<div
			id="workout_name"
			className="p-3 border-amber-800 border-b-2 text-4xl text-center mb-1 mt-3 md:text-2xl md:mt-1"
		>
			{curWorkoutName}
		</div>
	);
}
