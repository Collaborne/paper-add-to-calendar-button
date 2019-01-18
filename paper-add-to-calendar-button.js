import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-icon';
import '@polymer/paper-menu-button';

import { AddToCalendarMixin } from './add-to-calendar-mixin.js';
import './icons.js';

/**
 * `paper-add-to-calendar-button`
 * Polymer button that allows downloading an event into various calendars
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class PaperAddToCalendarButton extends AddToCalendarMixin(PolymerElement) {
	static get template() {
		return html`
		<style>
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
				@apply --paper-add-to-calendar-button-button;
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
				@apply --paper-add-to-calendar-button-cal-icon;
				margin-right: 8px;
			}
			.action {
				display: block;
				padding: 8px 16px;
				cursor: pointer;
				color: initial;
				text-decoration: none;
				line-height: 24px;
				@apply --paper-add-to-calendar-button-action;
			}
			.action:hover {
				background: var(--paper-add-to-calendar-button-action-hover-background-color, lightgray);
			}
		</style>
		<paper-menu-button id="menu" vertical-offset="24">
			<a slot="dropdown-trigger" class="trigger-button">
				[[actionText]]
			</a>
			<div class="actions" slot="dropdown-content">
				<a class="action" href="[[computeGoogle(title, start, end, duration, description, location)]]" on-tap="_closeMenu" target="_blank">
          <iron-icon icon="calendar:google"></iron-icon> Google
        </a>
				<a class="action" href="[[computeYahoo(title, start, end, duration, description, location)]]" on-tap="_closeMenu" target="_blank">
          <iron-icon icon="calendar:yahoo"></iron-icon> Yahoo
        </a>
				<a class="action" href="[[computeIcs(title, start, end, duration, description, location)]]" on-tap="_closeMenu">
          <iron-icon icon="calendar:apple"></iron-icon> iCal
        </a>
				<a class="action" href="[[computeIcs(title, start, end, duration, description, location)]]" on-tap="_closeMenu">
          <iron-icon icon="calendar:outlook"></iron-icon> Outlook
        </a>
			</div>
		</paper-menu-button>`;
	}

	static get is() {
		return 'paper-add-to-calendar-button';
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
				value: 'Add to calendar',
			},
		};
	}

	_closeMenu() {
		this.$.menu.close();
	}
}

window.customElements.define(PaperAddToCalendarButton.is, PaperAddToCalendarButton);
