import { useCurrentFrame } from 'remotion';
import { fadeInAndSlideUp } from '../../functions/animations';
import { AnimatedCounter } from './AnimatedCounter';

export const StatCard = ({ title, value, duration = 3, gradient, delay }) => {
  const frame = useCurrentFrame();

  return (
    <div
      className={`bg-[#282a36] text-[#f8f8f2] rounded-lg p-4 shadow-lg ${gradient} flex flex-col h-[120px]`}
      style={fadeInAndSlideUp(frame, delay)}
      aria-label={`${title}: ${value}`}
    >
      <h3 className="text-sm whitespace-nowrap font-semibold opacity-80">{title}</h3>
      <div className="flex-grow flex items-center">
        <p className="text-3xl font-bold">
          <AnimatedCounter value={value} duration={duration + delay} />
        </p>
      </div>
    </div>
  );
}; 