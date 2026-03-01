import { ArrowRight, BarChart3, PieChart, ShieldCheck, Target, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router';
import Logo from '../assets/logo.svg';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans overflow-x-hidden transition-colors duration-500">
      {/* Navbar */}
      <nav className="fixed w-full z-50 top-0 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="X-pense Logo" className="h-8" />
            <span className="text-2xl font-bold tracking-tight">
              <span className="text-[#3170dd]">X</span>-pense
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-semibold hover:text-[#3170dd] transition-colors"
            >
              Connexion
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-sm font-semibold bg-[#3170dd] text-white px-5 py-2.5 rounded-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
            >
              S'inscrire
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#3170dd] text-sm font-semibold mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-[#3170dd] animate-pulse" />
            La nouvelle gestion financière
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight animate-fade-in-up animation-delay-150">
            Reprenez le contrôle <br className="hidden md:block" />
            de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3170dd] to-blue-400">
              votre avenir financier
            </span>
            .
          </h1>

          <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-300">
            Fini le stress du 25 du mois. Découvrez une application magnifique qui transforme la
            gestion de votre argent en un jeu gratifiant et visuel.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up animation-delay-450">
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#3170dd] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-500/30"
            >
              Commencer l'expérience
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* The Problem / Empathy Section */}
      <section className="py-24 bg-white dark:bg-neutral-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight">
                Et si l'argent arrêtait d'être une angoisse ?
              </h2>
              <div className="space-y-6 text-lg text-neutral-600 dark:text-neutral-400">
                <p>
                  Les applications bancaires classiques sont froides. Elles vous disent{' '}
                  <strong>combien</strong> vous avez dépensé hier, mais ne vous aident pas à
                  planifier demain.
                </p>
                <p>
                  Résultat : culpabilité en regardant le solde fondre, abonnements oubliés, et
                  difficulté à épargner pour vos vrais projets.
                </p>
                <p className="font-semibold text-neutral-900 dark:text-white">
                  X-pense a été conçu avec une idée simple : la gestion financière doit être claire,
                  proactive, et esthétique.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-50 dark:bg-neutral-950 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                <PieChart className="w-10 h-10 text-[#3170dd] mb-4" />
                <h3 className="font-bold mb-2">Fini l'aveuglement</h3>
                <p className="text-sm text-neutral-500">
                  Visualisez exactement où va votre argent, catégorie par catégorie.
                </p>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-950 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm mt-8">
                <ShieldCheck className="w-10 h-10 text-emerald-500 mb-4" />
                <h3 className="font-bold mb-2">Zéro culpabilité</h3>
                <p className="text-sm text-neutral-500">
                  Des alertes douces avant de dépasser votre budget, pas après.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">
              Une méthode qui fonctionne enfin
            </h2>
            <p className="text-xl text-neutral-500">
              Pensé pour les humains, pas pour les comptables.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Wallet className="text-[#3170dd] w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Le Pouvoir des Enveloppes</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Créez des budgets plafonnés pour vos sorties ou courses. Remplissez la barre
                visuelle. Soyez alerté avant la limite pour garder le contrôle total.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="text-emerald-500 w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Épargne = Victoire 🏆</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                L'épargne devient un jeu. Fixez un objectif, suivez sa progression verte et
                lumineuse, et célébrez comme il se doit une fois atteint.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="text-purple-500 w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Une vue cristalline</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                Pour vos charges fixes ou factures récurrentes, utilisez les catégories de suivi. Un
                reporting simple pour comprendre les tendances sans aucune pression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-neutral-900 dark:bg-black rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden border border-neutral-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#3170dd]/20 blur-3xl rounded-full" />

          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 relative z-10">
            Prêt à transformer votre relation à l'argent ?
          </h2>
          <p className="text-xl text-neutral-400 mb-10 max-w-2xl mx-auto relative z-10">
            Rejoignez X-pense aujourd'hui. L'inscription prend moins de 30 secondes. C'est le début
            d'une vie financière sans stress.
          </p>

          <button
            onClick={() => navigate('/register')}
            className="relative z-10 bg-[#3170dd] text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-blue-600 hover:scale-105 transition-all shadow-xl shadow-blue-500/20"
          >
            Créer mon compte gratuitement
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-neutral-500 border-t border-neutral-200 dark:border-neutral-800">
        <p>© {new Date().getFullYear()} X-pense. Conçu avec soin pour votre santé financière.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
