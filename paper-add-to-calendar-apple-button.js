import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon';

import {AddToCalendarMixin} from './add-to-calendar-mixin.js';
import './icons.js';
import './styles.js';

class PaperAddToCalendarAppleButton extends AddToCalendarMixin(PolymerElement) {
	static get template() {
		return html`
		<style include="add-to-calendar-styles">
			:host {
				--button-color: black;
			}
		</style>
		<a href="[[computeIcs(title, start, end, duration, description, location)]]">
			<iron-icon icon="calendar:apple"></iron-icon>
			[[actionText]]
		</a>`;
	}

	static get is() {
		return 'paper-add-to-calendar-apple-button';
	}

	static get properties() {
		return {
			actionText: {
				type: String,
				value: 'Apple Calendar',
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

window.customElements.define(PaperAddToCalendarAppleButton.is, PaperAddToCalendarAppleButton);
