import Designer from './components/designer';
import FormPreview from './components/preview-mode';
import { Row } from './elements';
import { formValidation } from './utils/helpers';
import TabCanvas from './components/canvas/tab-canvas';

const PageDesigner = {
  Designer,
  formValidation,
  FormPreview,
  Row,
  TabCanvas
};

export default PageDesigner;
