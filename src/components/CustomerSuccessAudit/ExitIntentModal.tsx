import { AlertTriangle } from 'lucide-react';
import { trackEvent } from '../../utilities/google_tag.tsx';

export const ExitIntentModal = ({showExitIntent, setShowExitIntent}: {showExitIntent: boolean, setShowExitIntent: (value: boolean) => void}) => (
    showExitIntent && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full 1animate-bounce">
          <div className="text-center">
            <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold mb-4">¡Espera! ¿Seguro que quieres irte?</h3>
            <p className="text-gray-600 mb-6">
              El 73% de empresas que no evalúan su CS pierden un 40% más clientes
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowExitIntent(false);
                  trackEvent('exit_intent_continued');
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg"
              >
                🚀 Completar Audit (Solo 3 minutos)
              </button>
              <button
                onClick={() => {
                  setShowExitIntent(false);
                  trackEvent('exit_intent_dismissed');
                }}
                className="w-full text-gray-500 text-sm"
              >
                No, continuar sin saber mi score
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
