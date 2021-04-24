import Image from 'next/image';
import Slider from 'rc-slider';
import { useEffect, useRef, useState } from 'react';

import { usePlayer } from '../../hooks/usePlayer';
import { convertDurationToTimeString } from '../../utils/formatter';

import styles from './styles.module.scss';

import 'rc-slider/assets/index.css';

export function Player() {
	const {
		episodeList,
		currentEpisodeIndex,
		isPlaying,
		togglePlay,
		setPlayingState,
		playNext,
		playPrevious,
		hasNext,
		hasPrevious,
		toggleLoop,
		isLooping,
		isShuffling,
		toggleShuffle,
		clearPlayerState,
	} = usePlayer();

	const audioRef = useRef<HTMLAudioElement>(null);

	const [progress, setProgress] = useState(0);

	useEffect(() => {
		if (!audioRef.current) {
			return;
		}

		if (isPlaying) {
			audioRef.current.play();
		} else {
			audioRef.current.pause();
		}
	}, [isPlaying]);

	const episode = episodeList[currentEpisodeIndex];

	function handleTimeUpdate() {
		const currentTime = Math.floor(audioRef.current.currentTime);
		setProgress(currentTime);
	}

	function handleChangeTime(value: number) {
		audioRef.current.currentTime = value;
		setProgress(value);
	}

	function handleLoadMetadata() {
		audioRef.current.currentTime = 0;
	}

	function handleEpisodeEnded() {
		if (hasNext) {
			playNext();
		} else {
			clearPlayerState();
		}
	}

	return (
		<div className={styles.playerContainer}>
			<header>
				<img src="/images/playing.svg" alt="Tocando agora" />
				<strong>Tocando agora</strong>
			</header>

			{episode ? (
				<div className={styles.currentEpisode}>
					<Image
						src={episode.thumbnail}
						alt={episode.title}
						width={592}
						height={592}
						objectFit="cover"
					/>
					<strong>{episode.title}</strong>
					<span>{episode.members}</span>
				</div>
			) : (
				<div className={styles.emptyPlayer}>
					<strong>Selecione um podcast para ouvir</strong>
				</div>
			)}

			<footer className={!episode ? styles.empty : ''}>
				<div className={styles.progress}>
					<span>{convertDurationToTimeString(progress)}</span>
					<div className={styles.slider}>
						{episode ? (
							<Slider
								trackStyle={{ backgroundColor: '#04d361' }}
								handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
								railStyle={{ backgroundColor: '#9f75ff' }}
								min={0}
								max={episode.duration}
								value={progress}
								onChange={handleChangeTime}
							/>
						) : (
							<div className={styles.emptySlider} />
						)}
					</div>
					<span>{convertDurationToTimeString(episode?.duration || 0)}</span>
				</div>

				{episode && (
					// eslint-disable-next-line jsx-a11y/media-has-caption
					<audio
						ref={audioRef}
						autoPlay
						loop={isLooping}
						src={episode.url}
						onPlay={() => setPlayingState(true)}
						onPause={() => setPlayingState(false)}
						onTimeUpdate={handleTimeUpdate}
						onEnded={handleEpisodeEnded}
						onLoadedMetadata={handleLoadMetadata}
					>
						Your browser does not support the <code>audio</code> element.
					</audio>
				)}

				<div className={styles.buttons}>
					<button
						type="button"
						disabled={!episode || episodeList.length === 1}
						onClick={toggleShuffle}
						className={episodeList.length > 1 && isShuffling ? styles.isActive : ''}
					>
						<img src="/images/shuffle.svg" alt="Aleatório" />
					</button>

					<button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
						<img src="/images/play-previous.svg" alt="Anterior" />
					</button>

					<button
						type="button"
						className={styles.playButton}
						disabled={!episode}
						onClick={togglePlay}
					>
						{isPlaying ? (
							<img src="/images/pause.svg" alt="Pause" />
						) : (
							<img src="/images/play.svg" alt="Play" />
						)}
					</button>

					<button type="button" disabled={!episode || !hasNext} onClick={playNext}>
						<img src="/images/play-next.svg" alt="Próximo" />
					</button>

					<button
						type="button"
						disabled={!episode}
						onClick={toggleLoop}
						className={isLooping ? styles.isActive : ''}
					>
						<img src="/images/repeat.svg" alt="Repetir" />
					</button>
				</div>
			</footer>
		</div>
	);
}
