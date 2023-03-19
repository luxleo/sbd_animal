import create from 'zustand';

/**
 * authState로 인증 정보를 업데이트 및 조회하고
 * updateCount로 authState를 업데이트 해야한다는 신호를 보낸다.
 * @todo jwt_token 여기에 저장해서 구현 해보기
 */
const useAuthStore = create((set, get) => ({
	authState: '',
	setAuthState: (val) => {
		set((state) => ({ authState: val }));
	},
	getAuthState: () => {
		const res = get().authState;
		return res;
	},
	updateCount: 0,
	setUpdateCount: () =>
		set((state) => ({ updateCount: state.updateCount + 1 })),
	getUpdateCount: () => {
		const res = get().updateCount;
		return res;
	},
	asyncUpdateCount: async () =>
		await set((state) => ({ updateCount: state.updateCount + 1 })),
}));

export default useAuthStore;
