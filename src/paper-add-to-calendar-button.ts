import { css, customElement, html, LitElement, property, query } from 'lit-element';

import '@polymer/iron-icon';
import '@polymer/paper-menu-button';
import { PaperMenuButton } from '@polymer/paper-menu-button';

import * as Utils from './calendar-utils';
import { CALENDAR_ICONSET } from './icons';

export interface CalendarEvent {
	attendees?: string[];
	description?: string;
	duration?: number;
	end?: string;
	/**
	 * https://icalendar.org/iCalendar-RFC-5545/3-8-5-3-recurrence-rule.html
	 */
	rrule?: string;
	location?: string;
	organizer?: string[];
	start: string;
	title: string;
}

interface Option {
	href: (event: CalendarEvent) => string;
	icon: string;
	label: string;
	target?: string;
}

const OPTIONS: Option[] = [
	{
		href: (event: CalendarEvent) => Utils.computeGoogle(event),
		icon: 'calendar:google',
		label: 'Google',
		target: '_blank',
	},
	{
		href: (event: CalendarEvent) => Utils.computeYahoo(event),
		icon: 'calendar:yahoo',
		label: 'Yahoo',
		target: '_blank',
	},
	{
		href: (event: CalendarEvent) => Utils.computeIcs(event),
		icon: 'calendar:apple',
		label: 'iCal',
	},
	{
		href: (event: CalendarEvent) => Utils.computeIcs(event),
		icon: 'calendar:outlook',
		label: 'Outlook',
	},
];

/**
 * Button that allows downloading an event into various calendars
 */
@customElement('paper-add-to-calendar-button')
export class PaperAddToCalendarButton extends LitElement {
	@property({type: String})
	public actionText: string = 'Add to calendar';

	@property({type: Object})
	public event?: CalendarEvent;

	@query('#menu')
	private menuEl?: PaperMenuButton;

	static get styles() {
		return css`
			:host {
				display: inline-block;
			}
			paper-menu-button {
				--paper-menu-button-content: {
					border-radius: 5px;
				}
				padding: 0;
			}
			.trigger-button {
				color: var(--paper-add-to-calendar-button-button-color);
				vertical-align: top;
			}
			.trigger-button:hover {
				text-decoration: underline;
			}
			.actions {
				padding: 8px 0;
				text-align: left;
				min-width: 120px;
			}
			.actions iron-icon {
				filter: var(--paper-add-to-calendar-button-cal-icon-filter);
				margin-right: 8px;
			}
			.action {
				display: block;
				padding: 8px 16px;
				cursor: pointer;
				color: var(--paper-add-to-calendar-button-action-color, initial);
				text-decoration: none;
				line-height: 24px;
			}
			.action:hover {
				background: var(--paper-add-to-calendar-button-action-hover-background-color, lightgray);
			}
		`;
	}

	protected render() {
		return html`
			${CALENDAR_ICONSET}
			<paper-menu-button id="menu" vertical-offset="24">
				<a slot="dropdown-trigger" class="trigger-button">
					${this.actionText}
				</a>
				<div class="actions" slot="dropdown-content">
					${OPTIONS.map(option => html`
						<div
							class="action"
							@tap="${() => this.onTapOption(option)}">
							<iron-icon .icon="${option.icon}"></iron-icon> ${option.label}
						</div>
					`)}
				</div>
			</paper-menu-button>
		`;
	}

	private onTapOption(option: Option) {
		this.menuEl!.close();

		const url = option.href(this.event!);
		if (!option.target) {
			window.location.href = url;
		} else {
			window.open(url, option.target);
		}
	}
}
