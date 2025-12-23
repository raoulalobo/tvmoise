'use client';

import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

/**
 * Composant Footer
 *
 * Rôle : Pied de page style Arte TV
 * - Fond noir avec liens blancs
 * - Logo Arte orange
 * - Colonnes de navigation
 * - Réseaux sociaux
 * - Informations légales
 *
 * Design : Style Arte épuré et professionnel
 */

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-arte-black border-t border-arte-gray-dark text-white">
      {/* Contenu principal du footer */}
      <div className="px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="bg-arte-orange px-3 py-1 inline-block">
              <span className="text-white text-2xl font-bold tracking-wider">MoiseTV</span>
            </div>
            <p className="text-arte-gray-light text-sm leading-relaxed">
              Votre chaîne de diffusion spirituelle. Découvrez nos programmes, cultes en direct et enseignements.
            </p>
            {/* Réseaux sociaux */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 border border-arte-gray-medium rounded-full flex items-center justify-center
                  hover:bg-arte-orange hover:border-arte-orange transition-all"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-arte-gray-medium rounded-full flex items-center justify-center
                  hover:bg-arte-orange hover:border-arte-orange transition-all"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-arte-gray-medium rounded-full flex items-center justify-center
                  hover:bg-arte-orange hover:border-arte-orange transition-all"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-arte-gray-medium rounded-full flex items-center justify-center
                  hover:bg-arte-orange hover:border-arte-orange transition-all"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Colonne 1 : Programmes */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">Programmes</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-arte-gray-light hover:text-arte-orange transition-colors">
                  Guide TV
                </a>
              </li>
              <li>
                <a href="#" className="text-arte-gray-light hover:text-arte-orange transition-colors">
                  En direct
                </a>
              </li>
              <li>
                <a href="#" className="text-arte-gray-light hover:text-arte-orange transition-colors">
                  Vidéos
                </a>
              </li>
              <li>
                <a href="#" className="text-arte-gray-light hover:text-arte-orange transition-colors">
                  Séries
                </a>
              </li>
              <li>
                <a href="#" className="text-arte-gray-light hover:text-arte-orange transition-colors">
                  Documentaires
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 2 : Catégories */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">Catégories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-arte-gray-light hover:text-arte-orange transition-colors">
                  Culture
                </a>
              </li>
              <li>
                <a href="#" className="text-arte-gray-light hover:text-arte-orange transition-colors">
                  Science
                </a>
              </li>
              <li>
                <a href="#" className="text-arte-gray-light hover:text-arte-orange transition-colors">
                  Découverte
                </a>
              </li>
              <li>
                <a href="#" className="text-arte-gray-light hover:text-arte-orange transition-colors">
                  Histoire
                </a>
              </li>
              <li>
                <a href="#" className="text-arte-gray-light hover:text-arte-orange transition-colors">
                  Société
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : À propos */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg">À propos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-arte-gray-light hover:text-arte-orange transition-colors">
                  Qui sommes-nous
                </a>
              </li>
              <li>
                <a href="#" className="text-arte-gray-light hover:text-arte-orange transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-arte-gray-light hover:text-arte-orange transition-colors">
                  Aide
                </a>
              </li>
              <li>
                <a href="#" className="text-arte-gray-light hover:text-arte-orange transition-colors">
                  Presse
                </a>
              </li>
              <li>
                <a href="#" className="text-arte-gray-light hover:text-arte-orange transition-colors">
                  Recrutement
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Barre de copyright */}
      <div className="border-t border-arte-gray-dark px-6 lg:px-12 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-arte-gray-light">
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <a href="#" className="hover:text-arte-orange transition-colors">
              Mentions légales
            </a>
            <span className="text-arte-gray-medium">•</span>
            <a href="#" className="hover:text-arte-orange transition-colors">
              Politique de confidentialité
            </a>
            <span className="text-arte-gray-medium">•</span>
            <a href="#" className="hover:text-arte-orange transition-colors">
              Cookies
            </a>
            <span className="text-arte-gray-medium">•</span>
            <a href="#" className="hover:text-arte-orange transition-colors">
              CGU
            </a>
          </div>
          <div className="text-arte-gray-light">
            © {currentYear} MoiseTV - Tous droits réservés
          </div>
        </div>
      </div>
    </footer>
  );
}
