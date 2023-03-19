import * as tf from '@tensorflow/tfjs';

import create from 'zustand';

const useTensorflowStore = create((set, get) => ({
	HawkEye: null,
	loadHawkEye: async () => {
		const modelPath = '/mymodel/hwakeyeJS/model.json';
		const model = await tf.loadLayersModel(modelPath);
		// warming up model
		const sample = tf.tensor2d([[0.32857143, 0.2575, 2]]);
		const preds = model.predict(sample).array();

		//memory disallocation
		tf.dispose(sample);
		tf.dispose(preds);
		set((state) => ({
			HawkEye: model,
		}));
	},
	getHawkEye: () => get().HawkEye,
}));

export default useTensorflowStore;
