import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  PieChart,
  ShieldCheck,
  Target,
  TrendingDown,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
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
            <span className="text-2xl font-black tracking-tight">
              <span className="text-[#3170dd]">X</span>pense
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-semibold hover:text-[#3170dd] transition-colors"
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
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        {/* Background glow elements */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-600/5 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-[#3170dd] text-sm font-bold mb-8 shadow-sm border border-blue-200 dark:border-blue-800">
              <Zap size={18} className="text-amber-500 animate-pulse" />
              La nouvelle gestion financière
            </div>

            <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
              Reprenez le contrôle <br className="hidden md:block" />
              de{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3170dd] via-blue-500 to-indigo-400">
                votre avenir financier
              </span>
              .
            </h1>

            <p className="text-xl text-neutral-600 dark:text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Fini le stress du 25 du mois. Découvrez l'application qui transforme la gestion de
              votre argent en une expérience visuelle, sereine et intelligente.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <button
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#3170dd] text-white px-10 py-4 rounded-full text-lg font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-500/30 active:scale-95"
              >
                Explorer gratuitement
                <ArrowRight size={22} />
              </button>
            </div>
          </motion.div>

          {/* App Mockup Rendering - Using user-provided screenshots logic */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative w-full max-w-5xl mx-auto perspective-1000"
          >
            <div className="relative rounded-[2.5rem] border-[12px] border-neutral-900 dark:border-neutral-800 shadow-2xl overflow-hidden bg-neutral-900 scale-100 rotate-1 transform-gpu">
              {/* This represents the main dashboard view */}
              <div className="aspect-[16/10] bg-neutral-950 overflow-hidden relative">
                {/* Visual representation of the dashboard based on screenshots */}
                <div className="absolute inset-0 bg-[#0a0a0a] p-4 flex flex-col gap-4">
                  {/* Dashboard Header Mock */}
                  <div className="flex justify-between items-center mb-2">
                    <div className="h-6 w-32 bg-neutral-800 rounded-lg animate-pulse" />
                    <div className="h-8 w-40 bg-[#3170dd]/20 rounded-full border border-[#3170dd]/30" />
                  </div>
                  {/* Grid Mock */}
                  <div className="grid grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map(i => (
                      <div
                        key={i}
                        className="h-20 bg-neutral-900 rounded-2xl border border-neutral-800"
                      />
                    ))}
                  </div>
                  {/* Charts Mock */}
                  <div className="grid grid-cols-2 gap-4 flex-grow">
                    <div className="bg-neutral-900 rounded-3xl border border-neutral-800 flex items-center justify-center">
                      <BarChart3 className="w-12 h-12 text-[#3170dd]/50" />
                    </div>
                    <div className="bg-neutral-900 rounded-3xl border border-neutral-800 flex items-center justify-center">
                      <PieChart className="w-12 h-12 text-blue-400/50" />
                    </div>
                  </div>
                </div>

                {/* Floating elements to simulate depth */}
                <div className="absolute top-1/4 -right-12 w-64 h-48 bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 -rotate-6 hidden lg:block">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Zap className="text-green-500 w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500">Objectif atteint !</div>
                      <div className="font-bold text-sm">Vacances 🏖️</div>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                    <div className="w-[100%] h-full bg-green-500" />
                  </div>
                </div>
              </div>
            </div>
            {/* Soft shadow below mockup */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-12 bg-blue-500/20 blur-[60px] -z-10" />
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Trust Marks */}
      <section className="py-12 border-y border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-12 lg:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-xl font-black">
              <Users className="text-[#3170dd]" />
              <span>+500 Utilisateurs</span>
            </div>
            <div className="flex items-center gap-2 text-xl font-black">
              <ShieldCheck className="text-emerald-500" />
              <span>Données Sécurisées</span>
            </div>
            <div className="flex items-center gap-2 text-xl font-black">
              <CheckCircle2 className="text-blue-500" />
              <span>97% Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem / Empathy Section */}
      <section className="py-24 bg-white dark:bg-neutral-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black mb-8 tracking-tight">
                Et si l'argent arrêtait d'être une angoisse ?
              </h2>
              <div className="space-y-6 text-lg text-neutral-600 dark:text-neutral-400">
                <p>
                  Les applications bancaires classiques sont froides. Elles vous disent tardivement{' '}
                  <strong>combien</strong> vous avez déjà perdu, mais ne vous aident pas à sauver
                  demain.
                </p>
                <p>
                  C'est la <strong>charge mentale</strong> constante : calculer de tête au
                  restaurant, oublier ses abonnements, ou voir son épargne stagner sans comprendre
                  pourquoi.
                </p>
                <p className="font-bold text-neutral-900 dark:text-white p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border-l-4 border-[#3170dd]">
                  X-pense a été conçu pour briser ce cycle. C'est une méthode proactive qui vous
                  alerte avant que l'erreur ne soit commise.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-neutral-50 dark:bg-neutral-950 p-8 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 shadow-sm hover:scale-105 transition-transform">
                <TrendingDown className="w-12 h-12 text-[#3170dd] mb-6" />
                <h3 className="text-lg font-bold mb-3">Zéro surprise</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Des alertes douces dès que vous approchez de 80% de votre budget.
                </p>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-950 p-8 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 shadow-sm mt-8 hover:scale-105 transition-transform">
                <ShieldCheck className="w-12 h-12 text-emerald-500 mb-6" />
                <h3 className="text-lg font-bold mb-3">Confiance totale</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Savoir exactement ce qu'il vous reste "vraiment" à dépenser.
                </p>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-950 p-8 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 shadow-sm -mt-8 hover:scale-105 transition-transform">
                <BarChart3 className="w-12 h-12 text-purple-500 mb-6" />
                <h3 className="text-lg font-bold mb-3">Vision claire</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Visualisez exactement où va votre argent sans aucun effort.
                </p>
              </div>
              <div className="bg-neutral-50 dark:bg-neutral-950 p-8 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 shadow-sm hover:scale-105 transition-transform">
                <Target className="w-12 h-12 text-amber-500 mb-6" />
                <h3 className="text-lg font-bold mb-3">Avenir serein</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
                  Transformez vos projets flous en objectifs d'épargne concrets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-neutral-50 dark:bg-neutral-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6">
              Une méthode qui fonctionne enfin
            </h2>
            <p className="text-xl text-neutral-500 max-w-2xl mx-auto">
              Pensé pour les humains, pas pour les comptables. Trois façons de gérer, une seule de
              réussir.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-10 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <Wallet className="text-[#3170dd] w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4">Le Pouvoir des Enveloppes</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Créez des budgets plafonnés pour vos sorties ou courses. Remplissez la barre
                visuelle. Soyez alerté avant la limite pour garder le contrôle total sur vos envies.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-10 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-rotate-3 transition-transform">
                <Target className="text-emerald-500 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4">Épargne = Victoire 🏆</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                L'épargne devient un accomplissement. Fixez un objectif, suivez sa progression verte
                et lumineuse, et célébrez chaque victoire sur le chemin de vos projets.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-10 border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                <BarChart3 className="text-purple-500 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black mb-4">Analyse sans pression</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Pour vos charges fixes, utilisez les catégories de suivi. Un reporting visuel et
                intelligent pour comprendre vos habitudes sans aucune culpabilité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section Mock */}
      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#3170dd] rounded-[3rem] p-12 lg:p-20 text-white relative flex flex-col lg:flex-row items-center gap-12 overflow-hidden shadow-2xl shadow-blue-500/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full -mr-48 -mt-48" />

            <div className="lg:w-1/2 relative z-10">
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map(s => (
                  <Zap key={s} size={20} fill="#fff" />
                ))}
              </div>
              <blockquote className="text-3xl lg:text-4xl font-bold leading-tight mb-8">
                "J'ai testé 5 apps de budget. X-pense est la seule qui ne me fait pas culpabiliser.
                Tout est enfin visuel, simple et logique."
              </blockquote>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-400/30 border border-white/20" />
                <div>
                  <div className="font-bold text-lg text-white">Marc D.</div>
                  <div className="text-blue-100 text-sm opacity-80">
                    Indépendant, utilisateur depuis 4 mois
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 grid grid-cols-2 gap-4 relative z-10">
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10">
                <div className="text-4xl font-black mb-1">92%</div>
                <div className="text-sm opacity-80">
                  réduisent leurs dépenses inutiles dès le 1er mois
                </div>
              </div>
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10">
                <div className="text-4xl font-black mb-1">+450€</div>
                <div className="text-sm opacity-80">d'épargne moyenne supplémentaire par an</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl lg:text-6xl font-black mb-8 tracking-tighter">
            Prêt à briser le cycle ?
          </h2>
          <p className="text-xl text-neutral-500 mb-12 max-w-2xl mx-auto">
            Rejoignez X-pense aujourd'hui. L'inscription prend moins de 30 secondes. Reprenez
            possession de votre avenir financier maintenant.
          </p>

          <button
            onClick={() => navigate('/register')}
            className="group relative inline-flex items-center justify-center px-12 py-5 font-bold text-white transition-all duration-300 bg-[#3170dd] rounded-full hover:bg-blue-700 hover:scale-105 shadow-2xl shadow-blue-500/30"
          >
            Créer mon compte gratuitement
            <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
          </button>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm font-semibold text-neutral-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" /> Gratuit
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" /> Sans engagement
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" /> 100% Sécurisé
            </span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="X-pense Logo" className="h-6" />
            <span className="text-lg font-bold tracking-tight">
              <span className="text-[#3170dd]">X</span>-pense
            </span>
          </div>

          <div className="flex gap-8 text-sm font-medium text-neutral-500">
            <span className="hover:text-[#3170dd] cursor-pointer transition-colors">
              Politique de confidentialité
            </span>
            <span className="hover:text-[#3170dd] cursor-pointer transition-colors">
              Conditions d'utilisation
            </span>
            <span className="hover:text-[#3170dd] cursor-pointer transition-colors">Contact</span>
          </div>

          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Xpense. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
