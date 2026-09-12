import type {Preview} from '@storybook/react-vite';

import '../src/styles.css';
import './preview.css';

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
    },
  },
};

export default preview;
