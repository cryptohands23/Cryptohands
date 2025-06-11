import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  TrendingUp, 
  Bot, 
  Wallet, 
  BarChart3, 
  Settings, 
  Bell,
  Brain,
  X,
  Menu,
  DollarSign,
  Activity
} from 'lucide-react';
import { useAppStore } from '../../store';
import { Badge } from '../ui';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const { sidebarOpen, setSidebarOpen, unreadCount } = useAppStore();

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home, 
      path: '/',
      description: 'Vista general del sistema'
    },
    { 
      id: 'portfolio', 
      label: 'Portfolio', 
      icon: Wallet, 
      path: '/portfolio',
      description: 'Balance y activos'
    },
    { 
      id: 'strategies', 
      label: 'Estrategias', 
      icon: Bot, 
      path: '/strategies',
      description: 'Bots de trading'
    },
    { 
      id: 'trades', 
      label: 'Trades', 
      icon: TrendingUp, 
      path: '/trades',
      description: 'Historial de operaciones'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3, 
      path: '/analytics',
      description: 'Métricas y reportes'
    },
    { 
      id: 'ai', 
      label: 'IA Maestro', 
      icon: Brain, 
      path: '/ai',
      description: 'Recomendaciones IA'
    },
    { 
      id: 'exchanges', 
      label: 'Exchanges', 
      icon: Activity, 
      path: '/exchanges',
      description: 'Conexiones de exchange'
    },
    { 
      id: 'notifications', 
      label: 'Notificaciones', 
      icon: Bell, 
      path: '/notifications',
      description: 'Alertas del sistema',
      badge: unreadCount > 0 ? unreadCount : undefined
    },
    { 
      id: 'settings', 
      label: 'Configuración', 
      icon: Settings, 
      path: '/settings',
      description: 'Ajustes del sistema'
    },
  ];

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={sidebarOpen ? "open" : "closed"}
        className="fixed left-0 top-0 h-full w-64 glass-dark border-r border-white/10 z-50 lg:relative lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gradient">
                  Prompt Maestro
                </h1>
                <p className="text-xs text-white/60">
                  Crypto AI System
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <AnimatePresence>
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path;
                
                return (
                  <motion.div
                    key={item.id}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => {
                        onNavigate(item.path);
                        if (window.innerWidth < 1024) {
                          setSidebarOpen(false);
                        }
                      }}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
                        ${isActive 
                          ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30' 
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                        }
                      `}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-primary-400' : 'text-white/60 group-hover:text-white'}`} />
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge variant="danger" size="sm">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-white/40 group-hover:text-white/60">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="glass rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-white">Sistema Activo</span>
              </div>
              <div className="text-xs text-white/60">
                <div>Bots: 3 activos</div>
                <div>Uptime: 99.9%</div>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden p-2 glass rounded-lg"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>
    </>
  );
};

export default Sidebar;