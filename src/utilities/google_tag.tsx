import { debug } from './utilities.tsx';

// Analytics tracking
declare var gtag: any;

export const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
    gtag('event', eventName, properties);
    if (debug) console.log('Event tracked:', eventName, properties);
};
