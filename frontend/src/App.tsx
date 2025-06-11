import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import { useAppStore } from './store';
import apiService from './services/api';
import wsService from './services/websocket';

// Crear cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      cacheTime: 10 * 60 * 1000, // 10 minutos
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Mock data para desarrollo
const mockUser = {
  id: '1',
  email: 'usuario@promptmaestro.com',
  name: 'Usuario Demo',
  avatar: '',
  createdAt: new Date().toISOString(),
  settings: {
    riskLevel: 'moderate' as const,
    autoReinvest: true,
    withdrawalThreshold: 1000,
    notifications: {
      email: true,
      push: true,
      trades: true,
      profits: true,
      losses: true,
    },
    twoFactorEnabled: false,
  },
};

const mockPortfolio = {
  totalValue: 11000,
  totalInvested: 8500,
  totalProfit: 2500,
  totalProfitPercent: 29.4,
  dailyChange: 850,
  dailyChangePercent: 8.4,
  assets: [
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 0.25,
      value: 9300,
      price: 37200,
      change24h: 1200,
      change24hPercent: 3.3,
      allocation: 84.5,
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 0.8,
      value: 1700,
      price: 2125,
      change24h: -50,
      change24hPercent: -2.9,
      allocation: 15.5,
    },
  ],
  allocation: [
    { name: 'Bitcoin', value: 9300, percentage: 84.5, color: '#F7931A' },
    { name: 'Ethereum', value: 1700, percentage: 15.5, color: '#627EEA' },
  ],
};

const mockSystemStatus = {
  overall: 'healthy' as const,
  services: [
    {
      name: 'API Gateway',
      status: 'online' as const,
      latency: 45,
      uptime: 99.9,
      lastCheck: new Date().toISOString(),
    },
    {
      name: 'Trading Engine',
      status: 'online' as const,
      latency: 23,
      uptime: 99.8,
      lastCheck: new Date().toISOString(),
    },
    {
      name: 'AI Engine',
      status: 'online' as const,
      latency: 156,
      uptime: 99.5,
      lastCheck: new Date().toISOString(),
    },
  ],
  lastUpdate: new Date().toISOString(),
};

function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    setUser, 
    setPortfolio, 
    setSystemStatus,
    isAuthenticated,
    user 
  } = useAppStore();

  // Inicialización de la aplicación
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        
        // Simular carga de datos iniciales
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Establecer datos mock
        setUser(mockUser);
        setPortfolio(mockPortfolio);
        setSystemStatus(mockSystemStatus);
        
        // En producción, aquí cargarías datos reales:
        // const userResponse = await apiService.getProfile();
        // const portfolioResponse = await apiService.getPortfolio();
        // const statusResponse = await apiService.getSystemStatus();
        
        // Conectar WebSocket
        // await wsService.connect();
        
      } catch (error) {
        console.error('Error initializing app:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [setUser, setPortfolio, setSystemStatus]);

  // Navegación
  const handleNavigate = (path: string) => {
    setCurrentPath(path);
  };

  // Obtener título de página
  const getPageTitle = () => {
    switch (currentPath) {
      case '/': return 'Dashboard';
      case '/portfolio': return 'Portfolio';
      case '/strategies': return 'Estrategias de Trading';
      case '/trades': return 'Historial de Trades';
      case '/analytics': return 'Analytics';
      case '/ai': return 'IA Maestro';
      case '/exchanges': return 'Exchanges';
      case '/notifications': return 'Notificaciones';
      case '/settings': return 'Configuración';
      default: return 'Prompt Maestro';
    }
  };

  const getPageSubtitle = () => {
    switch (currentPath) {
      case '/': return 'Panel de control principal';
      case '/portfolio': return 'Gestión de activos y balance';
      case '/strategies': return 'Bots automatizados de trading';
      case '/trades': return 'Registro de operaciones';
      case '/analytics': return 'Métricas y reportes detallados';
      case '/ai': return 'Recomendaciones inteligentes';
      case '/exchanges': return 'Conexiones de intercambio';
      case '/notifications': return 'Alertas y avisos del sistema';
      case '/settings': return 'Configuración del sistema';
      default: return '';
    }
  };

  // Renderizar página actual
  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return <Dashboard />;
      case '/portfolio':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Portfolio</h2>
            <p className="text-white/60">Página en desarrollo...</p>
          </div>
        );
      case '/strategies':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Estrategias</h2>
            <p className="text-white/60">Página en desarrollo...</p>
          </div>
        );
      case '/trades':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Trades</h2>
            <p className="text-white/60">Página en desarrollo...</p>
          </div>
        );
      case '/analytics':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Analytics</h2>
            <p className="text-white/60">Página en desarrollo...</p>
          </div>
        );
      case '/ai':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">IA Maestro</h2>
            <p className="text-white/60">Página en desarrollo...</p>
          </div>
        );
      case '/exchanges':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Exchanges</h2>
            <p className="text-white/60">Página en desarrollo...</p>
          </div>
        );
      case '/notifications':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Notificaciones</h2>
            <p className="text-white/60">Página en desarrollo...</p>
          </div>
        );
      case '/settings':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Configuración</h2>
            <p className="text-white/60">Página en desarrollo...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto animate-pulse">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-blue-400 mb-2">💸 Prompt Maestro</h1>
          <p className="text-white/60">Inicializando sistema...</p>
          <div className="mt-4 w-48 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <Layout
          title={getPageTitle()}
          subtitle={getPageSubtitle()}
          currentPath={currentPath}
          onNavigate={handleNavigate}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPath}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderCurrentPage()}
            </motion.div>
          </AnimatePresence>
        </Layout>
      </div>
    </QueryClientProvider>
  );
}

export default App;
