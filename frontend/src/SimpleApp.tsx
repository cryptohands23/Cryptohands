import React, { useState, useEffect } from 'react';

const SimpleApp: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    // Simular carga inicial
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            💸
          </div>
          <h1 className="text-3xl font-bold text-blue-400 mb-2">Prompt Maestro</h1>
          <p className="text-white/60">Sistema Autónomo de Generación de Ingresos</p>
          <div className="mt-4 w-48 h-1 bg-white/10 rounded-full mx-auto">
            <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{width: '70%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-400">💸 Prompt Maestro</div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">Balance Total: <span className="text-green-400 font-bold">$11,000</span></div>
              <div className="text-sm text-gray-300">Ganancia: <span className="text-green-400 font-bold">+29.4%</span></div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-gray-800 min-h-screen border-r border-gray-700">
          <div className="p-4">
            <ul className="space-y-2">
              {[
                { id: 'dashboard', name: '📊 Dashboard', icon: '📊' },
                { id: 'strategies', name: '🤖 Estrategias', icon: '🤖' },
                { id: 'portfolio', name: '💼 Portfolio', icon: '💼' },
                { id: 'trades', name: '📈 Trades', icon: '📈' },
                { id: 'ai', name: '🧠 IA Maestro', icon: '🧠' },
                { id: 'analytics', name: '📊 Analytics', icon: '📊' },
                { id: 'exchanges', name: '🏦 Exchanges', icon: '🏦' },
                { id: 'settings', name: '⚙️ Configuración', icon: '⚙️' },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentPage(item.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {currentPage === 'dashboard' && <DashboardPage />}
          {currentPage === 'strategies' && <StrategiesPage />}
          {currentPage === 'portfolio' && <PortfolioPage />}
          {currentPage === 'trades' && <TradesPage />}
          {currentPage === 'ai' && <AIPage />}
          {currentPage === 'analytics' && <AnalyticsPage />}
          {currentPage === 'exchanges' && <ExchangesPage />}
          {currentPage === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold mb-8">Dashboard Principal</h1>
    
    {/* Métricas principales */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {[
        { title: 'Balance Total', value: '$11,000', change: '+$850', color: 'text-green-400' },
        { title: 'Ganancia Total', value: '+29.4%', change: '+2.1%', color: 'text-green-400' },
        { title: 'Bots Activos', value: '7', change: '+2', color: 'text-blue-400' },
        { title: 'ROI Diario', value: '+8.4%', change: '+1.2%', color: 'text-green-400' },
      ].map((metric, index) => (
        <div key={index} className="card">
          <h3 className="text-sm text-gray-400 mb-2">{metric.title}</h3>
          <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
          <div className={`text-sm ${metric.color}`}>{metric.change}</div>
        </div>
      ))}
    </div>

    {/* Estrategias activas */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="card">
        <h2 className="text-xl font-bold mb-4">🤖 Estrategias Activas</h2>
        <div className="space-y-4">
          {[
            { name: 'DCA Bitcoin', status: 'Activo', profit: '+15.2%', color: 'text-green-400' },
            { name: 'Grid ETH/USDT', status: 'Activo', profit: '+8.7%', color: 'text-green-400' },
            { name: 'Arbitrage Multi-Exchange', status: 'Activo', profit: '+12.1%', color: 'text-green-400' },
            { name: 'AI Scalping', status: 'Pausado', profit: '+3.2%', color: 'text-yellow-400' },
          ].map((strategy, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
              <div>
                <div className="font-medium text-white">{strategy.name}</div>
                <div className="text-sm text-gray-400">{strategy.status}</div>
              </div>
              <div className={`font-bold ${strategy.color}`}>{strategy.profit}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">🧠 IA Recomendaciones</h2>
        <div className="space-y-4">
          {[
            { 
              type: 'Optimización', 
              message: 'Incrementar allocation en Grid Trading (+2.3% ROI esperado)',
              priority: 'Alta'
            },
            { 
              type: 'Alerta', 
              message: 'Bitcoin muestra señales de sobrecompra. Considerar tomar ganancias.',
              priority: 'Media'
            },
            { 
              type: 'Oportunidad', 
              message: 'Arbitrage detectado: BTC precio 2.1% menor en KuCoin',
              priority: 'Alta'
            },
          ].map((rec, index) => (
            <div key={index} className="p-3 bg-gray-800 rounded-lg border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-blue-400">{rec.type}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  rec.priority === 'Alta' ? 'bg-red-600' : 'bg-yellow-600'
                }`}>
                  {rec.priority}
                </span>
              </div>
              <p className="text-sm text-gray-300">{rec.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const StrategiesPage: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold mb-8">🤖 Estrategias de Trading</h1>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[
        {
          name: 'DCA Inteligente',
          description: 'Compra periódica + rebalanceo automático',
          status: 'Activo',
          profit: '+15.2%',
          investment: '$2,500'
        },
        {
          name: 'Grid Trading',
          description: 'Compra/Venta por niveles de precio',
          status: 'Activo', 
          profit: '+8.7%',
          investment: '$1,800'
        },
        {
          name: 'Arbitrage Inter-Exchange',
          description: 'Diferencias de precio entre exchanges',
          status: 'Activo',
          profit: '+12.1%',
          investment: '$3,200'
        },
        {
          name: 'AI Scalping',
          description: 'Scalping con señales de IA',
          status: 'Pausado',
          profit: '+3.2%',
          investment: '$1,000'
        },
        {
          name: 'Copy Trading IA',
          description: 'Copia traders rentables seleccionados por IA',
          status: 'Configurando',
          profit: '0%',
          investment: '$0'
        },
        {
          name: 'DeFi Yield Farming',
          description: 'Automatización de yield farming',
          status: 'Próximamente',
          profit: '0%',
          investment: '$0'
        },
      ].map((strategy, index) => (
        <div key={index} className="card hover:bg-gray-800 transition-colors cursor-pointer">
          <h3 className="text-lg font-bold text-white mb-2">{strategy.name}</h3>
          <p className="text-sm text-gray-400 mb-4">{strategy.description}</p>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Estado:</span>
              <span className={`text-sm font-medium ${
                strategy.status === 'Activo' ? 'text-green-400' :
                strategy.status === 'Pausado' ? 'text-yellow-400' :
                'text-gray-400'
              }`}>
                {strategy.status}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Ganancia:</span>
              <span className={`text-sm font-bold ${
                parseFloat(strategy.profit) > 0 ? 'text-green-400' : 'text-gray-400'
              }`}>
                {strategy.profit}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Inversión:</span>
              <span className="text-sm font-medium text-white">{strategy.investment}</span>
            </div>
          </div>
          
          <button className="btn-primary w-full mt-4">
            {strategy.status === 'Activo' ? 'Configurar' : 
             strategy.status === 'Pausado' ? 'Reactivar' : 'Activar'}
          </button>
        </div>
      ))}
    </div>
  </div>
);

const PortfolioPage: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold mb-8">💼 Portfolio</h1>
    <div className="text-center py-20">
      <p className="text-white/60">Página en desarrollo...</p>
    </div>
  </div>
);

const TradesPage: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold mb-8">📈 Historial de Trades</h1>
    <div className="text-center py-20">
      <p className="text-white/60">Página en desarrollo...</p>
    </div>
  </div>
);

const AIPage: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold mb-8">🧠 IA Maestro</h1>
    
    <div className="card mb-8">
      <h2 className="text-xl font-bold mb-4">💬 Chat con IA Crítica</h2>
      <div className="bg-gray-800 rounded-lg p-4 h-64 overflow-y-auto mb-4">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm">🤖</div>
            <div className="flex-1">
              <div className="bg-gray-700 rounded-lg p-3">
                <p className="text-sm">¡Hola! Soy tu IA crítica. He analizado tu portfolio y tengo algunas recomendaciones:</p>
                <ul className="mt-2 text-sm space-y-1">
                  <li>• Tu estrategia DCA está funcionando bien (+15.2%)</li>
                  <li>• Considera reducir exposición a BTC (84.5% es alto riesgo)</li>
                  <li>• Oportunidad de arbitrage detectada en KuCoin</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <input 
          type="text" 
          placeholder="Pregunta algo a la IA..."
          className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
        />
        <button className="btn-primary">Enviar</button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="card">
        <h2 className="text-xl font-bold mb-4">🎯 Análisis Crítico Actual</h2>
        <div className="space-y-4">
          <div className="p-3 bg-yellow-900/20 border border-yellow-600 rounded-lg">
            <h3 className="font-medium text-yellow-400 mb-2">⚠️ Riesgo Detectado</h3>
            <p className="text-sm text-gray-300">Concentración excesiva en Bitcoin (84.5%). Recomiendo diversificar.</p>
          </div>
          
          <div className="p-3 bg-green-900/20 border border-green-600 rounded-lg">
            <h3 className="font-medium text-green-400 mb-2">✅ Oportunidad</h3>
            <p className="text-sm text-gray-300">Grid Trading ETH/USDT muestra potencial de +3.2% adicional.</p>
          </div>
          
          <div className="p-3 bg-blue-900/20 border border-blue-600 rounded-lg">
            <h3 className="font-medium text-blue-400 mb-2">💡 Optimización</h3>
            <p className="text-sm text-gray-300">Ajustar parámetros de DCA para capturar más volatilidad.</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold mb-4">📊 Métricas de IA</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Precisión de Predicciones:</span>
            <span className="text-green-400 font-bold">87.3%</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Decisiones Optimizadas:</span>
            <span className="text-blue-400 font-bold">156</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">ROI Mejorado por IA:</span>
            <span className="text-green-400 font-bold">+12.7%</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Riesgos Evitados:</span>
            <span className="text-yellow-400 font-bold">23</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AnalyticsPage: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold mb-8">📊 Analytics</h1>
    <div className="text-center py-20">
      <p className="text-white/60">Página en desarrollo...</p>
    </div>
  </div>
);

const ExchangesPage: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold mb-8">🏦 Exchanges</h1>
    <div className="text-center py-20">
      <p className="text-white/60">Página en desarrollo...</p>
    </div>
  </div>
);

const SettingsPage: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold mb-8">⚙️ Configuración</h1>
    <div className="text-center py-20">
      <p className="text-white/60">Página en desarrollo...</p>
    </div>
  </div>
);

export default SimpleApp;