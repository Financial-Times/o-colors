import contrastRatio from './contrast-ratio';

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

document.addEventListener('DOMContentLoaded', function() {
	const form = document.forms[0];
	form.addEventListener('change', () => {
		showContrastRatio(form['foreground'], form['background']);
	});

	showContrastRatio(form['foreground'], form['background']);
});
