import { fetchConducteurTracks } from '@/lib/conducteur';
import SonList from '@/components/son/SonList';

export const metadata = {
  title: "C'était quoi ce son ? | Hope Radio",
  description: 'Vous avez raté un titre ? Retrouvez les derniers morceaux diffusés sur Hope Radio.',
};

// Page "/son" — historique des derniers titres diffusés, alimenté par le flux
// Conducteur.xml du diffuseur (indépendant de WordPress/WPGraphQL).
export default async function SonPage() {
  const tracks = await fetchConducteurTracks();

  return (
    <main className="relative bg-primary min-h-screen py-16 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url('/images/son-pattern.svg')] bg-repeat"
      />

      <div className="container relative px-6 lg:px-0 lg:max-w-[1139px] mx-auto">
        <h1 className="font-nav font-[900] text-4xl md:text-[64px] lg:text-[88px] leading-[90%] text-white uppercase mb-4">
          C&apos;était quoi ce son&nbsp;?
        </h1>
        <p className="font-heading font-bold text-white/90 uppercase tracking-wide text-xs md:text-sm mb-10 max-w-2xl">
          Vous avez raté un titre, pas de panique, voici les 20 derniers morceaux diffusés
        </p>

        <SonList tracks={tracks} />
      </div>
    </main>
  );
}
