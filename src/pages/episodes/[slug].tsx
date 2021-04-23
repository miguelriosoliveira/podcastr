import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { api } from '../../services/api';
import { convertDurationToTimeString, formatDate } from '../../utils/formatter';

import styles from './episode.module.scss';

interface Episode {
	id: string;
	title: string;
	members: string;
	published_at: string;
	thumbnail: string;
	description: string;
	file: {
		duration: number;
	};
}

interface EpisodeFormatted extends Episode {
	publishedAt: string;
	durationFormatted: string;
}

interface EpisodeProps {
	episode: EpisodeFormatted;
}

export default function EpisodePage({ episode }: EpisodeProps) {
	const router = useRouter();

	return (
		<>
			<Head>
				<title>{episode.title} - Podcastr</title>
			</Head>

			<div className={styles.wrapper}>
				<div className={styles.episode}>
					<div className={styles.thumbnailContainer}>
						<button type="button" onClick={router.back}>
							<img src="/images/arrow-left.svg" alt="Voltar" />
						</button>
						<Image
							src={episode.thumbnail}
							alt={episode.title}
							width={700}
							height={160}
							objectFit="cover"
						/>
						<button type="button">
							<img src="/images/play.svg" alt="Play" />
						</button>
					</div>

					<header>
						<h1>{episode.title}</h1>
						<span>{episode.members}</span>
						<span>{episode.publishedAt}</span>
						<span>{episode.durationFormatted}</span>
					</header>

					<div
						className={styles.description}
						// eslint-disable-next-line react/no-danger
						dangerouslySetInnerHTML={{ __html: episode.description }}
					/>
				</div>
			</div>
		</>
	);
}

export const getStaticPaths: GetStaticPaths = async () => {
	const { data: episodes } = await api.get<Episode[]>('/episodes', {
		params: {
			_limit: 2,
			_sort: 'published_at',
			_order: 'desc',
		},
	});

	const paths = episodes.map(episode => ({ params: { slug: episode.id } }));

	return {
		paths,
		fallback: 'blocking',
	};
};

export const getStaticProps: GetStaticProps<EpisodeProps> = async ({ params: { slug } }) => {
	const { data: episode } = await api.get<Episode>(`/episodes/${slug}`);

	const episodeFormatted = {
		...episode,
		publishedAt: formatDate(episode.published_at, 'd MMM yy'),
		durationFormatted: convertDurationToTimeString(episode.file.duration),
	};

	return {
		props: { episode: episodeFormatted },
		revalidate: 60 * 60 * 24, // 24 hours
	};
};
