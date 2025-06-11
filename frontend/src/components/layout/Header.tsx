import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown,
  Wifi,
  WifiOff,
  AlertTriangle
} from 'lucide-react';
import { useAppStore } from '../../store';
import { Badge, Button } from '../ui';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { 
    user, 
    portfolio, 
    systemStatus, 
    unreadCount,
    setSidebarOpen,
    sidebarOpen 
  } = useAppStore();
  
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const getStatusColor = () => {
    if (!systemStatus) return 'text-white/40';
    switch (systemStatus.overall) {
      case 'healthy': return 'text-success-400';
      case 'warning': return 'text-warning-400';
      case 'error': return 'text-danger-400';
      default: return 'text-white/40';
    }
  };

  const getStatusIcon = () => {
    if (!systemStatus) return <WifiOff className="w-4 h-4" />;
    switch (systemStatus.overall) {
      case 'healthy': return <Wifi className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'error': return <WifiOff className="w-4 h-4" />;
      default: return <WifiOff className="w-4 h-4" />;
    }
  };

  return (
    <header className="glass-dark border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Title and breadcrumb */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div>
            <h1 className="text-xl font-bold text-white">{title}</h1>
            {subtitle && (
              <p className="text-sm text-white/60">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right side - Portfolio summary, notifications, user menu */}
        <div className="flex items-center space-x-4">
          {/* Portfolio Summary */}
          {portfolio && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:flex items-center space-x-4 px-4 py-2 glass rounded-lg"
            >
              <div className="text-right">
                <p className="text-xs text-white/60">Balance Total</p>
                <p className="text-sm font-bold text-white">
                  ${portfolio.totalValue.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/60">P&L 24h</p>
                <p className={`text-sm font-bold ${
                  portfolio.dailyChange >= 0 ? 'text-success-400' : 'text-danger-400'
                }`}>
                  {portfolio.dailyChange >= 0 ? '+' : ''}
                  ${portfolio.dailyChange.toLocaleString()} 
                  ({portfolio.dailyChangePercent.toFixed(2)}%)
                </p>
              </div>
            </motion.div>
          )}

          {/* System Status */}
          <div className="flex items-center space-x-2 px-3 py-2 glass rounded-lg">
            <div className={getStatusColor()}>
              {getStatusIcon()}
            </div>
            <span className="text-xs text-white/60 hidden sm:block">
              {systemStatus?.overall || 'Desconectado'}
            </span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-white/70" />
              {unreadCount > 0 && (
                <Badge 
                  variant="danger" 
                  size="sm"
                  className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 flex items-center justify-center"
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-2 w-80 glass-dark rounded-xl border border-white/10 shadow-xl z-50"
              >
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">Notificaciones</h3>
                    {unreadCount > 0 && (
                      <Badge variant="danger" size="sm">
                        {unreadCount} nuevas
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {/* Placeholder notifications */}
                  <div className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-success-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-white">Estrategia DCA BTC completada</p>
                        <p className="text-xs text-white/60 mt-1">Ganancia: +$125.50 (2.3%)</p>
                        <p className="text-xs text-white/40 mt-1">Hace 5 minutos</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-white">Nueva recomendación IA disponible</p>
                        <p className="text-xs text-white/60 mt-1">Oportunidad de arbitraje detectada</p>
                        <p className="text-xs text-white/40 mt-1">Hace 15 minutos</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t border-white/10">
                  <Button variant="ghost" size="sm" fullWidth>
                    Ver todas las notificaciones
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white">{user?.name || 'Usuario'}</p>
                <p className="text-xs text-white/60">{user?.email}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-white/60" />
            </button>

            {/* User dropdown */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="absolute right-0 mt-2 w-48 glass-dark rounded-xl border border-white/10 shadow-xl z-50"
              >
                <div className="p-2">
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <User className="w-4 h-4" />
                    <span>Perfil</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Configuración</span>
                  </button>
                  <hr className="my-2 border-white/10" />
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-danger-400 hover:text-danger-300 hover:bg-danger-500/10 rounded-lg transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;