import create from 'zustand';

const useWorkoutStore = create((set, get) => ({
	//fetch and categorize workout type data
	WorkoutGroups: {
		benchGroup: [],
		squatGroup: [],
		deadliftGroup: [],
		isFetched: false,
	},
	getWorkoutGroup: () => get().WorkoutGroups,
	getSpecificWorkoutGroup: (workout_name) => {
		switch (true) {
			case workout_name === 'squat':
				return get().WorkoutGroups.squatGroup;
				break;
			case workout_name === 'bench press':
				return get().WorkoutGroups.benchGroup;
				break;
			case workout_name === 'deadlift':
				return get().WorkoutGroups.deadliftGroup;
				break;
		}
	},
	setBenchGroup: (data) => {
		set((state) => ({
			WorkoutGroups: { ...state.WorkoutGroups, benchGroup: data },
		}));
	},
	setSquatGroup: (data) => {
		set((state) => ({
			WorkoutGroups: { ...state.WorkoutGroups, squatGroup: data },
		}));
	},
	setDeadliftGroup: (data) => {
		set((state) => ({
			WorkoutGroups: { ...state.WorkoutGroups, deadliftGroup: data },
		}));
	},
	setIsFetched: () => {
		set((state) => ({
			WorkoutGroups: { ...state.WorkoutGroups, isFetched: true },
		}));
	},
	curWorkoutState: {
		name: 'Start Engine',
		workout_id: -1,
		range: 0,
		reps: [],
		curBodyWeight: 0,
	},
	getCurWorkoutState: () => get().curWorkoutState,
	setCurBodyWeight: (val) => {
		set((state) => ({
			curWorkoutState: { ...state.curWorkoutState, curBodyWeight: val },
		}));
	},
	setWorkoutName: (name, id) => {
		set((state) => ({
			curWorkoutState: { ...state.curWorkoutState, name: name, workout_id: id },
		}));
	},
	setWorkoutRange: (val) => {
		set((state) => ({
			curWorkoutState: { ...state.curWorkoutState, range: val },
		}));
	},
	// workout rep수정 영역
	addRep: (rep) => {
		set((state) => ({
			curWorkoutState: {
				...state.curWorkoutState,
				reps: [...state.curWorkoutState.reps, rep],
			},
		}));
	},
	deleteRep: (target_idx) => {
		set((state) => ({
			curWorkoutState: {
				...state.curWorkoutState,
				reps: state.curWorkoutState.reps.filter(
					(rep, idx) => idx !== target_idx
				),
			},
		}));
	},
	/**
	 * idx와 업데이트 할 data 입력하여
	 * curWorkoutState.reps[idx]요소 업데이트한다.
	 * @param {*} idx
	 * @param {*} new_data
	 */
	updateRep: (idx, new_data) => {
		const curState = get().curWorkoutState;
		const new_reps = curState.reps.map((el, a_idx) => {
			if (a_idx < idx) {
				return el;
			} else if (a_idx === idx) {
				return new_data;
			} else {
				if (!el.is_done) {
					return {
						...el,
						workout_weight: new_data.workout_weight,
						reps: new_data.reps,
					};
				} else {
					return el;
				}
			}
		});
		set((state) => ({
			curWorkoutState: { ...state.curWorkoutState, reps: new_reps },
		}));
	},
	/**
	 * reps를 통째로 업데이트 한다.
	 * @param {Array} new_reps
	 */
	updateReps: (new_reps) => {
		set((state) => ({ ...state.curWorkoutState, reps: new_reps }));
	},
	/**
	 * 제출 하고 나서 모든 필드 초기화
	 */
	resetWorkoutState: () => {
		set((state) => ({
			curWorkoutState: {
				...state.curWorkoutState,
				name: 'Start Engine',
				workout_id: -1,
				range: 0,
				reps: [],
			},
		}));
	},
}));

export default useWorkoutStore;
