# 💸 Prompt Maestro: Sistema Autónomo de Generación de Ingresos con Criptomonedas

## 🎯 Descripción

**Prompt Maestro** es un ecosistema completo y autónomo que genera ingresos sostenibles con criptomonedas mediante:

- ✅ **Operación con exchanges reales** (Binance, KuCoin, Kraken, OKX)
- ✅ **Múltiples estrategias automatizadas** (DCA, Grid, Arbitrage, AI)
- ✅ **IA crítica** que evalúa y mejora continuamente las decisiones
- ✅ **Interfaz web intuitiva** con estadísticas en tiempo real
- ✅ **Seguridad robusta** con cifrado de APIs y 2FA
- ✅ **Escalabilidad** desde $100 hasta montos institucionales

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   AI Engine     │
│   React + UI    │◄──►│  Node.js API    │◄──►│  Evaluador IA   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
         │  Trading Bots   │    │   Database      │    │   Exchanges     │
         │  Python + ccxt  │◄──►│ PostgreSQL+Redis│◄──►│ Binance, etc.   │
         └─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Inicio Rápido

### Prerrequisitos
- Docker & Docker Compose
- Node.js 18+
- Python 3.9+
- APIs de exchanges (Binance, KuCoin, etc.)

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/cryptohands23/Cryptohands.git
cd Cryptohands

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus APIs

# Levantar servicios
docker-compose up -d

# Acceder a la aplicación
open http://localhost:3000
```

## 📊 Estrategias Disponibles

### 🧠 Básicas
- **DCA Inteligente**: Compra periódica + rebalanceo automático
- **Grid Trading**: Compra/Venta por niveles dinámicos
- **Copy Trading IA**: Selección automática de traders rentables
- **Scalping**: Basado en MACD, RSI, EMA

### 🧠 Avanzadas
- **Arbitraje Inter-Exchange**: Diferencias de precio entre exchanges
- **Market Making**: Provisión de liquidez automatizada
- **AI Reinforcement**: Bots que aprenden por refuerzo
- **Sentiment Trading**: Reacción a noticias y sentimiento

## 🔒 Seguridad

- 🔐 **Cifrado de APIs** con Vault/KMS
- 🔑 **Autenticación 2FA** obligatoria
- 🛡️ **Validación de transacciones** en tiempo real
- 📊 **Auditoría completa** de todas las operaciones
- 🚫 **Límites de riesgo** configurables por usuario

## 📈 Características Principales

- **Inversión mínima**: $100 USD
- **Retiros automáticos**: Configurables por ganancia/tiempo
- **Backtesting**: Simulación con datos históricos
- **Modo demo**: Pruebas sin riesgo real
- **Reportes IA**: Análisis crítico y recomendaciones
- **Escalabilidad**: Desde personal hasta institucional

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + Tailwind CSS + Vite
- **Backend**: Node.js + Fastify + TypeScript
- **Bots**: Python + ccxt + pandas + numpy
- **IA**: LangChain + OpenRouter + Hugging Face
- **Database**: PostgreSQL + Redis
- **Infraestructura**: Docker + Nginx + Certbot

## 📚 Documentación

- [🏗️ Arquitectura Detallada](./docs/architecture.md)
- [🤖 Guía de Bots](./docs/bots.md)
- [🧠 Sistema de IA](./docs/ai-system.md)
- [🔒 Seguridad](./docs/security.md)
- [📊 APIs](./docs/api.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/nueva-estrategia`)
3. Commit tus cambios (`git commit -am 'Añadir nueva estrategia'`)
4. Push a la rama (`git push origin feature/nueva-estrategia`)
5. Abre un Pull Request

## ⚠️ Disclaimer

Este software es para fines educativos y de investigación. El trading de criptomonedas conlleva riesgos significativos. Nunca inviertas más de lo que puedes permitirte perder.

## 📄 Licencia

Apache License 2.0 - ver [LICENSE](LICENSE) para detalles.

---

**💡 ¿Listo para generar ingresos pasivos con cripto?** ¡Empieza con $100 y deja que la IA haga el trabajo!