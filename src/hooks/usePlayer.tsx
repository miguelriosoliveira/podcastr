import { createContext, ReactElement, useContext, useState } from 'react';

interface Episode {
	title: string;
	members: string;
	thumbnail: string;
	duration: number;
	url: string;
}

interface PlayerContextData {
	episodeList: Episode[];
	currentEpisodeIndex: number;
	isPlaying: boolean;
	play: (episode: Episode) => void;
	togglePlay: () => void;
	setPlayingState: (state: boolean) => void;
}

interface PlayerProviderProps {
	children: ReactElement;
}

const PlayerContext = createContext({} as PlayerContextData);

export function PlayerProvider({ children }: PlayerProviderProps) {
	const [episodeList, setEpisodeList] = useState([]);
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	function play(episode: Episode) {
		setEpisodeList([episode]);
		setCurrentEpisodeIndex(0);
		setIsPlaying(true);
	}

	function togglePlay() {
		setIsPlaying(!isPlaying);
	}

	function setPlayingState(state: boolean) {
		setIsPlaying(state);
	}

	return (
		<PlayerContext.Provider
			value={{
				episodeList,
				currentEpisodeIndex,
				isPlaying,
				togglePlay,
				setPlayingState,
				play,
			}}
		>
			{children}
		</PlayerContext.Provider>
	);
}

export function usePlayer() {
	const context = useContext(PlayerContext);
	return context;
}
