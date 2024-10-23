import { modals as fileModals } from './File';
import { modals as apiConfigurationModals } from './ApiConfiguration';
import { modals as contextDataModals } from './context-data-mapping';
import { modals as monitoringModals } from './monitoring';
import { modals as activityNewModals } from './activityNew';
import { modals as fileAttachmentsModals } from './file-attachment';
import { modals as contextDataTreeModals } from './ContextData';
import { modals as RolloutModals } from './rollout';

const modals = [...fileModals, ...apiConfigurationModals, ...contextDataModals, ...monitoringModals, ...activityNewModals, ...contextDataTreeModals, ...fileAttachmentsModals, ...RolloutModals];

export { modals };
