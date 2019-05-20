import contrastRatio from '../sandboxes/contrast-ratio';
import { mixHexes } from '../sandboxes/colors-mix';

document.addEventListener('o.DOMContentLoaded', function() {
	const form = document.forms[0];
	const mixer = form['mixer'];
	const base = form['base'];

	form.addEventListener('change', () => {
		mixColors(mixer.value, base.value);
		changeCodeSnippetValues(mixer.value, base.value);
	});

	// base.addEventListener('change', () => {
	// 	mixColors(mixer.value, base.value);
	// 	changeCodeSnippetValues(mixer.value, base.value);
	// });

	mixColors(mixer.value, base.value);

	//set visible hex value and sass function to default values of mixColors
	document.querySelector('.percent-80').firstElementChild.setAttribute('aria-selected', true);
	let defaultHex = getComputedStyle(document.documentElement).getPropertyValue(`--o-colors-${mixer.value}-80`);
	fillCodeSnippets(defaultHex, mixer.value, base.value, 80);
});

const changeCodeSnippetValues = (mixer, base) => {
	let hex = document.querySelector('[aria-selected=true]');
	let percent = hex.parentElement.classList.value.replace('percent-', '');
	fillCodeSnippets(hex.innerText, mixer, base, percent);
};

const checkTextContrast = (background) => {
	const text = getComputedStyle(document.documentElement).getPropertyValue('color');
	let textColor = text === 'rgb(0, 0, 0)' ? '#000000' : '#f3f3f3';
	
	const ratio = contrastRatio.oColorsGetContrastRatio(textColor, background);
	if (ratio <= 3) { // if it fails accessbility, change text colour
		textColor = textColor === '#000000' ? '#f3f3f3' : '#000000';
		document.body.style.setProperty('--color', textColor);
	}
};

const mixColors = (mixer = 'black', base = 'paper') => {
	let mixerHex = getComputedStyle(document.documentElement).getPropertyValue(`--o-colors-${mixer}`).replace(/^\s*#/, '')
	let baseHex = getComputedStyle(document.documentElement).getPropertyValue(`--o-colors-${base}`).replace(/^\s*#/, '')
	const hexArray = mixHexes(mixerHex, baseHex);
	fillSwatches(hexArray, mixer, base);
	checkTextContrast(baseHex);
}

const fillSwatches = (hexes, mixer, base) => {
	hexes.forEach((hex, index) => {
		let range = document.querySelector('.mix-range');

		if (range) {
			let swatch = range.querySelector(`.percent-${index * 10} .sqr`);
			swatch.style.backgroundColor = swatch.style.color = swatch.innerText = hex;

			if (index === 0) {
				document.documentElement.style.setProperty('--background', hex)
			}

			swatch.addEventListener('click', () => {
				range.querySelectorAll(`.sqr`).forEach(sqr => {
					sqr.setAttribute('aria-selected', false);
				});

				swatch.setAttribute('aria-selected', true);
				fillCodeSnippets(hex, mixer, base, index * 10);
			});
		}
	});
}

const fillCodeSnippets = (hex, mixer, base, index) => {
	document.getElementById('hex-value').innerText = hex;
	document.getElementById('code-snippet').innerText = `oColorsMix(${mixer}, ${base}, ${index})`;
};