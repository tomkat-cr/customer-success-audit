import { debug } from './utilities.tsx';

declare var apiBaseUrl: string; 
declare var grecaptcha: any;
declare var window: any;

export const loadRecaptcha = (siteKey: string) => {
    if (siteKey) {
        const recaptchaContainer = document.getElementById('recaptcha-container');
        window.onloadRecaptchaCallback = function() {
            if (debug) console.log('>> reCAPTCHA reseting...');
            try {
                grecaptcha.reset();
            } catch (error) {
                if (debug) console.error('Error resetting reCAPTCHA (probably not loaded yet`):', error);
            }
            if (debug) console.log('>> reCAPTCHA rendering...');
            try {
                grecaptcha.render(recaptchaContainer, {
                    'sitekey' : siteKey
                });
            } catch (error) {
                if (debug) console.error('Error rendering reCAPTCHA:', error);
            }
            if (debug) console.log('>> reCAPTCHA rendered successfully.');
        };
        const script = document.createElement('script');
        script.id = 'recaptcha-script';
        script.src = 'https://www.google.com/recaptcha/api.js?onload=onloadRecaptchaCallback&render=explicit';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        if (debug) console.log('reCAPTCHA loaded successfully. Key:', siteKey);
    } else {
        console.error('reCAPTCHA site key not found.');
        const container = document.getElementById('recaptcha-container');
        if(container) container.innerHTML = '<p class="g-recaptcha-error">reCAPTCHA could not be loaded [1].</p>';
    }
};

export const addRecaptchaEvent = () => {
    const result = <></>;
    const container = document.getElementById('recaptcha-container');
    if (!container) {
        console.error('>> reCAPTCHA container not found.');
        return result;
    }
    const recaptchaScript = document.getElementById('recaptcha-script');
    if (recaptchaScript) {
        recaptchaScript.remove();
    }
    if (debug) console.log('>> Adding recaptcha event');
    // Check if recaptcha key was alredy loaded in localStorage
    const siteKey = localStorage.getItem('rsk');
    if (siteKey) {
        loadRecaptcha(siteKey);
    } else {
        // Fetch recaptcha key from config.php, load it and save it in localStorage
        fetch(`${apiBaseUrl}/php/config.php`)
            .then(response => response.json())
            .then(data => {
                loadRecaptcha(data.siteKey);
                localStorage.setItem('rsk', data.siteKey);
            })
            .catch(error => {
                console.error('Error fetching reCAPTCHA config:', error);
                if(container) container.innerHTML = '<p class="g-recaptcha-error">reCAPTCHA could not be loaded [2].</p>';
            });
    }
    return result;
}