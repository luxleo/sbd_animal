import create from 'zustand';

const useAuthEmailStore = create((set) => ({
	isEmailInfoSubmit: false,
	setIsEmailInfoSubmit: (val) => {
		set((state) => ({ isEmailInfoSubmit: val }));
	},
	verificationCode: 0,
	setVerificationCode: (val) => {
		set((state) => ({ verificationCode: val }));
	},
}));

export default useAuthEmailStore;
