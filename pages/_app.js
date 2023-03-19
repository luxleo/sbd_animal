import { Nanum_Gothic } from '@next/font/google';
import BaseLayout from '../components/Base';
import ErrorBoundary from '../components/ErrorBoundary';
import '../styles/globals.css';

const nanum = Nanum_Gothic({
	subsets: ['latin'],
	weight: ['400'],
});

function MyApp({ Component, pageProps }) {
	return (
		<main className={nanum.className}>
			<ErrorBoundary>
				<BaseLayout>
					<Component {...pageProps} />
				</BaseLayout>
			</ErrorBoundary>
		</main>
	);
}

export default MyApp;
