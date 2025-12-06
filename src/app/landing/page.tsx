import { Navbar, HeroSection, FeaturesSection, GetStartedSection } from '@/components';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className='overflow-x-hidden'>
        <HeroSection />
        <FeaturesSection />
        <GetStartedSection />
      </main>
    </>
  );
}
