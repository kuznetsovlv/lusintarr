import type {Meta, StoryObj} from '@storybook/react-vite';

import {VirtualList} from './VirtualList';

const items = [
  'Mercury',
  'Venus',
  'Earth',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
];

const meta = {
  title: 'Components/VirtualList',
  component: VirtualList,

  args: {
    type: 'none',
    estimatedItemHeight: 40,
    className: 'ltw:border ltw:border-dashed ltw:p-2',
  },

  argTypes: {
    type: {
      control: 'select',
      options: ['none', 'disc', 'circle', 'square', '1', 'A', 'a', 'I', 'i'],
    },

    estimatedItemHeight: {
      control: {
        type: 'range',
        min: 20,
        max: 100,
        step: 5,
      },
    },

    items: {
      control: false,
    },
  },
} satisfies Meta<typeof VirtualList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    items: [],
  },
};

export const WithItems: Story = {
  args: {
    items,
    estimatedItemHeight: 40,
  },
};
