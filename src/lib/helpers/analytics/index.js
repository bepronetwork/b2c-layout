import Analytics from 'analytics';
import googleAnalytics from '@analytics/google-analytics';
import { getApp } from "..";

let analytics;
let isAnalyticsActive = false;

if(typeof getApp().analytics != "undefined") {
    isAnalyticsActive = getApp().analytics.isActive;

    if(isAnalyticsActive === true) {
        const googleAnalyticsKey = isAnalyticsActive === true ? getApp().analytics.google_tracking_id : null;
        const appName = getApp().name;
        analytics = Analytics({
            app: appName,
            plugins: [
              googleAnalytics({
                trackingId: googleAnalyticsKey
              })
            ]
          });
    
        window.Analytics = analytics;
    }
}

function analyticsIdentify(user) {
    if(isAnalyticsActive === true) {
        analytics.identify(user.id, {
            name: user.username
        });
    }
}

function analyticsPage() {
    if(isAnalyticsActive === true) {
        analytics.page();
    }
}

export { 
    analyticsIdentify,
    analyticsPage
}