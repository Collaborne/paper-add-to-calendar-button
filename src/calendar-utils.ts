import { CalendarEvent } from './paper-add-to-calendar-button';

const DEFAULT_DURATION = 60;

export function computeGoogle({title, start, end, duration, description, location}: CalendarEvent) {
	const startTime = formatTime(start);
	const endTime = calculateEndTime(end, start, duration);

	return encodeURI([
		'https://www.google.com/calendar/render',
		'?action=TEMPLATE',
		`&text=${title}`,
		`&dates=${startTime || ''}`,
		`/${endTime || ''}`,
		`&details=${description || ''}`,
		`&location=${location || ''}`,
		'&sprop=&sprop=name:',
	].join(''));
}

export function computeYahoo({title, start, end, duration, description, location}: CalendarEvent) {
	const MIN_IN_MILLISEC = 60 * 1000;
	const eventDuration = end ? (new Date(end).getTime() - new Date(start).getTime()) / MIN_IN_MILLISEC : duration || DEFAULT_DURATION;

	// Convert the duration from minutes to hhmm (Yahoo format)
	const yahooHourDuration = padZeros(eventDuration / 60);
	const yahooMinuteDuration = padZeros(eventDuration % 60);
	const yahooEventDuration = `${yahooHourDuration}${yahooMinuteDuration}`;

	// Remove timezone from event time
	const st = formatTime(start) || '';

	const params = [
		'http://calendar.yahoo.com/?v=60&view=d&type=20',
		`&title=${title || ''}`,
		`&st=${st}`,
		`&dur=${yahooEventDuration || ''}`,
		`&desc=${description || ''}`,
		`&in_loc=${location || ''}`,
	];

	return encodeURI(params.join(''));
}

export function computeIcs({title, start, end, duration, description, location}: CalendarEvent) {
	const startTime = formatTime(start);
	const endTime = calculateEndTime(end, start, duration);

	const params = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'BEGIN:VEVENT',
		`DTSTART:${startTime || ''}`,
		`DTEND:${endTime || ''}`,
		`SUMMARY:${title || ''}`,
		`DESCRIPTION:${description || ''}`,
		`LOCATION:${location || ''}`,
		'END:VEVENT',
		'END:VCALENDAR',
	];

	return encodeURI(`data:text/calendar;charset=utf8,${params.join('\n')}`);
}

function formatTime(date: string | undefined) {
	if (!date) {
		return undefined;
	}

	return new Date(date).toISOString().replace(/-|:|\.\d+/g, '');
}

function calculateEndTime(end: string | undefined, start: string, duration: number | undefined) {
	if (end) {
		return formatTime(end);
	}

	if (!duration) {
		// Wait until required fields are set
		return undefined;
	}

	const MIN_IN_MILLISEC = 60 * 1000;
	const durationMiliSec = duration * MIN_IN_MILLISEC;
	const calcEnd = new Date(new Date(start).getTime() + durationMiliSec).toISOString();
	return formatTime(calcEnd);
}

function padZeros(value: number | undefined) {
	return `00${Math.floor(value || 0)}`.slice(-2);
}
