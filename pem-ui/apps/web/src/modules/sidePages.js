import { sidePages as apiConfigurationSidePages } from './ApiConfiguration';
import { sidePages as MonitoringSidePages } from './monitoring/view-partners/partner-tasks';
import { sidePages as activityListSidePages } from './activityNew';


const sidePages = [...apiConfigurationSidePages, ...MonitoringSidePages, ...activityListSidePages];

export { sidePages };
