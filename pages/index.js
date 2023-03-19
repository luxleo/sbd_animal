import BeforeLogin from '../components/landingPages/BeforeLogin';
import AfterLogin from '../components/landingPages/\bAfterLogin';
import useAuthStore from '../stores/authentication/useAuthStore';

export default function Home() {
	const { authState } = useAuthStore();
	/**
	 * cookie에 저장된 refresh,access token을 검사한 결과에 따라 분기하여
	 * authentication상태를 check한다.
	 * @todo 모든페이지에 대하여 적용시키기.
	 */
	return (
		<>
			{authState === 'authenticated' ? (
				<AfterLogin />
			) : authState === 'none' ? (
				<BeforeLogin />
			) : null}
		</>
	);
}
