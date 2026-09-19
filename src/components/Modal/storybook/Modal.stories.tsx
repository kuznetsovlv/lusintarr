import type {Meta, StoryObj} from '@storybook/react-vite';
import DemoModal from './DemoModal';
import type {DemoModalProps} from './DemoModal';
import {DEFAULT_BACKGROUND_COLOR} from '../constants';

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

    dragHolder: {
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

export const Modal: Story = {
  args: {
    title: 'Simple Modal',
    withDragger: false,
  },
};

export const Draggable: Story = {
  args: {
    title: 'Draggable Modal',
    withDragger: true,
  },
};
