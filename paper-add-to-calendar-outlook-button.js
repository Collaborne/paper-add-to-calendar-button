import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon';

import { AddToCalendarMixin } from './add-to-calendar-mixin.js';
import './icons.js';
import './styles.js';

class PaperAddToCalendarOutlookButton extends AddToCalendarMixin(PolymerElement) {
	static get template() {
		return html`
		<style include="add-to-calendar-styles">
			:host {
				--button-color: #0072c6;
			}
		</style>
		<a href="[[computeIcs(title, start, end, duration, description, location)]]">
			<iron-icon icon="calendar:outlook"></iron-icon>
			[[actionText]]
		</a>`;
	}

	static get is() {
		return 'paper-add-to-calendar-outlook-button';
	}

	static get properties() {
		return {
			title: String,
			start: Date,
			end: Date,
			duration: Number,
			description: String,
			location: String,

			actionText: {
				type: String,
				value: 'Outlook Calendar',
			},
		};
	}
}

window.customElements.define(PaperAddToCalendarOutlookButton.is, PaperAddToCalendarOutlookButton);
