'use client';

import { usePlayerStore } from '@/store/playerStore';
import type { PodcastEpisode } from '@/lib/podcasts';

interface Props {
  episode: PodcastEpisode;
}

export default function PodcastEmissionItem({ episode }: Props) {
  const handlePlay = () => {
    usePlayerStore.getState().setMeta({
      title:    episode.title,
      artist:   'HOPE RADIO - LE PODCAST',
      coverUrl: episode.imageUrl,
    });
    usePlayerStore.getState().playStream(episode.audioUrl);
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch gap-5">
      {episode.imageUrl && (
        <div
          className="w-full md:w-[312px] aspect-[4/3] md:aspect-square shrink-0 rounded-[10px] overflow-hidden bg-cover bg-center"
          style={{ backgroundImage: `url(${episode.imageUrl})` }}
        />
      )}

      <div className="flex-1 flex flex-col gap-5 rounded-[10px] bg-white p-6">
        <div className="flex-1 flex flex-col gap-3">
        <h3
          className="font-nav font-[900] leading-[110%]"
          style={{ color: '#72004A', fontSize: '28px' }}
        >
          {episode.title}
        </h3>

        {episode.description && (
          <p
            className="font-heading font-[700]"
            style={{ color: '#31251A', fontSize: '14px', lineHeight: '124%' }}
          >
            {episode.description}
          </p>
        )}
        </div>

        <button
          type="button"
          onClick={handlePlay}
          className="self-start rounded-full px-6 py-3 text-white font-button font-semibold cursor-pointer border border-[#72004A] bg-[#72004A] hover:bg-transparent hover:text-[#72004A]"
        >
          Écouter le podcast
        </button>
        <p className="font-heading text-[14px] text-[#72004A]">
          DISPONIBLE également sur les plateformes de STREAMING
        </p>
        </div>
      </div>
    );
}
