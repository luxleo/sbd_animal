import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import HistoryDetail from '../../components/display/history/Detail/HistoryDetail';
import { detailLog } from '../../utils/fetch/workout/log';

export default function HistoryDetailPage() {
	const [logDetailData, setLogDetailData] = useState(null);
	const router = useRouter();

	const getLogDetail = async (id) => {
		const res = await detailLog(id).then((res) => {
			setLogDetailData(res);
		});
	};
	useEffect(() => {
		const { id: currentLogParam } = router.query;
		getLogDetail(currentLogParam);
	}, []);

	return (
		<div>
			{!logDetailData && <h1>Loading ... </h1>}
			{logDetailData ? (
				<HistoryDetail log={logDetailData.log} reps={logDetailData.reps} />
			) : null}
		</div>
	);
}
