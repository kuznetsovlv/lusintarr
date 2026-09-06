import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';

import {VirtualList} from './VirtualList';

interface DemoItemProps {
  name: string;
  height: number;
}

const DemoItem = ({name, height}: DemoItemProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      type="button"
      aria-expanded={expanded}
      className={[
        'ltw:w-full',
        'ltw:border',
        'ltw:border-solid',
        'ltw:rounded-sm',
        'ltw:px-2',
        'ltw:py-1',
        'ltw:text-left',
        'ltw:bg-transparent',
        'ltw:cursor-pointer',
      ].join(' ')}
      style={{
        minHeight: expanded ? height * 2 : height,
      }}
      onClick={() => setExpanded((value) => !value)}
    >
      {name}

      {expanded && (
        <span className="ltw:block ltw:mt-2">
          Expanded content. Click again to collapse.
        </span>
      )}
    </button>
  );
};

const items = [
  <DemoItem key="mercury" name="Mercury" height={24} />,
  <DemoItem key="venus" name="Venus" height={48} />,
  <DemoItem key="earth" name="Earth" height={32} />,
  <DemoItem key="mars" name="Mars" height={72} />,
  <DemoItem key="jupiter" name="Jupiter" height={40} />,
  <DemoItem key="saturn" name="Saturn" height={56} />,
  <DemoItem key="uranus" name="Uranus" height={28} />,
  <DemoItem key="neptune" name="Neptune" height={64} />,

  'This is a deliberately long plain-text list item. It is not interactive and is intended to wrap across several lines so that the relationship between the list marker and inline text can be inspected, especially when switching between inside and outside marker positioning.',

  'Another long non-interactive text item used to compare marker positioning with ordinary inline content. The text should wrap onto multiple lines and make it easy to see how subsequent lines are aligned relative to the marker and the beginning of the list item.',
];

const meta = {
  title: 'Components/VirtualList',
  component: VirtualList,

  args: {
    type: 'none',
    position: 'outside',
    estimatedItemHeight: 40,
    className: 'ltw:border ltw:border-dashed ltw:p-2 ltw:h-64',
  },

  argTypes: {
    type: {
      control: 'select',
      options: ['none', 'disc', 'circle', 'square', '1', 'A', 'a', 'I', 'i'],
    },

    position: {
      control: 'select',
      options: ['inside', 'outside'],
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
    type: '1',
    items,
  },

  render: (args) => (
    <div>
      <p className="ltw:mb-3">
        Click any of the first eight items to expand or collapse it. The last
        two items are long plain-text examples for comparing list marker
        positioning with block and inline content.
      </p>

      <VirtualList {...args} />
    </div>
  ),
};
