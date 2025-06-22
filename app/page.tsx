import About from '@/components/About';
import Hero from '@/components/Hero';

export default function Home() {
  return (
    <main className='max-width'>
      <Hero />
      <About/>
    </main>
  );
}
