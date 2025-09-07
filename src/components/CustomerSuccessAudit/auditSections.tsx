import { Target } from "lucide-react";
import { TrendingUp } from "lucide-react";
import { Users } from "lucide-react";

export const auditSections = [
    {
      title: "Fundamentos de Customer Success",
      subtitle: "Estrategia, recursos y procesos base",
      icon: <Target className="text-blue-600" size={24} />,
      questions: [
        {
          id: 'strategy',
          question: '¿Tienes una estrategia formal de CS (Customer Success) documentada?',
          options: [
            { text: 'Sí, completamente desarrollada y comunicada', points: 25 },
            { text: 'Sí, pero necesita refinamiento', points: 15 },
            { text: 'Existe informalmente', points: 8 },
            { text: 'No existe', points: 0 }
          ]
        },
        {
          id: 'alignment',
          question: '¿Están alineados los objetivos de CS con los objetivos de negocio?',
          options: [
            { text: 'Completamente alineados con métricas claras', points: 20 },
            { text: 'Mayormente alineados', points: 12 },
            { text: 'Parcialmente alineados', points: 6 },
            { text: 'No están alineados', points: 0 }
          ]
        },
        {
          id: 'team',
          question: '¿Tienes un equipo dedicado de Customer Success?',
          options: [
            { text: 'Sí, equipo especializado y bien estructurado', points: 25 },
            { text: 'Sí, pero necesita más recursos', points: 15 },
            { text: 'Personal parcialmente dedicado', points: 8 },
            { text: 'No hay equipo dedicado', points: 0 }
          ]
        }
      ]
    },
    {
      title: "Métricas y Análisis",
      subtitle: "Medición, análisis y predicción",
      icon: <TrendingUp className="text-green-600" size={24} />,
      questions: [
        {
          id: 'churn',
          question: '¿Mides y monitoreas el Churn Rate (Tasa de Abandono) regularmente?',
          options: [
            { text: 'Sí, con análisis detallado por segmentos', points: 25 },
            { text: 'Sí, métricas básicas mensuales', points: 15 },
            { text: 'Ocasionalmente', points: 8 },
            { text: 'No lo medimos', points: 0 }
          ]
        },
        {
          id: 'health',
          question: '¿Tienes un sistema de Customer Health Score (para medir la probabilidad de permanencia o abandono de los clientes)?',
          options: [
            { text: 'Sistema automatizado y preciso', points: 25 },
            { text: 'Sistema manual pero efectivo', points: 15 },
            { text: 'Sistema básico', points: 8 },
            { text: 'No tenemos health scoring', points: 0 }
          ]
        },
        {
          id: 'nps',
          question: '¿Mides NPS/CSAT regularmente (escala de satisfacción de clientes)?',
          options: [
            { text: 'Sí, con seguimiento de tendencias', points: 20 },
            { text: 'Sí, medición básica', points: 12 },
            { text: 'Ocasionalmente', points: 6 },
            { text: 'No medimos satisfacción', points: 0 }
          ]
        }
      ]
    },
    {
      title: "Experiencia del Cliente",
      subtitle: "Comunicación, engagement y resolución",
      icon: <Users className="text-purple-600" size={24} />,
      questions: [
        {
          id: 'communication',
          question: '¿Mantienes comunicación proactiva con los clientes?',
          options: [
            { text: 'Comunicación sistemática y personalizada', points: 25 },
            { text: 'Comunicación regular pero básica', points: 15 },
            { text: 'Comunicación ocasional', points: 8 },
            { text: 'Solo comunicación reactiva', points: 0 }
          ]
        },
        {
          id: 'risk',
          question: '¿Tienes un proceso para identificar clientes en riesgo?',
          options: [
            { text: 'Sistema automatizado de "early warning" (riesgo temprano)', points: 20 },
            { text: 'Proceso manual pero efectivo', points: 12 },
            { text: 'Identificación básica', points: 6 },
            { text: 'Sin proceso de identificación', points: 0 }
          ]
        },
        {
          id: 'onboarding',
          question: '¿Tienes un proceso de Onboarding estructurado (Registro, Activación, Uso, Retención)?',
          options: [
            { text: 'Proceso completo con métricas de adopción', points: 25 },
            { text: 'Proceso básico pero efectivo', points: 15 },
            { text: 'Proceso informal', points: 8 },
            { text: 'Sin proceso estructurado', points: 0 }
          ]
        }
      ]
    }
  ];
