import About from '@/components/About';
import Hero from '@/components/Hero';
import NavigationBar from '@/components/NavigationBar';



export default function Home() {
  return (
    <main className='max-width'>
      <Hero />
      <About />
      <NavigationBar />
    </main>
  );
}
