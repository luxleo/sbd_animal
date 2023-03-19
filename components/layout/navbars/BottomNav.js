import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { useEffect, useState } from 'react';

import WorkoutPic from '../../../public/navbarIcon/IMG_0511.PNG';
import DashboardPic from '../../../public/navbarIcon/IMG_0512.PNG';
import HistoryPic from '../../../public/navbarIcon/IMG_0513.PNG';

export default function BottomNav() {
	const router = useRouter();
	const [pathMonitor, setPathMonitor] = useState({
		isDashboard: false,
		isEngine: false,
		isHistory: false,
	});
	useEffect(() => {
		const nowLastPathName = router.pathname.split('/')[1];
		switch (true) {
			case nowLastPathName === 'dashboard':
				setPathMonitor((prev) => ({
					...prev,
					isDashboard: true,
					isEngine: false,
					isHistory: false,
				}));
				break;
			case nowLastPathName === 'engine':
				setPathMonitor((prev) => ({
					...prev,
					isDashboard: false,
					isEngine: true,
					isHistory: false,
				}));
				break;
			case nowLastPathName === 'history':
				setPathMonitor((prev) => ({
					...prev,
					isDashboard: false,
					isEngine: false,
					isHistory: true,
				}));
				break;
		}
	}, [router.pathname]);
	return (
		<div className="fixed w-full inset-x-0 bottom-0 bg-[#323232] shadow z-10 max-w-md mx-auto">
			<div className="flex items-center h-16 md:h-12">
				<div className="flex justify-center w-1/3">
					<Link href="/dashboard/">
						<div className="w-9 h-9 relative">
							<Image
								src={DashboardPic}
								sizes="(max-width: 768px) 5vw"
								fill
								className={
									pathMonitor.isDashboard
										? 'contrast-200 brightness-[0.63] object-cover overflow-hidden'
										: 'object-cover overflow-hidden'
								}
								alt="Rank Avatar"
							/>
						</div>
					</Link>
				</div>
				<div className="flex justify-center w-1/3">
					<Link href="/engine/Workout/">
						<div className="w-9 h-9 relative">
							<Image
								src={WorkoutPic}
								sizes="(max-width: 768px) 5vw"
								fill
								className={
									pathMonitor.isEngine
										? 'contrast-200 brightness-[0.63] object-cover overflow-hidden'
										: 'object-cover overflow-hidden'
								}
								alt="Rank Avatar"
							/>
						</div>
					</Link>
				</div>
				<div className="flex justify-center w-1/3">
					<Link href="/history/">
						<div className="w-9 h-9 relative">
							<Image
								src={HistoryPic}
								sizes="(max-width: 768px) 5vw"
								fill
								className={
									pathMonitor.isHistory
										? 'contrast-200 brightness-[0.63] object-cover overflow-hidden'
										: 'object-cover overflow-hidden'
								}
								alt="Rank Avatar"
							/>
						</div>
					</Link>
				</div>
			</div>
		</div>
	);
}
