import {ClassValue, clsx} from 'clsx';
import { interpolate } from 'remotion';
import {twMerge} from 'tailwind-merge';
import { FPS } from '../config';

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function humanReadableFileSize(
	bytes: number,
	si: boolean = false,
	dp = 1
) {
	const thresh = si ? 1000 : 1024;

	if (Math.abs(bytes) < thresh) {
		return bytes + ' B';
	}

	const units = si
		? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
		: ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
	let u = -1;
	const r = 10 ** dp;

	do {
		bytes /= thresh;
		++u;
	} while (
		Math.round(Math.abs(bytes) * r) / r >= thresh &&
		u < units.length - 1
	);

	return bytes.toFixed(dp) + ' ' + units[u];
}

export const formatBytes = (bytes: number): string => {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (bytes === 0) return '0 Byte';
	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };
  

export function percentage(partialValue: number, totalValue: number) {
	return (100 * partialValue) / totalValue;
}

export function addCommas(x: number) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function interpolateFactory(
	frame: number,
	delayInSeconds: number,
	durationInSeconds: number,
	finalOpacity: number = 1
) {
	const delay = delayInSeconds * FPS;
	const duration = durationInSeconds * FPS + delay;
	return interpolate(frame, [delay, duration], [0, finalOpacity], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
}