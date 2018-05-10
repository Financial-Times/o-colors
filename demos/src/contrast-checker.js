const contrastRatio = require('./contrast-ratio');

function contrastChecker() {
	const colorSubmitButton = document.querySelector('.o-buttons--submit-colors');
	colorSubmitButton.addEventListener('click', showContrastRatio , false);
}

function showContrastRatio() {
	const textSelector = document.getElementById('text-selector');
	const backgroundSelector = document.getElementById('background-selector');

	const textColor = textSelector.options[textSelector.selectedIndex].value;
	const backgroundColor = backgroundSelector.options[backgroundSelector.selectedIndex].value;

	const docElem = document.documentElement;
	const textHex = getComputedStyle(docElem).getPropertyValue(`--o-colors-${textColor}`);
	const backgroundHex = getComputedStyle(docElem).getPropertyValue(`--o-colors-${backgroundColor}`);

	const ratingResultElem = document.querySelector('.rating-result');
	const ratioResultElem = document.querySelector('.ratio-value');
	const ratio = contrastRatio.oColorsGetContrastRatio(textHex, backgroundHex);
	const rating = contrastRatio.oColorsGetWCAGRating(ratio, textColor, backgroundColor);
	ratingResultElem.className = `rating-result rating-result--${rating.wcagRating.toLowerCase()}`;

	ratioResultElem.innerHTML = `Contrast ratio is ${ratio}`;
	ratingResultElem.innerHTML = `WCAG ${rating.wcagRating}<br>${rating.message}`;
}

document.addEventListener('DOMContentLoaded', function() {
	contrastChecker();
});
