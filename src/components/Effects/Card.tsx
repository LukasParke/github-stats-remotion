import {AbsoluteFill} from 'remotion';
import {MainProps} from '../../config';

type CardProps = {
  children: React.ReactNode;
  userStats: MainProps['userStats'];
};

export function Card({children, userStats}: CardProps) {
  if (!userStats) {
    return null;
  }

  return (
    <AbsoluteFill className="bg-transparent p-1">
      {children}
    </AbsoluteFill>
  );
} 