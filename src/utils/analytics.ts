
// Google Analytics utility functions
declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}

// Initialize Google Analytics
export const initGA = (measurementId: string) => {
  // Add Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Add gtag configuration
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${measurementId}');
  `;
  document.head.appendChild(script2);
};

// Track page views
export const trackPageView = (path: string) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: path,
    });
  }
};

// Track custom events
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, parameters);
  }
};

// Specific tracking functions for the app
export const trackCreatorView = (creatorName: string, genre: string) => {
  trackEvent('creator_view', {
    creator_name: creatorName,
    genre: genre,
  });
};

export const trackCreatorContact = (creatorName: string, contactMethod: string) => {
  trackEvent('creator_contact', {
    creator_name: creatorName,
    contact_method: contactMethod,
  });
};

export const trackGenreFilter = (genre: string) => {
  trackEvent('genre_filter', {
    genre: genre,
  });
};

export const trackMediaView = (creatorName: string, mediaType: string) => {
  trackEvent('media_view', {
    creator_name: creatorName,
    media_type: mediaType,
  });
};
