import type {Meta, StoryObj} from '@storybook/react-vite';

import {VirtualList} from './VirtualList';

const meta = {
  title: 'Components/VirtualList',
  component: VirtualList,
} satisfies Meta<typeof VirtualList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
