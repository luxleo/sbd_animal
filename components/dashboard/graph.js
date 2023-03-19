import {
	ResponsiveContainer,
	AreaChart,
	XAxis,
	YAxis,
	Area,
	Tooltip,
	CartesianGrid,
} from 'recharts';

import { format, parseISO } from 'date-fns';

export default function Graph({ data, field }) {
	return (
		<ResponsiveContainer
			width="100%"
			aspect={1.8}
			margin={{
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
			}}
		>
			<AreaChart
				data={data}
				width="100%"
				margin={{ top: 0, right: 0, bottom: 0, left: -30 }}
			>
				<defs>
					<linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#2451B7" stopOpacity={0.6} />
						<stop offset="50%" stopColor="#2451B7" stopOpacity={0.4} />
						<stop offset="75%" stopColor="#2451B7" stopOpacity={0.2} />
					</linearGradient>
				</defs>
				<Area dataKey={`${field}`} stroke="#2451B7" fill="url(#color)" />
				{/* <XAxis dataKey="created_at" axisLine={false} tickLine={false} /> */}
				<YAxis
					datakey={`${field}`}
					axisLine={false}
					tickLine={false}
					domain={field === 'percentile' ? [0, 100] : [0, 300]}
					ticks={field === 'percentile' ? [5, 20, 50, 80, 95] : null}
					style={{
						fontSize: '0.7rem',
					}}
				/>
				<CartesianGrid vertical={false} opacity={0.1} />
				<Tooltip content={<MyToolTip />} />
			</AreaChart>
		</ResponsiveContainer>
	);
}

function MyToolTip({ active, payload }) {
	if (active) {
		const data = payload[0].payload;
		return (
			<div className="rounded-md bg-[#26313c] text-stone-100 text-xs shadow-inner shadow-stone-700 p-1">
				<h3>{format(parseISO(data.created_at), 'd MMM, yyyy')}</h3>
				<p>백분위: {data.percentile}%</p>
				<p>1RM: {data.max_1rm}</p>
				<p>체중: {data.body_weight}kg</p>
			</div>
		);
	}
	return null;
}
