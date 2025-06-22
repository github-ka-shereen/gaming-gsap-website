'use client';

import gsap from 'gsap';
import { useEffect, useRef } from 'react';

type Props = {
  title: string;
  containerClass?: string;
};

function AnimatedTitle({ title, containerClass }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  // Process the title into lines and words
  const processTitle = (title: string) => {
    return title.split('<br/>').map((line) => ({
      line,
      words: line.split(' '),
    }));
  };

  const titleData = processTitle(title);

  // Clear and populate wordsRef on each render
  wordsRef.current = [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state (hidden)
      gsap.set(wordsRef.current, {
        opacity: 0,
        y: 20,
        rotationY: 10,
        rotationX: -10,
      });

      // Animation timeline
      const titleAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: '100 bottom',
          end: 'center bottom',
          toggleActions: 'play none none reverse',
        },
      });

      titleAnimation.to(wordsRef.current, {
        opacity: 1,
        transform: 'translate3d(0,0,0) rotateY(0deg) rotateX(0deg)',
        ease: 'power1.inOut',
        stagger: 0.02,
      });

      return () => ctx.revert();
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={`animated-title ${containerClass}`}>
      {titleData.map(({ words }, index) => (
        <div
          key={index}
          className='flex-center max-w-full flex-wrap gap-2 px-10 md:gap-3'
        >
          {words.map((word, i) => (
            <span
              key={`${index}-${i}`}
              ref={(el) => {
                if (el) wordsRef.current.push(el);
              }}
              className='animated-word'
              dangerouslySetInnerHTML={{ __html: word }}
              style={{ opacity: 0 }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default AnimatedTitle;
