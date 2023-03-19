import create from 'zustand';

const useUserStore = create((set, get) => ({
	isUser: false,
	setIsUser: (val) => {
		set((state) => ({ isUser: val }));
	},
	user: {
		username: '',
		email: '',
		height: 0,
		weight: 0,
		//TODO: avatar source 필드 구현하기
	},
	getUser: () => get().user,
	setUser: (val) => {
		set((state) => ({ user: val }));
	},
	setUserWeight: (val) => {
		set((state) => ({
			user: { ...state.user, weight: val },
		}));
	},
	resetUser: /** reset user information*/ () => {
		set((state) => ({
			isUser: false,
			user: {
				username: '',
				email: '',
				height: 0,
				weight: 0,
			},
		}));
	},
}));

export default useUserStore;
