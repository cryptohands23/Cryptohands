import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Bot, 
  Activity,
  Brain,
  Zap,
  Target,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data - En producción vendría de la API
const portfolioData = [
  { time: '00:00', value: 10000, btc: 8500, eth: 1500 },
  { time: '04:00', value: 10250, btc: 8700, eth: 1550 },
  { time: '08:00', value: 10100, btc: 8600, eth: 1500 },
  { time: '12:00', value: 10400, btc: 8800, eth: 1600 },
  { time: '16:00', value: 10650, btc: 9000, eth: 1650 },
  { time: '20:00', value: 10800, btc: 9100, eth: 1700 },
  { time: '24:00', value: 11000, btc: 9300, eth: 1700 },
];

const allocationData = [
  { name: 'Bitcoin', value: 45, color: '#F7931A' },
  { name: 'Ethereum', value: 30, color: '#627EEA' },
  { name: 'USDT', value: 15, color: '#26A17B' },
  { name: 'Otros', value: 10, color: '#8B5CF6' },
];

const strategies = [
  {
    id: '1',
    name: 'DCA Bitcoin Pro',
    type: 'DCA',
    status: 'active',
    profit: 1250.50,
    profitPercent: 12.5,
    trades: 45,
    winRate: 78,
  },
  {
    id: '2',
    name: 'Grid ETH/USDT',
    type: 'Grid',
    status: 'active',
    profit: 890.25,
    profitPercent: 8.9,
    trades: 123,
    winRate: 65,
  },
  {
    id: '3',
    name: 'Arbitrage Scanner',
    type: 'Arbitrage',
    status: 'paused',
    profit: 456.75,
    profitPercent: 4.6,
    trades: 23,
    winRate: 91,
  },
];

const aiRecommendations = [
  {
    id: '1',
    title: 'Oportunidad de Rebalanceo',
    description: 'Se detectó una desviación del 15% en la asignación objetivo de BTC',
    confidence: 85,
    impact: 'medium',
    action: 'Rebalancear portfolio',
  },
  {
    id: '2',
    title: 'Nueva Estrategia Sugerida',
    description: 'Condiciones favorables para implementar estrategia de scalping en SOL/USDT',
    confidence: 92,
    impact: 'high',
    action: 'Crear estrategia',
  },
];

const Dashboard: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Métricas principales */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="metric">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">Balance Total</p>
              <p className="text-2xl font-bold text-white">$11,000</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-success-400 mr-1" />
                <span className="text-sm text-success-400">+10% (24h)</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </Card>

        <Card variant="metric">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">P&L Total</p>
              <p className="text-2xl font-bold text-success-400">+$2,597</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-success-400 mr-1" />
                <span className="text-sm text-success-400">+23.6%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-success-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success-400" />
            </div>
          </div>
        </Card>

        <Card variant="metric">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">Bots Activos</p>
              <p className="text-2xl font-bold text-white">3</p>
              <div className="flex items-center mt-1">
                <CheckCircle className="w-4 h-4 text-success-400 mr-1" />
                <span className="text-sm text-white/60">2 ganando</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary-400" />
            </div>
          </div>
        </Card>

        <Card variant="metric">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/60">Win Rate</p>
              <p className="text-2xl font-bold text-white">78%</p>
              <div className="flex items-center mt-1">
                <Target className="w-4 h-4 text-primary-400 mr-1" />
                <span className="text-sm text-white/60">191 trades</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-warning-500/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-warning-400" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Performance */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Performance del Portfolio</h3>
                <p className="text-sm text-white/60">Últimas 24 horas</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">24H</Button>
                <Button variant="secondary" size="sm">7D</Button>
                <Button variant="ghost" size="sm">30D</Button>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3B82F6" 
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Asset Allocation */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white">Distribución de Activos</h3>
              <p className="text-sm text-white/60">Asignación actual</p>
            </div>
            
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F9FAFB'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-2">
              {allocationData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-white/70">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Estrategias y Recomendaciones IA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estrategias Activas */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">Estrategias Activas</h3>
                <p className="text-sm text-white/60">Bots de trading en ejecución</p>
              </div>
              <Button variant="primary" size="sm">
                <Bot className="w-4 h-4 mr-2" />
                Nueva Estrategia
              </Button>
            </div>
            
            <div className="space-y-4">
              {strategies.map((strategy) => (
                <div key={strategy.id} className="glass-dark rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{strategy.name}</h4>
                        <p className="text-xs text-white/60">{strategy.type}</p>
                      </div>
                    </div>
                    <Badge 
                      variant={strategy.status === 'active' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {strategy.status === 'active' ? 'Activo' : 'Pausado'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-white/60">P&L</p>
                      <p className={`text-sm font-medium ${
                        strategy.profit >= 0 ? 'text-success-400' : 'text-danger-400'
                      }`}>
                        ${strategy.profit.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Trades</p>
                      <p className="text-sm font-medium text-white">{strategy.trades}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Win Rate</p>
                      <p className="text-sm font-medium text-white">{strategy.winRate}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recomendaciones IA */}
        <motion.div variants={itemVariants}>
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-white">IA Maestro</h3>
                <p className="text-sm text-white/60">Recomendaciones inteligentes</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-white/60">Analizando...</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {aiRecommendations.map((rec) => (
                <div key={rec.id} className="glass-dark rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center mt-0.5">
                        <Brain className="w-4 h-4 text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-1">{rec.title}</h4>
                        <p className="text-sm text-white/70 mb-2">{rec.description}</p>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-1">
                            <Zap className="w-3 h-3 text-warning-400" />
                            <span className="text-xs text-white/60">
                              Confianza: {rec.confidence}%
                            </span>
                          </div>
                          <Badge 
                            variant={rec.impact === 'high' ? 'danger' : rec.impact === 'medium' ? 'warning' : 'info'}
                            size="sm"
                          >
                            {rec.impact === 'high' ? 'Alto Impacto' : rec.impact === 'medium' ? 'Medio' : 'Bajo'}
                          </Badge>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="success" size="sm">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Aceptar
                          </Button>
                          <Button variant="ghost" size="sm">
                            Más tarde
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="secondary" size="sm" fullWidth>
                <Brain className="w-4 h-4 mr-2" />
                Generar Nuevas Recomendaciones
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Acciones Rápidas</h3>
              <p className="text-sm text-white/60">Operaciones frecuentes</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="primary" className="h-20 flex-col">
              <Bot className="w-6 h-6 mb-2" />
              <span className="text-sm">Nueva Estrategia</span>
            </Button>
            
            <Button variant="secondary" className="h-20 flex-col">
              <Activity className="w-6 h-6 mb-2" />
              <span className="text-sm">Conectar Exchange</span>
            </Button>
            
            <Button variant="secondary" className="h-20 flex-col">
              <TrendingUp className="w-6 h-6 mb-2" />
              <span className="text-sm">Ver Analytics</span>
            </Button>
            
            <Button variant="secondary" className="h-20 flex-col">
              <Brain className="w-6 h-6 mb-2" />
              <span className="text-sm">Consultar IA</span>
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;