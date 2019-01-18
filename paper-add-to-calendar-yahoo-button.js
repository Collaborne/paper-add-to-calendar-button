import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon';

import { AddToCalendarMixin } from './add-to-calendar-mixin.js';
import './icons.js';
import './styles.js';

class PaperAddToCalendarYahooButton extends AddToCalendarMixin(PolymerElement) {
	static get template() {
		return html`
		<style include="add-to-calendar-styles">
			:host {
				--button-color: #6b0094;
			}
		</style>
		<a href="[[computeYahoo(title, start, end, duration, description, location)]]" target="_blank">
			<iron-icon icon="calendar:yahoo"></iron-icon>
			[[actionText]]
		</a>`;
	}

	static get is() {
		return 'paper-add-to-calendar-yahoo-button';
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
				value: 'Yahoo Calendar',
			},
		};
	}
}

window.customElements.define(PaperAddToCalendarYahooButton.is, PaperAddToCalendarYahooButton);
