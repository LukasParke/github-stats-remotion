import { interpolate, Easing } from 'remotion';

export const fadeInAndSlideUp = (frame: number, delay: number = 0) => {
  const opacity = interpolate(
    frame - delay,
    [0, 20],
    [0, 1],
    {
      extrapolateRight: 'clamp',
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    }
  );
  
  const y = interpolate(
    frame - delay,
    [0, 30],
    [50, 0],
    {
      extrapolateRight: 'clamp',
      easing: Easing.elastic(1)
    }
  );

  return { opacity, transform: `translateY(${y}px)` };
}; 