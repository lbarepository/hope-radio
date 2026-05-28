import HeroSlider        from '@/components/home/HeroSlider';
import ActualitesSection from '@/components/home/ActualitesSection';
import DecouvrirSection  from '@/components/home/DecouvrirSection';
import BanniereSection   from '@/components/banniere/BanniereSection';
import ClipsSection      from '@/components/home/ClipsSection';
import RadiosSection     from '@/components/home/RadiosSection';

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      <HeroSlider />
      <ActualitesSection count={3} title="Actualités" />
      <DecouvrirSection />
      <BanniereSection />
      <ClipsSection />
      <RadiosSection />
    </main>
  );
}
