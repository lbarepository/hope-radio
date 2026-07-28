import { fetchPodcastChannel }       from '@/lib/podcasts';
import PodcastEpisodesSlider         from '@/components/podcasts/PodcastEpisodesSlider';

export default async function PodcastsPage() {
  const channel = await fetchPodcastChannel();

  return (
    <main className="min-h-screen py-16" style={{ background: '#310C52' }}>
      <div className="container mx-auto px-6 lg:px-0">
        <h1 className="font-nav font-[900] text-[64px] md:text-[88px] leading-[90%] text-white text-center uppercase mb-10">
          Podcasts
        </h1>

        {channel && channel.episodes.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-[32px] leading-[100%] text-white mb-12">
              {channel.title}
            </h2>
            <PodcastEpisodesSlider episodes={channel.episodes} />
          </section>
        )}
      </div>
    </main>
  );
}
