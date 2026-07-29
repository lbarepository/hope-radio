'use client';

import { usePlayerStore } from '@/store/playerStore';
import { formatSeconds, parseDurationToSeconds } from '@/lib/podcasts';
import type { PodcastEpisode } from '@/lib/podcasts';

interface Props {
  episode: PodcastEpisode;
}

export default function PodcastEmissionItem({ episode }: Props) {
  const isPlaying   = usePlayerStore((s) => s.isPlaying);
  const streamUrl   = usePlayerStore((s) => s.streamUrl);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const isThisPlaying = isPlaying && streamUrl === episode.audioUrl;
  const remainingSeconds = Math.max(0, parseDurationToSeconds(episode.duration) - currentTime);

  const handleToggle = () => {
    if (isThisPlaying) {
      usePlayerStore.getState().stopStream();
      return;
    }
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
        <div className="flex-1 flex flex-col gap-4">
          <h3
            className="font-nav font-[900] leading-[110%]"
            style={{ color: '#72004A', fontSize: '28px' }}
          >
            {episode.title}
          </h3>

          {episode.description && (
            <p
              className="font-heading font-[700] text-[14px] text-[#31251A] leading-[124%] mb-8"          >
              {episode.description}
            </p>
          )}
          <button
            type="button"
            onClick={handleToggle}
            className={`self-start rounded-full px-6 py-3 text-white font-button font-semibold cursor-pointer border border-[#72004A] ${
              isThisPlaying
                ? 'btn-stripes bg-[#72004A]'
                : 'bg-[#72004A] hover:bg-transparent hover:text-[#72004A]'
            }`}
          >
            <span className="relative z-10">
              {isThisPlaying ? `En écoute ${formatSeconds(remainingSeconds)}` : 'Écouter le podcast'}
            </span>
          </button>
        </div>
        
        <p className="font-heading text-[14px] text-[#72004A]">
          DISPONIBLE également sur les plateformes de STREAMING
        </p>
        </div>
      </div>
    );
}
