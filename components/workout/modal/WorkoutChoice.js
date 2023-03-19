import useWorkoutStore from '../../../stores/workout/useWorkoutStore';

export default function WorkoutChoice({ data, setIsModal }) {
	const { setWorkoutName, setWorkoutRange, resetWorkoutState } =
		useWorkoutStore();
	const initializeLog = (name, range, id) => {
		resetWorkoutState();
		setWorkoutName(name, id);
		setWorkoutRange(range);
		setIsModal(false);
	};
	return (
		<div
			className="flex flex-col fixed inset-0 bg-black bg-opacity-25
        backdrop-blur-sm px-5 pt-24 max-w-md mx-auto"
		>
			<div className="text-4xl mb-5 text-center">Choose Workout</div>
			<div className="w-full bg-stone-800 shadow-md rounded">
				{data.map((el, idx) => (
					<p
						key={idx}
						className="text-2xl leading-normal border-b-2 px-2 py-5"
						onClick={() => initializeLog(el.name, el.workout_distance, el.id)}
					>
						{el.name}
					</p>
				))}
				<div
					className="w-full h-10 bg-transparent border-amber-800 boder-2 text-1xl text-center pt-2 bg-amber-600 rounded-b"
					onClick={() => setIsModal(false)}
				>
					close
				</div>
			</div>
		</div>
	);
}
