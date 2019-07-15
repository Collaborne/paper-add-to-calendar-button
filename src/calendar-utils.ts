import { CalendarEvent } from './paper-add-to-calendar-button';

const DEFAULT_DURATION = 60;

export function computeGoogle(event: CalendarEvent) {
	const startTime = formatTime(event.start);
	const endTime = calculateEndTime(event.end, event.start, event.duration || DEFAULT_DURATION);

	const params = [
		'https://www.google.com/calendar/render',
		'?action=TEMPLATE',
		`&text=${event.title}`,
		`&dates=${startTime || ''}`,
		`/${endTime || 'undefined'}`,
		`&details=${event.description || ''}`,
		`&location=${location || ''}`,
		'&sprop=&sprop=name:',
	];

	if (event.rrule) {
		params.push(`&recur=RRULE:${event.rrule}`);
	}
	(event.attendees || []).forEach(attendee => {
		params.push(`&add=${attendee.email}`);
	});

	return encodeURI(params.join(''));
}

export function computeYahoo(event: CalendarEvent) {
	const MIN_IN_MILLISEC = 60 * 1000;
	const eventDuration = event.end ? (new Date(event.end).getTime() - new Date(event.start).getTime()) / MIN_IN_MILLISEC : event.duration || DEFAULT_DURATION;

	// Convert the duration from minutes to hhmm (Yahoo format)
	const yahooHourDuration = padZeros(eventDuration / 60);
	const yahooMinuteDuration = padZeros(eventDuration % 60);
	const yahooEventDuration = `${yahooHourDuration}${yahooMinuteDuration}`;

	// Remove timezone from event time
	const st = formatTime(event.start) || '';

	const params = [
		'http://calendar.yahoo.com/?v=60&view=d&type=20',
		`&title=${event.title || ''}`,
		`&st=${st}`,
		`&dur=${yahooEventDuration || ''}`,
		`&desc=${event.description || ''}`,
		`&in_loc=${location || ''}`,
	];

	return encodeURI(params.join(''));
}

export function computeIcs(event: CalendarEvent) {
	const startTime = formatTime(event.start);
	const endTime = calculateEndTime(event.end, event.start, event.duration);
	const description = event.description ? event.description.replace(/\n/g, '\\n') : '';

	const params = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'BEGIN:VEVENT',
		`DTSTART:${startTime || ''}`,
		`DTEND:${endTime || ''}`,
		`SUMMARY:${event.title || ''}`,
		`DESCRIPTION:${description}`,
		`LOCATION:${location || ''}`,
	];

	if (event.rrule) {
		params.push(`RRULE:${event.rrule}`);
	}

	if (event.organizer) {
		params.push(`ORGANIZER:MAILTO:${event.organizer}`);
	}

	(event.attendees || []).forEach(attendee => {
		params.push(`ATTENDEE;ROLE=REQ-PARTICIPANT;CN=${attendee.name}:MAILTO:${attendee.email}`);
	});

	params.push(...[
		'END:VEVENT',
		'END:VCALENDAR',
	]);

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
