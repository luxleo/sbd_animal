import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import useAuthStore from '../stores/authentication/useAuthStore';
import useUserStore from '../stores/authentication/useUserStore';
import useWorkoutStore from '../stores/workout/useWorkoutStore';
import useTensorflowStore from '../stores/mymodel/useTensorflowStore';

import {
	getIsAccessCodeValid,
	getUserProfile,
} from '../utils/fetch/AuthenticationUtils';
import HeadNav from './layout/navbars/HeadNav';
import BottomNav from './layout/navbars/BottomNav';
import ContentContainer from './layout/ContentContainer';

export default function BaseLayout({ children }) {
	const router = useRouter();
	const { authState, setAuthState, updateCount } = useAuthStore();
	const { isUser, setIsUser, setUser, resetUser } = useUserStore();
	const { resetWorkoutState } = useWorkoutStore();
	const { loadHawkEye, getHawkEye } = useTensorflowStore();
	/**
	 * 유효한 access code가 필요한 모든 페이지에 대하여
	 * 유효성 검사하고 유효한 refresh token으로 부터
	 * access code 유효성 갱신
	 * token 유효하지 않을 시 메인 페이지로 리다이렉트
	 */
	const check_authentication = async () => {
		const res = await getIsAccessCodeValid().then((res) => res.data.message);
		if (res === 'no tokens') {
			setAuthState('none');
			resetWorkoutState();
			resetUser();
			router.push('/');
		} else if (res === 'refresh token is expired') {
			setAuthState('none');
			resetWorkoutState();
			resetUser();
			router.push('/');
		} else {
			// 유저 정보 가져와 caching한다
			if (!isUser) {
				const res = await getUserProfile();
				setIsUser(true);
				setUser(res.data.user);
			}

			setAuthState('authenticated');
		}
	};
	useEffect(() => {
		//TODO: if 분기 조건 유저 패치 가능 추가하여 access_token유효 할때만
		// auth state 업데이트 하도록 하자.
		// children update시에도 적용되는지 확인하기.
		check_authentication();
	}, [updateCount]);
	/**
	 * 접근한 페이지가 권한없을 경우 landing page로 redirect시킨다.
	 */
	useEffect(() => {
		if (authState !== 'authenticated' && router.pathname !== '/') {
			//TODO: 배포시 router.push에 shallow:true옵션 지정시 차이점이 있는지 확인
			router.push('/');
		}
	}, [children]);
	/**
	 * 페이지 로드시 모델 바로 등록 한다.
	 */
	useEffect(() => {
		const hawkEye = getHawkEye();
		if (!hawkEye) {
			loadHawkEye();
		}
	}, []);
	return (
		<>
			{authState === 'authenticated' ? (
				<div className="relative overflow-auto container max-w-md mx-auto bg-stone-900 text-lg color-white text-white h-screen md:text-sm">
					<HeadNav />
					<ContentContainer>{children}</ContentContainer>
					<BottomNav />
				</div>
			) : (
				<div className="container max-w-md mx-auto bg-stone-800 text-lg color-white text-white">
					{children}
				</div>
			)}
		</>
	);
}
