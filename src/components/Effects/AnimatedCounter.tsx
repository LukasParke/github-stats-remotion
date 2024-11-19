import { useCurrentFrame, useVideoConfig } from 'remotion';
import { addCommas } from '../../functions/utils';

export const AnimatedCounter = ({ value, duration = 3, startFrame = 0, delay = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const targetValue = value.toString();
  
  // Calculate frames
  const animationStartFrame = startFrame;
  const animationEndFrame = animationStartFrame + (duration * fps);
  const finalEndFrame = animationEndFrame + (delay * fps);
  
  // Before animation starts
  if (frame < animationStartFrame) {
    return <span>0</span>;
  }
  
  // After everything is complete (including delay)
  if (frame >= finalEndFrame) {
    return <span>{addCommas(targetValue)}</span>;
  }
  
  // If we're in the delay period, keep scrambling
  if (frame >= animationEndFrame) {
    const displayValue = targetValue
      .split('')
      .map((digit, index) => {
        if (index < targetValue.length - 1) {
          return digit;
        }
        return Math.floor(Math.random() * 10);
      })
      .join('');
    return <span>{addCommas(displayValue)}</span>;
  }
  
  // During main animation
  const progress = (frame - animationStartFrame) / (duration * fps);
  const digitsToShow = Math.floor(progress * targetValue.length);
  
  const displayValue = targetValue
    .split('')
    .map((digit, index) => {
      if (index < digitsToShow) {
        return digit;
      }
      return Math.floor(Math.random() * 10);
    })
    .join('');

  return <span>{addCommas(displayValue)}</span>;
}; 