import { XCircle, Star, Trophy, Clock } from 'lucide-react';

import { auditReportPDF } from './auditReportPDF.tsx';
import { auditSections } from './auditSections.tsx';

type Answers = import('./dataDefinitions.tsx').Answers;
type UserInfo = import('./dataDefinitions.tsx').UserInfo;

export const calculateScore = (answers: Answers) => {
    let totalPoints = 0;
    let maxPoints = 0;

    auditSections.forEach(section => {
        section.questions.forEach(question => {
            maxPoints += Math.max(...question.options.map(opt => opt.points));
            if (answers[question.id] !== undefined) {
                totalPoints += answers[question.id];
            }
        });
    });

    return {
        points: totalPoints,
        maxPoints: maxPoints,
        percentage: Math.round((totalPoints / maxPoints) * 100)
    };
};

export const getPersonalizedRecommendations = (percentage: number, userInfo: UserInfo) => {
    const isLeadership = ['ceo', 'founder', 'cs-director'].includes(userInfo.role);
    const isLargeCompany = ['101-500', '500+'].includes(userInfo.customers);

    if (percentage >= 85) {
        return {
            level: "EXCEPCIONAL",
            color: "text-green-700",
            bgColor: "bg-gradient-to-r from-green-50 to-emerald-50",
            borderColor: "border-green-300",
            icon: <Trophy className="text-green-600" size={36} />,
            title: isLeadership ? "¡Liderazgo ejemplar en CS!" : "¡Estrategia excepcional!",
            description: isLargeCompany ?
                "Tu empresa está en el top 5% de organizaciones en Customer Success." :
                "Tienes una base sólida para escalar tu Customer Success.",
            nextSteps: isLeadership ? [
                "Documentar mejores prácticas para scaling",
                "Crear programa de mentoría para otras empresas",
                "Explorar oportunidades de expansion revenue",
                "Implementar predictive analytics avanzado"
            ] : [
                "Optimización continua basada en data",
                "Automatización de procesos manuales",
                "Benchmark con empresas similares",
                "Capacitación del equipo en técnicas avanzadas"
            ],
            urgency: "low",
            meetingType: "strategic"
        };
    } else if (percentage >= 70) {
        return {
            level: "MUY BUENO",
            color: "text-blue-700",
            bgColor: "bg-gradient-to-r from-blue-50 to-indigo-50",
            borderColor: "border-blue-300",
            icon: <Star className="text-blue-600" size={36} />,
            title: "Base sólida con oportunidades claras",
            description: "Tienes fundamentos fuertes, pero hay áreas específicas de mejora.",
            nextSteps: [
                "Audit detallado de las 3 áreas más débiles",
                "Plan de optimización de 60 días",
                "Implementar métricas predictivas",
                "Capacitar equipo en metodologías avanzadas"
            ],
            urgency: "medium",
            meetingType: "optimization"
        };
    } else if (percentage >= 50) {
        return {
            level: "PROMEDIO",
            color: "text-yellow-700",
            bgColor: "bg-gradient-to-r from-yellow-50 to-orange-50",
            borderColor: "border-yellow-300",
            icon: <Clock className="text-yellow-600" size={36} />,
            title: "Atención requerida - Riesgo moderado",
            description: isLargeCompany ?
                "Con tu volumen de clientes, estos gaps pueden ser costosos." :
                "Tu Customer Success necesita mejoras importantes.",
            nextSteps: isLeadership ? [
                "Consultoría estratégica inmediata",
                "Redefinición de proceso de CS",
                "Inversión urgente en herramientas",
                "Plan de retención de emergencia"
            ] : [
                "Audit completo con consultor externo",
                "Redefinición de estrategia de CS",
                "Inversión en herramientas y capacitación",
                "Definir quick wins para 30 días"
            ],
            urgency: "high",
            meetingType: "rescue"
        };
    } else {
        return {
            level: "CRÍTICO",
            color: "text-red-700",
            bgColor: "bg-gradient-to-r from-red-50 to-pink-50",
            borderColor: "border-red-300",
            icon: <XCircle className="text-red-600" size={36} />,
            title: isLargeCompany ? "¡EMERGENCIA EMPRESARIAL!" : "¡ALERTA ROJA! Riesgo crítico",
            description: isLargeCompany ?
                "Con tu base de clientes, esto representa pérdidas millonarias." :
                "Tu organización está en riesgo crítico de churn masivo.",
            nextSteps: [
                "🚨 Consulta de emergencia en 24-48 horas",
                "Plan de rescate inmediato",
                "Asignación de recursos críticos",
                "Comunicación urgente con clientes clave"
            ],
            urgency: "critical",
            meetingType: "emergency"
        };
    }
};

export const calculateLeadScore = (userInfo: { role: string; customers: string; }, score: { percentage: number }) => {
    let leadScore = 0;

    const roleScores: Record<string, number> = {
        'ceo': 100, 'founder': 100, 'cs-director': 90,
        'cs-manager': 80, 'sales': 60, 'marketing': 50, 'operations': 40
    };

    const sizeScores: Record<string, number> = {
        '500+': 100, '101-500': 80, '51-100': 60, '11-50': 40, '1-10': 20
    };

    leadScore += roleScores[userInfo.role] || 30;
    leadScore += sizeScores[userInfo.customers] || 10;

    if (score.percentage < 40) leadScore += 60;
    else if (score.percentage < 60) leadScore += 40;
    else if (score.percentage < 80) leadScore += 20;

    return Math.min(leadScore, 100);
};


export const generatePdfReport = (answers: Answers, userInfo: UserInfo) => {
    const score = calculateScore(answers);
    const recommendations = getPersonalizedRecommendations(score.percentage, userInfo);
    const doc = auditReportPDF(userInfo, score, recommendations, auditSections, answers);
    return doc;
}
