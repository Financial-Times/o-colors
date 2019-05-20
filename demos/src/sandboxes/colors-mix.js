import contrastRatio from './contrast-ratio';

const getHexValue = (mixer, base) => {
	const root = getComputedStyle(document.documentElement);
	return {
		mixer: getComputedStyle(root).getPropertyValue(`--o-colors-${mixer}`).replace(/^\s*#/, ''),
		base: getComputedStyle(root).getPropertyValue(`--o-colors-${base}`).replace(/^\s*#/, '')
	}
}

const oColorsMix = (mixer = 'black', base = 'paper') => {
	const hex = getHexValues(mixer, base);

	// checkTextContrast(hex.text, hex.base);
	const hexArray = mixHexes(hex.mixer, hex.base);
	colourSwatches(hexArray, mixer, base);
};

// const checkTextContrast = (text, background) => {
// 	const text = getComputedStyle(document.documentElement).getPropertyValue('color');
// 	let textColor = text === 'rgb(0, 0, 0)' ? '#000000' : '#f3f3f3';
// 	let ratio = contrastRatio.oColorsGetContrastRatio(textColor, background);

// 	if (ratio <= 3) { //if it fails accessbility
// 		textColor = textColor === '#000000' ? '#f3f3f3' : '#000000';
// 		document.body.style.setProperty('--color', textColor);
// 	}
// };

const mixHexes = (mixer, base) => {
	const radix = 16;
	const decimalToHex = decimal => decimal.toString(radix);
	const hexToDecimal = hex => parseInt(hex, radix);

	let percentages = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

	return percentages.map(percent => {

		let hexValue = "#";

		for (let i = 0; i <= 5; i += 2) {
			let mixPair = hexToDecimal(mixer.substr(i, 2)); // extract r, g, b pairs for mixer color
			let basePair = hexToDecimal(base.substr(i, 2)); // extract r, g, b pairs for base color

			// combine the r/g/b pairs from each color, based on percentage
			let combinedPair = decimalToHex(Math.round(basePair + (mixPair - basePair) * (percent / 100.0)));

			while (combinedPair.length < 2) { combinedPair = `0${combinedPair}`; }// prepend a '0' if combinedPair results in a single digit

			hexValue += combinedPair; //add new pair to hex string
		}

		return hexValue;
	});
};


const colourSwatches = (hexes, mixer, base) => {
	hexes.forEach((hex, index)=> {
		input = document.querySelector(`label[title="${index * 10}%"] input`)
		input.style.backgroundColor = hex;
		input.setAttribute('value', hex);
	})
	// hexes.forEach((hex, index) => {
	// 	let range = document.querySelector('.mix-range');
		
	// 	if (range) {
	// 		let swatch = range.querySelector(`.percent-${index * 10} .sqr`);
	// 		swatch.style.backgroundColor = swatch.style.color = swatch.innerText = hex;
	
	// 		if (index === 0) {
	// 			document.body.style.backgroundColor = hex;
	// 		}
	
	// 		swatch.addEventListener('click', () => {
	// 			range.querySelectorAll(`.sqr`).forEach(sqr => {
	// 				sqr.setAttribute('aria-selected', false);
	// 			});
	
	// 			swatch.setAttribute('aria-selected', true);
	// 			fillCodeSnippets(hex, mixer, base, index * 10);
	// 		});
	// 	}
	// });
};

const fillCodeSnippets = (hex, mixer, base, index) => {
	document.getElementById('hex-value').innerText = hex;
	document.getElementById('code-snippet').innerText = `oColorsMix(${mixer}, ${base}, ${index})`;
};

export default {
	getHexValue,
	mixHexes
}