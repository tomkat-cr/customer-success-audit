import { calculateScore, calculateLeadScore } from './calculations.tsx';

type Answers = import('./dataDefinitions.tsx').Answers;

const calendlyUsername = import.meta.env.VITE_APP_CALENDLY_USERNAME;

export const generateCalendlyLink = (
    userInfo: { name: string; email: string; company: string; role: string; customers: string; },
    recommendations: { meetingType: string },
    answers: Answers
) => {
    const meetingTypes: Record<string, string> = {
        'emergency': 'emergency-cs-consultation',
        'rescue': 'urgent-cs-consultation',
        'optimization': 'cs-strategy-session',
        'strategic': 'cs-optimization-call'
    };

    const meetingType = meetingTypes[recommendations.meetingType] || 'cs-consultation';
    const baseUrl = `https://calendly.com/${calendlyUsername}?event_type=${meetingType}`;

    const params = new URLSearchParams({
        name: userInfo.name,
        email: userInfo.email,
        a1: userInfo.company,
        a2: `CS Score: ${calculateScore(answers).percentage}%`,
        a3: `Lead Score: ${calculateLeadScore(userInfo, calculateScore(answers))}`
    });

    return `${baseUrl}&${params.toString()}`;
};
