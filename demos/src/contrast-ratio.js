function oColorsGetWCAGRating(ratio) {
	let wcagRating;

	if (ratio >= 7) {
		wcagRating = 'AAA';
	} else if (ratio >= 4.5) {
		wcagRating = 'AA';
	} else if (ratio >= 3) {
		wcagRating = 'AA18';
	} else {
		wcagRating = 'fail';
	}
	return wcagRating;
}


function oColorsGetContrastRatio(color1, color2) {
	const l1 = oColorsColorLuminance(color1) + 0.05;
	const l2 = oColorsColorLuminance(color2) + 0.05;
	let ratio = l1/l2;

	if (l2 > l1) {
		ratio = 1/ratio;
	}

	ratio = preciseFloor(ratio);
	return ratio;
}


function preciseFloor(number, decimals = 2) {
	const multiplier = Math.pow(10, decimals);
	return Math.floor(number * multiplier) / multiplier;
}


function oColorsColorLuminance(hex) {
	const hexValue = hex.replace('#', '').trim()
	const rgbPairs = hexValue.match(/.{1,2}/g);

	const decimals = rgbPairs.map(pair => {
		return parseInt(pair, 16);
	})

	const colors = {
		'red': decimals[0],
		'green': decimals[1],
		'blue':decimals[2]
	}

	Object.keys(colors).forEach(color => {
		colors[color] = colors[color] / 255;

		if (colors[color] < 0.03928) {
			colors[color] = colors[color] / 12.92;
		} else {
			colors[color] = (colors[color] + 0.055) / 1.055;
			colors[color] = Math.pow(colors[color], 2.4);
		}
	})
	return colors['red'] * 0.2126 + colors['green'] * 0.7152 + colors['blue'] * 0.0722;
}

module.exports = {
	oColorsGetWCAGRating,
	oColorsGetContrastRatio
}
