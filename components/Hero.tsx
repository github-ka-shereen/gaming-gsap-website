'use client';
import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import { TiLocationArrow } from 'react-icons/ti';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);
  // Cache busting solution for Next.js video loading
  const [videoSuffix, setVideoSuffix] = useState(''); // Start with no cache-busting suffix

  const handleVideoLoad = () => {
    console.log('Video loaded, count:', loadedVideos + 1);

    setLoadedVideos((prev) => prev + 1);
  };

  const totalVideos = 4;

  const nextVideoRef = useRef<HTMLVideoElement>(null);

  const upComingVideoIndex = (currentIndex % totalVideos) + 1;

  const handleMiniVdClick = () => {
    setHasClicked(true);

    setCurrentIndex(upComingVideoIndex);
  };

  useGSAP(
    () => {
      if (hasClicked) {
        gsap.set('#next-video', {
          visibility: 'visible',
        });

        gsap.to('#next-video', {
          transformOrigin: 'center center',
          scale: 1,
          width: '100%',
          height: '100%',
          duration: 1,
          ease: 'power1.inOut',
          onStart: () => {
            if (nextVideoRef.current) {
              nextVideoRef.current
                .play()
                .catch((e) => console.error('Video play failed:', e));
            }
          },
        });

        gsap.from('#current-video', {
          transformOrigin: 'center center',
          scale: 0,
          duration: 1.5,
          ease: 'power1.inOut',
        });
      }
    },
    { dependencies: [currentIndex], revertOnUpdate: true }
  );

  useGSAP(() => {
    gsap.set('#video-frame', {
      clipPath: 'polygon(14% 0%, 72% 0%, 90% 90%, 0% 100%)',
    });

    gsap.from('#video-frame', {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '#video-frame',
        start: 'center center',
        end: 'bottom center',
        scrub: true,
      },
    });
  });

  // Get video URL - adds cache-busting only on client
  const getVideoSrc = (index: number | string) =>
    `/videos/hero-${index}.mp4${videoSuffix}`; // Append suffix if exists

  // This runs ONLY in the browser (after component mounts)
  useEffect(() => {
    // Add timestamp to URL to prevent caching
    setVideoSuffix(`?ts=${Date.now()}`);
  }, []); // Empty array = runs once on mount

  // When a video becomes playable
  const handleVideoReady = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;

    // Video ready states:
    // 0 = HAVE_NOTHING, 1 = HAVE_METADATA, 2 = HAVE_CURRENT_DATA, 3 = HAVE_FUTURE_DATA, 4 = HAVE_ENOUGH_DATA
    if (video.readyState >= 3) {
      // At least some data is available
      setLoadedVideos((prev) => {
        const newCount = prev + 1;
        console.log(`Loaded ${newCount}/${totalVideos} videos`);
        return newCount;
      });
    }
  };

  // Check when all videos are loaded
  useEffect(() => {
    if (loadedVideos >= totalVideos) {
      console.log('ALL VIDEOS LOADED!');
      setIsLoading(false); // Hide loading screen
    }
  }, [loadedVideos]); // Runs whenever loadedVideos changes

  return (
    <div className='relative h-dvh w-screen overflow-x-hidden'>
      {isLoading && (
        <div className='flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50'>
          <div className='three-body'>
            <div className='three-body__dot' />
            <div className='three-body__dot' />
            <div className='three-body__dot' />
          </div>
        </div>
      )}
      <div
        id='video-frame'
        className='relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75'
      >
        <div>
          <div className='mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg'>
            <div
              onClick={handleMiniVdClick}
              className='origin-center scale-50 opacity-0 transition-all ease-in hover:scale-100 hover:opacity-100'
            >
              <video
                ref={nextVideoRef}
                src={getVideoSrc(upComingVideoIndex)}
                loop
                muted
                id='current-video'
                className='size-64 origin-center scale-150 object-cover object-center'
                onLoadedData={handleVideoLoad}
              />
            </div>
          </div>
          <video
            ref={nextVideoRef}
            src={getVideoSrc(currentIndex)}
            loop
            muted
            id='next-video'
            className='absolute-center invisible absolute z-20 size-64 object-cover object-center'
            onLoadedData={handleVideoLoad}
          />
          <video
            src={getVideoSrc(
              currentIndex === totalVideos - 1 ? 1 : currentIndex
            )}
            autoPlay
            loop
            muted
            playsInline // Important for mobile
            className='absolute left-0 top-0 size-full object-cover object-center'
            onCanPlayThrough={handleVideoReady} // More reliable than onLoadedData
            onLoadedData={handleVideoReady} // Fallback
            onError={(e) =>
              console.error('Video error:', e.currentTarget.error)
            }
          />
        </div>
        <h1 className='special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75'>
          G<b>a</b>ming
        </h1>
        <div className='absolute  left-0 top-0 z-40 size-full'>
          <div className='mt-24 px-5 sm:px-10'>
            <h1 className='special-font hero-heading text-blue-100'>
              Redefi<b>n</b>e
            </h1>
            <p className='mb-5 max-w-64 font-robert-regular text-blue-100'>
              Enter the Metagame Layer <br /> Unleash the Play Economy
            </p>
            <Button
              id='watch-trailer'
              title='Watch Trailer'
              leftIcon={TiLocationArrow}
              containerClass='!bg-yellow-300 flex-center gap-1'
            />
          </div>
        </div>
      </div>
      <h1 className='special-font hero-heading absolute bottom-5 right-5 text-black'>
        G<b>a</b>ming
      </h1>
    </div>
  );
};

export default Hero;
