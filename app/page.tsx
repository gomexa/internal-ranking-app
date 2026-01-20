'use client';

import { Layout } from '@/components/layout/Layout';
import { RankingTable, SeasonSelector } from '@/components/ranking';
import { useRanking } from '@/hooks';
import {RANKING_REQUIREMENTS, EVENT_WEIGHTS, CATEGORY_THRESHOLDS} from '@/lib/constants';

export default function HomePage() {
  const { ranking, loading, error, season, changeSeason } = useRanking();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ranking</h1>
            <p className="text-gray-600 mt-1">
              Clasificación de deportistas por efectividad ponderada
            </p>
          </div>
          <SeasonSelector value={season} onChange={changeSeason} />
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2"><b>Requisitos para clasificar</b></h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc pl-5">
              <li>Participar mínimo en {RANKING_REQUIREMENTS.minEvents} eventos.</li>
              <li>De los 4 eventos al menos {RANKING_REQUIREMENTS.minOfficialEvents} deben ser competencias oficiales.</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-2">Cálculo del Ponderado</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li><strong>Oficiales:</strong> Efectividad × {EVENT_WEIGHTS.official}</li>
              <li><strong>Internos:</strong> Efectividad × {EVENT_WEIGHTS.internal}</li>
              <li className="pt-1 border-t border-green-200">
                <strong>Score Final</strong> = Σ(Efectividad Ponderada) ÷ Nº Eventos
              </li>
            </ul>
          </div>
        </div>

        <RankingTable ranking={ranking} loading={loading} />

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-3">Categorías</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-900">
            {
                CATEGORY_THRESHOLDS.map((threshold) => (
                    <div key={threshold.category} className="flex items-center gap-2">
                    <span
                        className={`w-3 h-3 rounded-full ${
                        threshold.category === 'Master' ? 'bg-yellow-500' :
                        threshold.category === 'Avanzado' ? 'bg-blue-500' :
                        threshold.category === 'Intermedio' ? 'bg-green-500' :
                        'bg-gray-500'
                        }`}
                    ></span>
                    <span>
                        {threshold.category}: {threshold.min}%{threshold.max ? ` - ${threshold.max}%` : '+'}
                    </span>
                    </div>
                ))
                }
            {/*<div className="flex items-center gap-2">*/}
            {/*  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>*/}
            {/*  <span>Master: ≥ 85%</span>*/}
            {/*</div>*/}
            {/*<div className="flex items-center gap-2">*/}
            {/*  <span className="w-3 h-3 rounded-full bg-blue-500"></span>*/}
            {/*  <span>Avanzado: 75% - 84.99%</span>*/}
            {/*</div>*/}
            {/*<div className="flex items-center gap-2">*/}
            {/*  <span className="w-3 h-3 rounded-full bg-green-500"></span>*/}
            {/*  <span>Intermedio: 65% - 74.99%</span>*/}
            {/*</div>*/}
            {/*<div className="flex items-center gap-2">*/}
            {/*  <span className="w-3 h-3 rounded-full bg-gray-500"></span>*/}
            {/*  <span>Iniciación: &lt; 65%</span>*/}
            {/*</div>*/}
          </div>
        </div>
      </div>
    </Layout>
  );
}
