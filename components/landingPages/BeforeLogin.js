import { useState, useEffect } from 'react';
import Image from 'next/image';
import useAuthStore from '../../stores/authentication/useAuthStore';
import useUserStore from '../../stores/authentication/useUserStore';

import mousePic from '../../public/rank_avatars/avatar_rat.png';
import rabbitPic from '../../public/rank_avatars/avatar_rabbit.png';
import foxPic from '../../public/rank_avatars/avatar_fox.png';
import wolfPic from '../../public/rank_avatars/avatar_wolf.png';
import tigerPic from '../../public/rank_avatars/avatar_tiger.png';
import dragonPic from '../../public/rank_avatars/avatar_dragon.png';
import doorPic from '../../public/login_door.jpg';
import LoginModal from './modals/LoginModal';
import SignUpModal from './modals/SignUpModal';

export default function BeforeLogin() {
	const [curAvatar, setCurAvatar] = useState({
		photo: wolfPic,
		percentile: 50,
		comment: 'Lone wolf!!',
		name: 'wolf',
	});
	// -- store
	const [curState, setCurState] = useState('');
	const { authState, setAuthState } = useAuthStore();
	const { resetUser } = useUserStore();
	// --Event Handler functions
	const changeMsg = (num) => {
		let iterNum = num % 3;
		let msgDiv = document.getElementById('msg');
		if (msgDiv !== null) {
			msgDiv.innerHTML = msg_list[iterNum];
			num++;
			setTimeout(changeMsg, 1600, num);
		} else {
			return;
		}
	};
	const clickAvatar = (key) => {
		//setCurAvatar(avatar_source[key]);
		const new_obj = { ...avatar_source[key] };
		setCurAvatar((prev) => {
			return {
				...prev,
				photo: new_obj['photo'],
				name: new_obj['name'],
				percentile: new_obj['percentile'],
				comment: new_obj['comment'],
			};
		});
	};
	const clickLoginDoor = () => {
		setCurState('login');
	};
	//-- head message, and avatar variable
	const msg_list = ['EVOLVE!', 'BE STRONGER', '\uD83D\uDCAA'];
	const avatar_source = {
		mouse: {
			photo: mousePic,
			percentile: 0,
			comment: 'Delicious mouse! ',
			name: 'mouse',
		},

		rabbit: {
			photo: rabbitPic,
			percentile: 5,
			comment: 'Go!!, Crazy rabbit',
			name: 'rabbit',
		},
		fox: {
			photo: foxPic,
			percentile: 20,
			comment: 'Sexy Fox! ',
			name: 'fox',
		},
		wolf: {
			photo: wolfPic,
			percentile: 50,
			comment: 'Lone wolf!!',
			name: 'wolf',
		},
		tiger: {
			photo: tigerPic,
			percentile: 80,
			comment: 'King!!, may be in my hood...',
			name: 'tiger',
		},
		dragon: {
			photo: dragonPic,
			percentile: 95,
			comment: 'Legendary',
			name: 'dragon',
		},
	};
	//-- make Avatar choice
	const sideBarChildren = [];
	for (const key in avatar_source) {
		sideBarChildren.push(
			<div
				key={`${key}`}
				className={`w-10 h-10 relative `}
				onClick={() => {
					clickAvatar(key);
				}}
			>
				<Image
					src={avatar_source[`${key}`].photo}
					fill
					sizes="(max-width: 768px) 100vw"
					className={`rounded-full ${
						curAvatar.name === key ? 'ring-4 ring-orange-300' : ''
					}`}
					alt="Rank Avatar"
					priority
				/>
			</div>
		);
	}
	useEffect(() => {
		changeMsg(4);
		resetUser();
	}, []);
	return (
		<div className="flex flex-col h-screen px-5 pb-5">
			<div
				id="msg"
				className="basis-1/12 text-center pt-2 border-white border-2"
			>
				{msg_list[0]}
			</div>
			<div
				id="rank_avatar"
				className="flex justify-center items-center basis-5/12 border-white border-2"
			>
				<div className="w-52 h-52 relative ">
					<Image
						src={curAvatar.photo}
						fill
						sizes="(max-width: 768px) 100vw"
						alt="Rank Avatar"
						priority
					/>
				</div>
			</div>
			<div
				id="rank_slide_bar"
				className="flex justify-between px-3 basis-1/12 border-white border-2"
			>
				{sideBarChildren}
			</div>
			<div id="rank_slide_bar" className="basis-1/12 border-white border-2">
				<p className="text-sm px-3">Percentile: {curAvatar.percentile}%</p>
				<p className="text-xl px-3">{curAvatar.comment}</p>
			</div>
			<div className="flex justify-center basis-1/12 border-white border-2 static pt-3">
				<div>
					<div
						onClick={() => {
							clickLoginDoor();
						}}
						className="w-12 h-12 relative"
					>
						<Image
							src={doorPic}
							fill
							sizes="(max-width: 768px) 5vw"
							className="rounded-full"
							alt="Rank Avatar"
							priority
						/>
					</div>
				</div>
			</div>
			{curState === 'login' ? (
				<LoginModal fn={setCurState} fn_store={setAuthState} />
			) : curState === 'register' ? (
				<SignUpModal fn={setCurState} fn_store={setAuthState} />
			) : null}
			<div className="basis-1/12"></div>
		</div>
	);
}
