import Image from 'next/image';
import Link from 'next/link';
import useUserStore from '../../stores/authentication/useUserStore';

export default function UserProfile() {
	const { user } = useUserStore();

	return (
		<div>
			<div className="relative w-14 h-14 rounded-full overflow-hidden">
				<Image
					src={
						user.avatar_url
							? process.env.NODE_ENV === 'development'
								? process.env.NEXT_PUBLIC_MEDIA_HOST + user.avatar_url
								: user.avatar_url
							: '/rank_avatars/user_default_avatar.jpeg'
					}
					sizes="(max-width: 768px) 5vw"
					fill
					alt="Rank Avatar"
				/>
			</div>
			<div>닉네임: {user.username}</div>
			<div>이메일: {user.email}</div>
			<div>키: {user.height}</div>
			<div>체중: {user.weight}</div>
			<div className="flex justify-center border-t-2 border-stone-400 pt-2">
				<Link href="/my/editprofile/">
					<p className="rounded-md bg-sky-800 inline p-1">수정</p>
				</Link>
			</div>
		</div>
	);
}
