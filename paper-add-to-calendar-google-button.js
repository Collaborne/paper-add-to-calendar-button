import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon';

import {AddToCalendarMixin} from './add-to-calendar-mixin.js';
import './icons.js';
import './styles.js';

class PaperAddToCalendarGoogleButton extends AddToCalendarMixin(PolymerElement) {
	static get template() {
		return html`
		<style include="add-to-calendar-styles">
			:host {
				--button-color: #5491f5;
			}
		</style>
		<a href="[[computeGoogle(title, start, end, duration, description, location)]]" target="_blank">
			<iron-icon icon="calendar:google"></iron-icon>
			[[actionText]]
		</a>`;
	}

	static get is() {
		return 'paper-add-to-calendar-google-button';
	}

	static get properties() {
		return {
			actionText: {
				type: String,
				value: 'Google Calendar',
			},

			description: String,
			duration: Number,
			end: Date,
			location: String,
			start: Date,
			title: String,
		};
	}
}

window.customElements.define(PaperAddToCalendarGoogleButton.is, PaperAddToCalendarGoogleButton);
