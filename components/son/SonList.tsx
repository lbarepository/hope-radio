import type { ConducteurTrack } from '@/lib/conducteur';
import SonCard from './SonCard';

interface SonListProps {
  tracks: ConducteurTrack[];
}

export default function SonList({ tracks }: SonListProps) {
  if (tracks.length === 0) {
    return (
      <p className="text-white text-center py-16">
        Aucun titre récent à afficher pour le moment.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {tracks.map((track) => (
        <SonCard key={track.id} track={track} />
      ))}
    </div>
  );
}
