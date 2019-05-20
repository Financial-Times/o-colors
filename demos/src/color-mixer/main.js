import contrastRatio from '../sandboxes/contrast-ratio';
import { mixHexes } from '../sandboxes/colors-mix';

document.addEventListener('o.DOMContentLoaded', function() {
	const forms = document.forms;
	const mixer = forms[0]['mixer'];
	const base = forms[0]['base'];

	forms[0].addEventListener('change', (e) => {
		mixColors(mixer.value, base.value);
		changeCodeSnippetValues(mixer.value, base.value);
	});

	mixColors(mixer.value, base.value);

	//set visible hex value and sass function to default values of mixColors
	forms[1]['range'][5].checked = true;
	// document.querySelector('.percent-80').firstElementChild.setAttribute('aria-selected', true);
	let defaultHex = getComputedStyle(document.documentElement).getPropertyValue(`--o-colors-${mixer.value}-50`);
	fillCodeSnippets(defaultHex, mixer.value, base.value, 50);
});

const changeCodeSnippetValues = (mixer, base) => {
	console.log(document.forms[1]['range'].indexOf(document.forms[1]['range'].value));
	let hex = document.querySelector('input[type=radio]:checked');
	console.log(hex);
	let percent = hex.parentElement.classList.value.replace('percent-', '');
	fillCodeSnippets(hex.innerText, mixer, base, percent);
};

const checkTextContrast = (background) => {
	const text = getComputedStyle(document.documentElement).getPropertyValue('color');
	let textColor = text === 'rgb(0, 0, 0)' ? '#000000' : '#f3f3f3';
	console.log({textColor})
	const ratio = contrastRatio.oColorsGetContrastRatio(textColor, background);
	if (ratio <= 3) { // if it fails accessbility, change text colour
		textColor = textColor === '#000000' ? '#f3f3f3' : '#000000';
		document.body.style.setProperty('--color', textColor);
	}
};

const mixColors = (mixer = 'black', base = 'paper') => {
	let mixerHex = getComputedStyle(document.documentElement).getPropertyValue(`--o-colors-${mixer}`).replace(/^\s*#/, '')
	let baseHex = getComputedStyle(document.documentElement).getPropertyValue(`--o-colors-${base}`).replace(/^\s*#/, '')
	document.documentElement.style.setProperty('--background', `#${baseHex}`);

	const hexArray = mixHexes(mixerHex, baseHex);
	fillSwatches(hexArray, mixer, base);
	checkTextContrast(baseHex);
}

const fillSwatches = (hexes, mixer, base) => {
	const range = document.forms[1]['range'];
	hexes.forEach((hex, index) => {
		let swatch = range[index];
		swatch.style.backgroundColor = hex;
		swatch.value = hex;

		swatch.addEventListener('click', (e) => fillCodeSnippets(e.target.value, mixer, base, index * 10))
	});
}

const fillCodeSnippets = (hex, mixer, base, index) => {
	document.getElementById('hex-value').innerText = hex;
	document.getElementById('code-snippet').innerText = `oColorsMix(${mixer}, ${base}, ${index})`;
};