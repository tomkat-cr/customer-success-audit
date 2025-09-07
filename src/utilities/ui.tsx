import { app_version } from './utilities.tsx';

// Go to top of the page
export const goToTop = () => {
    window.scrollTo(0, 0);
};

export const getAppVersionRaw = () => {
    return app_version;
};

export const getAppVersion = () => {
    return <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full shadow">{app_version}</span>;
};
