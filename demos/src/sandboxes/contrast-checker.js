import contrastRatio from './contrast-ratio';
import colorMix from './colors-mix';

function changeColor(colorName, property) {
	const root = document.documentElement;
	const hexValue = getComputedStyle(root).getPropertyValue(`--o-colors-${colorName}`);

	root.style.setProperty(`--${property}`, hexValue);
	return hexValue;
}

function showContrastRatio(text, background) {
	const textHex = changeColor(text.value, 'foreground');
	const backgroundHex = changeColor(background.value, 'background');

	const ratingMessage = document.querySelector('.rating-message');
	const ratioValue = document.querySelector('.contrast-ratio');
	const wcagRating = document.querySelector('.wcag-rating');
	const ratio = contrastRatio.oColorsGetContrastRatio(textHex, backgroundHex);
	const rating = contrastRatio.oColorsGetWCAGRating(ratio, text.value, background.value);

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
	// const mixer = form['mixer'];
	// const base = form['base'];

	foreground[0].addEventListener('input', (e) => {
		showContrastRatio(foreground, background);
		// colorMix.oColorsMix(mixer.value, base.value);
	});

	background[0].addEventListener('input', (e) => {
		showContrastRatio(foreground, background);
		// colorMix.oColorsMix(mixer.value, base.value);
	});

	// form['range'].forEach(input => {
	// 	input.addEventListener('dblclick', () => {
	// 		addMixedSwatch(foreground, input);
	// 		addMixedSwatch(background, input);
	// 	})
	// })
	
	showContrastRatio(foreground, background);
	// colorMix.oColorsMix(mixer.value, base.value);
});

const addMixedSwatch = (panel, item) => {
	let label = document.createElement('label');
	label.setAttribute('title', item.value)

	let newSwatch = document.createElement('input');
	newSwatch.setAttribute('type', 'radio');
	newSwatch.setAttribute('name', panel.id);
	newSwatch.style.backgroundColor = item.style.backgroundColor;

	label.appendChild(newSwatch);
	panel[0].appendChild(label);
}