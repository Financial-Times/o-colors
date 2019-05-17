import contrastRatio from './contrast-ratio';
import colorMix from './colors-mix';

function changeColor(colorName, property) {
	const root = document.documentElement;
	let hexValue = getComputedStyle(root).getPropertyValue(`--o-colors-${colorName}`);

	if (hexValue.length <= 0) {
		hexValue = colorName
	}

	root.style.setProperty(`--${property}`, hexValue);
	return hexValue;
}

function showContrastRatio(text, background) {
	const textHex = changeColor(text.value, 'foreground');
	const backgroundHex = changeColor(background.value, 'background');

	const combination = document.querySelector('.combination');
	const ratingMessage = document.querySelector('.rating-message');
	const ratioValue = document.querySelector('.contrast-ratio');
	const wcagRating = document.querySelector('.wcag-rating');

	const ratio = contrastRatio.oColorsGetContrastRatio(textHex, backgroundHex);
	const rating = contrastRatio.oColorsGetWCAGRating(ratio, text.value, background.value);

	combination.innerHTML = rating.combination;
	ratingMessage.className = `rating-message rating-result--${rating.wcagRating.toLowerCase()}`;
	ratingMessage.innerHTML = rating.message;

	ratioValue.textContent = `Contrast ratio: ${ratio}`;

	wcagRating.className = `wcag-rating rating-result--${rating.wcagRating.toLowerCase()}`;
	wcagRating.textContent = `WCAG ${rating.wcagRating}`;
}


document.addEventListener('DOMContentLoaded', (e) => {
	const form = document.forms[0];
	const foreground = form['foreground'];
	const background = form['background'];
	
	form.addEventListener('change', () => {
		showContrastRatio(foreground, background);
	});
	
	showContrastRatio(foreground, background);
});

let eventsAdded = false;

document.addEventListener('oOverlay.ready', () => {	
	generateRange();

	document.forms[0]['overlay-fieldset'].addEventListener('change', generateRange);
	
	if (!eventsAdded) {
		document.getElementById('add-mix').addEventListener('click', () => {
			const range = document.forms[0]['range'];
			addMixedSwatch(foreground, range.value);
			addMixedSwatch(background, range.value);
		});

		eventsAdded = true;
	}
});

const generateRange = () => {
	colorMix.oColorsMix(document.forms[0]['mixer'].value, document.forms[0]['base'].value);
}

const addMixedSwatch = (panel, color) => {
	let label = document.createElement('label');
	label.setAttribute('title', color)

	let newSwatch = document.createElement('input');
	newSwatch.setAttribute('type', 'radio');
	newSwatch.setAttribute('name', panel.id);
	newSwatch.setAttribute('value', color);
	newSwatch.style.backgroundColor = color;

	label.appendChild(newSwatch);
	panel.appendChild(label);

	label = null;
}