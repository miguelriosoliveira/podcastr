import Link from 'next/link';

import { formatDate } from '../../utils/formatter';

import styles from './styles.module.scss';

export function Header() {
	const currentDate = formatDate(new Date(), 'EEEEEE, d MMMM');

	return (
		<header className={styles.headerContainer}>
			<Link href="/">
				<img src="/images/logo.svg" alt="Podcastr" />
			</Link>
			<p>O melhor para você ouvir, sempre</p>
			<span>{currentDate}</span>
		</header>
	);
}
