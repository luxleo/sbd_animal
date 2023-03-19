import { calc_one_rep_max } from '../../../../utils/calculate/RepCalculation';

export default function HistoryRep({ repData }) {
	return (
		<div className="flex w-full bg-stone-800 border-stone-700 h-10 border-2 border-t-0 pt-1 md:h-6">
			<div className="w-1/5 text-center">{repData.rep_order_number}</div>
			<div className="w-1/5 text-center">{repData.workout_weight}</div>
			<div className="w-1/5 text-center">{repData.reps}</div>
			<div className="w-1/5 text-center">{repData.calorie}</div>
			<div className="w-1/5 text-center">
				{calc_one_rep_max(repData.reps, repData.workout_weight)}
			</div>
		</div>
	);
}
