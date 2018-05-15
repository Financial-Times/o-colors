const contrastRatio = require('./contrast-ratio');

function changeColor(colorName, property) {
	const hexValue = getComputedStyle(document.documentElement).getPropertyValue(`--o-colors-${colorName}`);
	document.querySelector('.contrast-showcase').style[property] = hexValue;
}

function showContrastRatio(textColor, backgroundColor) {
	const docElem = document.documentElement;
	const textHex = getComputedStyle(docElem).getPropertyValue(`--o-colors-${textColor}`);
	const backgroundHex = getComputedStyle(docElem).getPropertyValue(`--o-colors-${backgroundColor}`);

	const ratingMessage = document.querySelector('.rating-message');
	const ratioValue = document.querySelector('.contrast-ratio');
	const wcagRating = document.querySelector('.wcag-rating');
	const ratio = contrastRatio.oColorsGetContrastRatio(textHex, backgroundHex);
	const rating = contrastRatio.oColorsGetWCAGRating(ratio, textColor, backgroundColor);

	ratingMessage.className = `rating-message rating-result--${rating.wcagRating.toLowerCase()}`;
	ratingMessage.innerHTML = rating.message;

	ratioValue.innerHTML = `Contrast ratio: ${ratio}`;

	wcagRating.className = `wcag-rating rating-result--${rating.wcagRating.toLowerCase()}`;
	wcagRating.innerHTML = `WCAG ${rating.wcagRating}`;
}

document.addEventListener('DOMContentLoaded', function() {
	const textSelector = document.getElementById('text-selector');
	const backgroundSelector = document.getElementById('background-selector');

	textSelector.addEventListener('change', () => {
		changeColor(textSelector.value, 'color');
		showContrastRatio(textSelector.value, backgroundSelector.value);
	});

	backgroundSelector.addEventListener('change', () => {
		changeColor(backgroundSelector.value, 'background');
		showContrastRatio(textSelector.value, backgroundSelector.value);
	});

	changeColor(textSelector.value, 'color');
	changeColor(backgroundSelector.value, 'background');
	showContrastRatio(textSelector.value, backgroundSelector.value);
});
