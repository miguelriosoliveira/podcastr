/* eslint-disable import/no-duplicates */
import { format as formatFunc, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export function formatDate(date: Date | string, format: string) {
	const parsedDate = typeof date === 'string' ? parseISO(date) : date;
	return formatFunc(parsedDate, format, { locale: ptBR });
}

export function convertDurationToTimeString(duration: number) {
	const oneHourInSeconds = 60 * 60;

	const hours = Math.floor(duration / oneHourInSeconds);
	const minutes = Math.floor((duration % oneHourInSeconds) / 60);
	const seconds = duration % 60;

	const timeString = [hours, minutes, seconds]
		.map(value => String(value).padStart(2, '0'))
		.join(':');
	return timeString;
}
