import type {Meta, StoryObj} from '@storybook/react-vite';
import DemoModal from './DemoModal';
import type {DemoModalProps} from './DemoModal';
import {DEFAULT_BACKGROUND_COLOR} from '../constants';

/**
 * Storybook metadata and controls shared by the Modal stories.
 */
const meta = {
  title: 'Components/Modal',
  render: (args) => <DemoModal {...args} />,

  args: {
    blocking: true,
    background: DEFAULT_BACKGROUND_COLOR,
    autoclose: 'none',
  },

  parameters: {
    controls: {
      sort: 'none',
    },
  },

  argTypes: {
    blocking: {
      control: 'boolean',
    },

    background: {
      control: 'color',
      if: {
        arg: 'blocking',
        truthy: true,
      },
    },

    autoclose: {
      control: 'select',
      options: ['none', 'last', 'all'],
    },

    title: {
      control: false,
    },

    dragHandle: {
      control: false,
    },

    className: {
      control: false,
    },
    withDragger: {
      control: false,
    },
  },
} satisfies Meta<DemoModalProps>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Demonstrates basic modal positioning, blocking mode, nested modals, and
 * outside-interaction policies without drag controls.
 */
export const Modal: Story = {
  args: {
    title: 'Simple Modal',
    withDragger: false,
  },
};

/**
 * Demonstrates the same modal behavior with a pointer-driven drag handle.
 */
export const Draggable: Story = {
  args: {
    title: 'Draggable Modal',
    withDragger: true,
  },
};
