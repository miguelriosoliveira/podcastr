import { createContext, ReactNode, useContext, useState } from 'react';

import { getRandomInt } from '../utils/random';

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
	hasNext: boolean;
	hasPrevious: boolean;
	isLooping: boolean;
	isShuffling: boolean;
	play: (episode: Episode) => void;
	playList: (list: Episode[], index: number) => void;
	togglePlay: () => void;
	toggleLoop: () => void;
	toggleShuffle: () => void;
	playNext: () => void;
	playPrevious: () => void;
	setPlayingState: (state: boolean) => void;
	clearPlayerState: () => void;
}

interface PlayerProviderProps {
	children: ReactNode;
}

const PlayerContext = createContext({} as PlayerContextData);

export function PlayerProvider({ children }: PlayerProviderProps) {
	const [episodeList, setEpisodeList] = useState([]);
	const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLooping, setIsLooping] = useState(false);
	const [isShuffling, setIsShuffling] = useState(false);

	function play(episode: Episode) {
		setEpisodeList([episode]);
		setCurrentEpisodeIndex(0);
		setIsPlaying(true);
	}

	function playList(list: Episode[], index: number) {
		setEpisodeList(list);
		setCurrentEpisodeIndex(index);
		setIsPlaying(true);
	}

	function togglePlay() {
		setIsPlaying(!isPlaying);
	}

	function toggleLoop() {
		setIsLooping(!isLooping);
	}

	function toggleShuffle() {
		setIsShuffling(!isShuffling);
	}

	function setPlayingState(state: boolean) {
		setIsPlaying(state);
	}

	function clearPlayerState() {
		setEpisodeList([]);
		setCurrentEpisodeIndex(0);
	}

	const hasPrevious = isShuffling || currentEpisodeIndex > 0;

	function playPrevious() {
		if (isShuffling) {
			const nextRandomIndex = getRandomInt(0, episodeList.length - 1);
			setCurrentEpisodeIndex(nextRandomIndex);
		} else if (hasPrevious) {
			setCurrentEpisodeIndex(currentEpisodeIndex - 1);
		}
	}

	const hasNext = isShuffling || currentEpisodeIndex < episodeList.length - 1;

	function playNext() {
		if (isShuffling) {
			const nextRandomIndex = getRandomInt(0, episodeList.length - 1);
			setCurrentEpisodeIndex(nextRandomIndex);
		} else if (hasNext) {
			setCurrentEpisodeIndex(currentEpisodeIndex + 1);
		}
	}

	return (
		<PlayerContext.Provider
			value={{
				episodeList,
				currentEpisodeIndex,
				isPlaying,
				togglePlay,
				setPlayingState,
				playList,
				play,
				playPrevious,
				playNext,
				hasNext,
				hasPrevious,
				toggleLoop,
				isLooping,
				isShuffling,
				toggleShuffle,
				clearPlayerState,
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
