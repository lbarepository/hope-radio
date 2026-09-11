import EquipeSection from '@/components/equipe/EquipeSection';

// Page "La radio" : histoire, équipe, chiffres clés, zones de diffusion.
// Seule la section Équipe est branchée pour le moment — le reste (histoire,
// chiffres clés, zones de diffusion) reste à construire.
export default function RadioPage() {
  return (
    <main className="min-h-screen bg-white">
      <EquipeSection />
    </main>
  );
}
