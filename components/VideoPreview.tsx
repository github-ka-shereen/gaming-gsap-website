'use client';

import { gsap } from 'gsap';
import { useState, useRef, useEffect, ReactNode, MouseEvent } from 'react';

interface VideoPreviewProps {
  children: ReactNode;
  className?: string;
  perspective?: number;
  rotateScale?: number;
  moveScale?: number;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  children,
  className = '',
  perspective = 500,
  rotateScale = 2,
  moveScale = 1,
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();

    const xOffset = clientX - (rect.left + rect.width / 2);
    const yOffset = clientY - (rect.top + rect.height / 2);

    if (isHovering && sectionRef.current && contentRef.current) {
      gsap.to(sectionRef.current, {
        x: xOffset * moveScale,
        y: yOffset * moveScale,
        rotationY: xOffset / rotateScale,
        rotationX: -yOffset / rotateScale,
        transformPerspective: perspective,
        duration: 1,
        ease: 'power1.out',
      });

      gsap.to(contentRef.current, {
        x: -xOffset * moveScale,
        y: -yOffset * moveScale,
        duration: 1,
        ease: 'power1.out',
      });
    }
  };

  useEffect(() => {
    if (!isHovering && sectionRef.current && contentRef.current) {
      gsap.to(sectionRef.current, {
        x: 0,
        y: 0,
        rotationY: 0,
        rotationX: 0,
        duration: 1,
        ease: 'power1.out',
      });

      gsap.to(contentRef.current, {
        x: 0,
        y: 0,
        duration: 1,
        ease: 'power1.out',
      });
    }
  }, [isHovering]);

  return (
    <div
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className={`absolute z-50 size-full overflow-hidden rounded-lg ${className}`}
      style={{ perspective: `${perspective}px` }}
    >
      <div
        ref={contentRef}
        className='origin-center rounded-lg'
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </div>
    </div>
  );
};

export default VideoPreview;
