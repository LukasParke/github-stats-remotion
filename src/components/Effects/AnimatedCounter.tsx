import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {formatInteger} from '../../functions/utils';

type AnimatedCounterProps = {
	value: number;
	duration?: number;
	startFrame?: number;
	delay?: number;
};

export const AnimatedCounter = ({
	value,
	duration = 2,
	startFrame = 0,
	delay = 0,
}: AnimatedCounterProps) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const firstFrame = startFrame + delay * fps;
	const finalFrame = firstFrame + duration * fps;
	const currentValue = interpolate(frame, [firstFrame, finalFrame], [0, value], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return <span>{formatInteger(Math.round(currentValue))}</span>;
};
