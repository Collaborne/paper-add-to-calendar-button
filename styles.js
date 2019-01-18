const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="add-to-calendar-styles">
	<template>
		<style>
			:host {
				display: inline-block;
			}

			a {
				display: inline-block;
				border: 1px solid var(--button-color);
				border-radius: 5px;
				padding: 4px 16px;
				cursor: pointer;
				text-decoration: none;
				color: var(--button-color);
			}
			a:hover {
				background-color: #f9f9f9;
			}
			iron-icon {
				margin-right: 8px;
			}
		</style>
	</template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
