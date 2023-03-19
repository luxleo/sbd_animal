
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { listLog } from '../../utils/fetch/workout/log';
import mousePic from '../../public/rank_avatars/avatar_rat.png';
import rabbitPic from '../../public/rank_avatars/avatar_rabbit.png';
import foxPic from '../../public/rank_avatars/avatar_fox.png';
import wolfPic from '../../public/rank_avatars/avatar_wolf.png';
import tigerPic from '../../public/rank_avatars/avatar_tiger.png';
import dragonPic from '../../public/rank_avatars/avatar_dragon.png';

import HistoryCard from '../../components/display/history/List/HistoryCard';

/**
 * log의 percentile에 맞는 랭크 이미지 반환
 * @param {Float} percentile
 * @returns
 */
const getRankImage = (percentile) => {
	const numPercentile = Number(percentile);
	switch (true) {
		case numPercentile < 5:
			return mousePic;
			break;
		case numPercentile < 20:
			return rabbitPic;
			break;
		case numPercentile < 50:
			return foxPic;
			break;

		case numPercentile < 80:
			return wolfPic;
			break;
		case numPercentile < 95:
			return tigerPic;
			break;
		case numPercentile < 101:
			return dragonPic;
			break;
	}
};

export default function HistoryList() {
	const [logs, setLogs] = useState([]);
	const getLogs = async () => {
		const res = await listLog().then((res) => {
			setLogs(res.data.results);
			return res;
		});
	};
	useEffect(() => {
		if (logs.length === 0) {
			getLogs();
		}
	}, []);
	return (
		<div className="h-screen flex items-center justify-center">
			<div className="max-h-[80%] overflow-y-auto w-full">
				{logs?.map((log) => {
					const rankPictures = getRankImage(log.percentile);
					return (
						<Link href={`/history/${log.id}`} key={log.id}>
							<HistoryCard log={log} pic={rankPictures} />
						</Link>
					);
				})}
			</div>
		</div>
	);
}
