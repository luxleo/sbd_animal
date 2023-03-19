import Image from 'next/image';
import { useRouter } from 'next/router';
import imageCompression from 'browser-image-compression';

import { useState, useEffect, useRef } from 'react';

import { getUserProfile } from '../../utils/fetch/AuthenticationUtils';
import useUserStore from '../../stores/authentication/useUserStore';
import { editProfile } from '../../utils/fetch/AuthenticationUtils';

export default function EditProfile() {
	const { user, setUser } = useUserStore();
	const fileInputRef = useRef();
	const [profileImage, setProfileImage] = useState(null);
	const [preview, setPreview] = useState(null);
	const [inputVal, setInputVal] = useState({
		username: user.username,
		height: user.height,
		weight: user.weight,
	});
	const router = useRouter();

	const cancleHandler = () => {
		router.replace('/my/profile/');
	};
	const onInputChange = (e) => {
		setInputVal((prev) => ({
			...prev,
			[e.target.name]: e.target.value,
		}));
	};
	const onSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('username', inputVal.username);
		formData.append('weight', inputVal.weight);
		formData.append('height', inputVal.height);
		if (profileImage) {
			formData.append('avatar', profileImage);
		}
		const res = await editProfile(formData);
		console.log(res);
		const renewed_profile = await getUserProfile();
		setUser(renewed_profile.data.user);
		router.push('/my/profile/');
	};

	useEffect(() => {
		if (profileImage) {
			const fileReader = new FileReader();
			fileReader.readAsDataURL(profileImage);
			fileReader.onloadend = () => {
				setPreview(fileReader.result);
			};
		} else {
			setPreview(null);
		}
	}, [profileImage]);
	return (
		<div className="flex flex-col align-center p-2">
			<div>
				<p>프로필 이미지</p>
				{preview ? (
					<div className="w-20 h-20 relative">
						<Image
							src={preview}
							sizes="(max-width: 768px) 5vw"
							fill
							className="object-cover overflow-hidden"
							alt="Rank Avatar"
							onClick={() => {
								setProfileImage(null);
							}}
						/>
					</div>
				) : (
					<button
						className="w-20 h-20 bg-stone-600"
						onClick={(e) => {
							e.preventDefault();
							fileInputRef.current.click();
						}}
					>
						프로필 수정
					</button>
				)}

				<input
					type="file"
					name="avatar"
					style={{ display: 'none' }}
					ref={fileInputRef}
					accept="image/*"
					onChange={async (e) => {
						const selected_img = e.target.files[0];
						if (selected_img && selected_img.type.substr(0, 5) === 'image') {
							const options = {
								maxSizeMB: 1,
								maxWidthOrHeight: 100,
								fileType: 'image/jpeg',
							};
							try {
								const compressedFile = await imageCompression(
									selected_img,
									options
								);
								// compressedFile은 Blob 파일 이므로 다시 이미지 파일로 변환하기
								const compressedImg = new File(
									[compressedFile],
									`${user.email}_avatar.jpeg`,
									{ type: 'image/jpeg' }
								);
								setProfileImage(compressedImg);
							} catch (error) {
								console.log(error);
							}
							//setProfileImage(selected_img);
						} else {
							setProfileImage(null);
						}
					}}
				/>
			</div>
			<form
				className="flex flex-col h-[50%] justify-between"
				onSubmit={onSubmit}
			>
				<div className="flex flex-col">
					<label htmlFor="username" className="mt-2">
						사용자 이름
					</label>
					<input
						type="text"
						id="username"
						name="username"
						className="bg-stone-500"
						onChange={onInputChange}
						placeholder={user.username}
						value={inputVal.username}
						pattern="^[a-zA-Z0-9]{3,20}$"
					/>
					<span>
						이름은 공백없는 영문,숫자로 구성된 3자리 이상 20자리 이하 이어야
						합니다.
					</span>
				</div>
				<div className="flex flex-col">
					<label htmlFor="height" className="mt-2">
						키
					</label>
					<div>
						<input
							type="text"
							id="height"
							name="height"
							className="bg-stone-500 w-1/2 mr-2"
							placeholder={user.height}
							onChange={onInputChange}
							value={inputVal.height}
							pattern="^([1-2]{1})[0-9]{2}$"
						/>
						cm
						<span>
							키는 100cm 이상 300cm 미만의 자연수 혹은 소숫점 1자리의 실수이어야
							합니다.
						</span>
					</div>
				</div>
				<label htmlFor="weight" className="mt-2">
					몸무게
				</label>
				<div>
					<input
						type="text"
						id="weight"
						name="weight"
						className="bg-stone-500 w-1/2 mr-2"
						placeholder={user.weight}
						value={inputVal.weight}
						onChange={onInputChange}
						pattern="^([1-2]{1}[0-9]{2})|([1-2]{1}[0-9]{2}\.[0-9]{0,1})|([4-9]{1}[0-9]{1})|([4-9]{1}[0-9]{1}\.[0-9]{0,1})$"
					/>
					kg
					<span>
						몸무게는 40kg 이상 300kg 미만의 자연수 혹은 소숫점 한자리의
						실수입니다.
					</span>
				</div>

				<button type="submit">제출</button>
			</form>
			<div>
				<button onClick={cancleHandler}>취소</button>
			</div>
			<style jsx>
				{`
					span {
						display: none;
					}
					input:invalid ~ span {
						display: block;
						font-size: 12px;
						padding: 3px;
						color: red;
					}
				`}
			</style>
		</div>
	);
}
