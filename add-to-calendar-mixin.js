export const AddToCalendarMixin = parent => class AddToCalendarMixinImpl extends parent {
	computeGoogle(title, start, end, duration, description, location) {
		const startTime = this.formatTime(start);
		const endTime = this.calculateEndTime(end, start, duration);

		return encodeURI([
			'https://www.google.com/calendar/render',
			'?action=TEMPLATE',
			`&text=${title || ''}`,
			`&dates=${startTime || ''}`,
			`/${endTime || ''}`,
			`&details=${description || ''}`,
			`&location=${location || ''}`,
			'&sprop=&sprop=name:'
		].join(''));
	}

	computeYahoo(title, start, end, duration, description, location) {
		if (!start) {
			return undefined;
		}

		const MIN_IN_MILLISEC = 60 * 1000;
		const eventDuration = end ? (new Date(end).getTime() - new Date(start).getTime()) / MIN_IN_MILLISEC : duration;

		// Convert the duration from minutes to hhmm (Yahoo format)
		const yahooHourDuration = this._padZeros(eventDuration / 60);
		const yahooMinuteDuration = this._padZeros(eventDuration % 60);
		const yahooEventDuration = `${yahooHourDuration}${yahooMinuteDuration}`;

		// Remove timezone from event time
		const st = this.formatTime(start) || '';

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

	computeIcs(title, start, end, duration, description, location) {
		const startTime = this.formatTime(start);
		const endTime = this.calculateEndTime(end, start, duration);

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

	formatTime(date) {
		if (!date) {
			return undefined;
		}

		return new Date(date).toISOString().replace(/-|:|\.\d+/g, '');
	}

	calculateEndTime(end, start, duration) {
		if (!start || !duration) {
			// Wait until required fields are set
			return undefined;
		}

		const MIN_IN_MILLISEC = 60 * 1000;
		const durationMiliSec = duration * MIN_IN_MILLISEC;
		const _end = end || new Date(new Date(start).getTime() + durationMiliSec);
		return this.formatTime(_end);
	}

	_padZeros(value) {
		return `00${Math.floor(value)}`.slice(-2);
	}
};
