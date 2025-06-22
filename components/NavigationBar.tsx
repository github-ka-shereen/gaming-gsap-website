'use client';

import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import { TiLocationArrow } from 'react-icons/ti';
import { clsx } from 'clsx';
import { useWindowScroll } from 'react-use';
import gsap from 'gsap';
import Image from 'next/image';

type NavItem = 'Nexus' | 'Vault' | 'Prologue' | 'About' | 'Contact';

const navItems: NavItem[] = ['Nexus', 'Vault', 'Prologue', 'About', 'Contact'];

const NavigationBar = () => {
  // State for toggling audio and visual indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);
  const [audioSrc, setAudioSrc] = useState('/audio/loop.mp3'); // Initial static src

  // Refs with proper typing
  const audioElementRef = useRef<HTMLAudioElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Toggle audio and visual indicator
  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  // Manage audio playback with proper error handling
  useEffect(() => {
    if (!audioElementRef.current) return;

    const handleAudio = async () => {
      try {
        if (isAudioPlaying) {
          await audioElementRef.current!.play();
        } else {
          audioElementRef.current!.pause();
        }
      } catch (error) {
        console.error('Audio playback error:', error);
        setIsAudioPlaying(false);
        setIsIndicatorActive(false);
      }
    };

    handleAudio();
  }, [isAudioPlaying]);

  // Handle scroll behavior
  useEffect(() => {
    if (!navContainerRef.current) return;

    if (currentScrollY === 0) {
      // Topmost position: show navbar without floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.remove('floating-nav');
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down: hide navbar and apply floating-nav
      setIsNavVisible(false);
      navContainerRef.current.classList.add('floating-nav');
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up: show navbar with floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.add('floating-nav');
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  // GSAP animation for smooth nav appearance
  useEffect(() => {
    if (!navContainerRef.current) return;

    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  // Cache-busting for audio file
  // Initialize audio source client-side
  useEffect(() => {
    const cacheBuster =
      process.env.NODE_ENV === 'production'
        ? `?v=${process.env.NEXT_PUBLIC_BUILD_ID || '1'}`
        : `?ts=${Date.now()}`;
    setAudioSrc(`/audio/loop.mp3${cacheBuster}`);
  }, []);

  return (
    <div
      ref={navContainerRef}
      className='fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6'
    >
      <header className='absolute top-1/2 w-full -translate-y-1/2'>
        <nav className='flex size-full items-center justify-between p-4'>
          {/* Logo and Product button */}
          <div className='flex items-center gap-7'>
            <Image
              src='/img/logo.png'
              alt='logo'
              className='w-10'
              width={40}
              height={40}
            />

            <Button
              id='product-button'
              title='Products'
              rightIcon={TiLocationArrow}
              containerClass='bg-blue-50 md:flex hidden items-center justify-center gap-1'
            />
          </div>

          {/* Navigation Links and Audio Button */}
          <div className='flex h-full items-center'>
            <div className='hidden md:block'>
              {navItems.map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className='nav-hover-btn px-3 py-2 text-sm font-medium'
                >
                  {item}
                </a>
              ))}
            </div>

            <button
              onClick={toggleAudioIndicator}
              className='ml-10 flex items-center space-x-0.5'
              aria-label={isAudioPlaying ? 'Pause audio' : 'Play audio'}
            >
              <audio
                ref={audioElementRef}
                className='hidden'
                src={audioSrc}
                loop
                preload='metadata'
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx(
                    'h-4 w-0.5 bg-white cursor-pointer transition-all duration-300',
                    {
                      'animate-pulse scale-y-125': isIndicatorActive,
                    }
                  )}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavigationBar;
