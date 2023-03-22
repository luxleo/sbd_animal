import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';

import useAuthStore from '../../../stores/authentication/useAuthStore';
import useUserStore from '../../../stores/authentication/useUserStore';

function classNames(...classes) {
	return classes.filter(Boolean).join(' ');
}

async function LogoutAPI() {
	const url = process.env.NEXT_PUBLIC_HOST + 'accounts/logout/';
	const res = await axios.get(url);
	return res;
}

export default function HeadNav() {
	const router = useRouter();
	const { setUpdateCount, getAuthState, asyncUpdateCount } = useAuthStore();
	const { getUser } = useUserStore();
	const user = getUser();
	return (
		<Disclosure
			as="nav"
			className="bg-[#323232] fixed top-0 w-full inset-x-0 max-w-md mx-auto"
		>
			{({ open }) => (
				<div>
					<div className="relative flex h-16 items-center justify-between pl-2 md:h-12">
						<div className="flex flex-1 items-stretch justify-start">
							<Link href="/">
								<div className="w-20 h-12 relative">
									<Image
										src="/navbarIcon/IMG_0514.PNG"
										sizes="(max-width: 768px) 5vw"
										fill
										placeholder="logo"
										className="object-cover overflow-hidden"
										alt="Rank Avatar"
										priority
									/>
								</div>
							</Link>
						</div>
						<div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
							<Menu as="div" className="relative mr-3">
								<div>
									<Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 ">
										<span className="sr-only">Open user menu</span>
										<Image
											className="h-12 w-12 rounded-full md:h-8 md:w-8 "
											src={
												user.avatar_url
													? process.env.NODE_ENV === 'development'
														? process.env.NEXT_PUBLIC_MEDIA_HOST +
														  user.avatar_url
														: user.avatar_url
													: '/rank_avatars/user_default_avatar.jpeg'
											}
											width={12}
											height={12}
											priority
											alt="userProfile"
										/>
									</Menu.Button>
								</div>
								<Transition
									as={Fragment}
									enter="transition ease-out duration-100"
									enterFrom="transform opacity-0 scale-95"
									enterTo="transform opacity-100 scale-100"
									leave="transition ease-in duration-75"
									leaveFrom="transform opacity-100 scale-100"
									leaveTo="transform opacity-0 scale-95"
								>
									<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
										<Menu.Item>
											{({ active }) => (
												<Link href="/my/profile">
													<p
														className={classNames(
															active ? 'bg-gray-100' : '',
															'block px-4 py-2 text-sm text-gray-700'
														)}
													>
														프로필
													</p>
												</Link>
											)}
										</Menu.Item>
										<Menu.Item>
											{({ active }) => (
												<Link href="/bulletinBoard">
													<p
														href="#"
														className={classNames(
															active ? 'bg-gray-100' : '',
															'block px-4 py-2 text-sm text-gray-700'
														)}
													>
														게시판
													</p>
												</Link>
											)}
										</Menu.Item>
										<Menu.Item>
											{({ active }) => (
												<p
													className={classNames(
														active ? 'bg-gray-100' : '',
														'block px-4 py-2 text-sm text-gray-700'
													)}
													onClick={async () => {
														await asyncUpdateCount(); //not authenticate인 경우 방지 위해 호출
														if (getAuthState() === 'authenticated') {
															await LogoutAPI(); // BaseLayout rerender위해 호출
															setUpdateCount(); // authState = 'none'으로 할당
															router.push('/');
														} else {
															router.push('/');
														}
													}}
												>
													로그아웃
												</p>
											)}
										</Menu.Item>
									</Menu.Items>
								</Transition>
							</Menu>
						</div>
					</div>
				</div>
			)}
		</Disclosure>
	);
}
