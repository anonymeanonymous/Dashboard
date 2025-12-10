import { X, Lightbulb } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal = ({ onClose }: HelpModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            Guide d'utilisation
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Importer vos données</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-700">
                • Cliquez sur la zone de dépôt pour sélectionner un fichier Excel (.xlsx ou .xls)
              </p>
              <p className="text-sm text-gray-700">
                • L'application lit automatiquement toutes les feuilles du fichier
              </p>
              <p className="text-sm text-gray-700">
                • Les colonnes sont analysées pour détecter leur type (texte, nombre, date)
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Visualisations automatiques</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-700">
                • L'IA analyse vos données et suggère automatiquement les meilleurs graphiques
              </p>
              <p className="text-sm text-gray-700">
                • Les graphiques apparaissent immédiatement dans le dashboard
              </p>
              <p className="text-sm text-gray-700">
                • Vous pouvez ajouter d'autres graphiques avec le bouton "Add Custom Chart"
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Personnaliser les graphiques</h3>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-700">
                • Cliquez sur l'icône d'édition (crayon) pour personnaliser un graphique
              </p>
              <p className="text-sm text-gray-700">
                • Changez le type de graphique (bar, line, pie, etc.)
              </p>
              <p className="text-sm text-gray-700">
                • Modifiez les axes, les couleurs et l'agrégation (somme, moyenne, etc.)
              </p>
              <p className="text-sm text-gray-700">
                • Appliquez des filtres pour affiner les données affichées
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Filtrer les données</h3>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-700">
                • Chaque graphique peut avoir ses propres filtres
              </p>
              <p className="text-sm text-gray-700">
                • Cliquez sur "Filtres" pour ajouter des conditions
              </p>
              <p className="text-sm text-gray-700">
                • Conditions disponibles: Equals, Contains, Greater, Less, Between
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Organiser votre dashboard</h3>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-700">
                • Glissez-déposez la barre grise pour déplacer un graphique
              </p>
              <p className="text-sm text-gray-700">
                • Redimensionnez en tirant le coin inférieur droit
              </p>
              <p className="text-sm text-gray-700">
                • Supprimez un graphique avec l'icône de corbeille
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Exporter votre dashboard</h3>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              <p className="text-sm text-gray-700">
                • Cliquez sur "Export as PDF" pour télécharger en format PDF
              </p>
              <p className="text-sm text-gray-700">
                • Cliquez sur "Export as PNG" pour télécharger en image
              </p>
              <p className="text-sm text-gray-700">
                • Idéal pour les présentations et rapports
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Types de graphiques disponibles</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 min-w-fit">Bar Chart</span>
                <span className="text-sm text-gray-700">Comparer des valeurs par catégories</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 min-w-fit">Line Chart</span>
                <span className="text-sm text-gray-700">Afficher les tendances dans le temps</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 min-w-fit">Area Chart</span>
                <span className="text-sm text-gray-700">Visualiser les valeurs cumulées</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 min-w-fit">Pie Chart</span>
                <span className="text-sm text-gray-700">Afficher les parts d'un ensemble</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 min-w-fit">Metric Card</span>
                <span className="text-sm text-gray-700">Afficher un nombre important</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-blue-600 min-w-fit">Data Table</span>
                <span className="text-sm text-gray-700">Voir les données brutes sous forme de tableau</span>
              </div>
            </div>
          </section>
        </div>

        <div className="flex justify-end gap-2 p-6 border-t sticky bottom-0 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium"
          >
            Compris !
          </button>
        </div>
      </div>
    </div>
  );
};
