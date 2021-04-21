import { GetStaticProps } from 'next';

import { api } from '../services/api';

interface Episode {
	id: string;
	title: string;
	members: string;
	published_at: Date;
	thumbnail: string;
	description: string;
	file: {
		url: string;
		type: string;
		duration: number;
	};
}

interface Props {
	episodes: Episode[];
}

export default function Home({ episodes }: Props) {
	return <div>{JSON.stringify(episodes)}</div>;
}

export const getStaticProps: GetStaticProps = async () => {
	const { data: episodes } = await api.get('/episodes');
	return {
		props: { episodes },
		revalidate: 60 * 60 * 8,
	};
};
