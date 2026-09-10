import type {Meta, StoryObj} from '@storybook/react-vite';
import {useState} from 'react';

import {VirtualList} from './VirtualList';
import type {VirtualListProps} from './VirtualList';
import type {VirtualListMarkerProps} from './types';

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

type VirtualListStoryArgs = VirtualListProps & {
  useMarkerSpaceSize: boolean;
};

const StoryVirtualList = ({
  useMarkerSpaceSize,
  markerSpaceSize,
  ...props
}: VirtualListStoryArgs) => (
  <VirtualList
    {...props}
    markerSpaceSize={useMarkerSpaceSize ? markerSpaceSize : undefined}
  />
);

const meta = {
  title: 'Components/VirtualList',
  render: (args) => <StoryVirtualList {...args} />,

  args: {
    type: 'none',
    position: 'outside',
    startFrom: 1,
    markerSpaceSize: 40,
    estimatedItemHeight: 40,
    className: 'ltw:border ltw:border-dashed ltw:p-2 ltw:h-64',
    useMarkerSpaceSize: true,
  },

  parameters: {
    controls: {
      sort: 'none',
    },
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

    useMarkerSpaceSize: {
      control: 'boolean',
    },

    markerSpaceSize: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 4,
      },
      if: {
        arg: 'useMarkerSpaceSize',
        truthy: true,
      },
    },

    startFrom: {
      control: {
        type: 'range',
        min: -10,
        max: 10,
        step: 1,
      },
    },

    estimatedItemHeight: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 5,
      },
    },

    className: {
      control: 'text',
    },

    items: {
      control: false,
    },
  },
} satisfies Meta<VirtualListStoryArgs>;

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

      <StoryVirtualList {...args} />
    </div>
  ),
};

/**
 * Provides different initial height estimates for items in the demo.
 *
 * Every third item is expected to be taller than the others.
 */
const getEstimatedItemHeight = (index: number): number =>
  index % 3 === 0 ? 80 : 40;

export const PerItemEstimatedHeight: Story = {
  args: {
    type: '1',
    position: 'outside',
  },

  parameters: {
    controls: {
      exclude: ['estimatedItemHeight'],
    },
    docs: {
      description: {
        story:
          'Uses a function to provide different initial height estimates for individual items.',
      },
    },
  },

  render: (args) => (
    <div>
      <p className="ltw:mb-3">
        Click any of the first eight items to expand or collapse it. The last
        two items are long plain-text examples for comparing list marker
        positioning with block and inline content.
      </p>

      <StoryVirtualList
        {...args}
        items={items}
        estimatedItemHeight={getEstimatedItemHeight}
      />
    </div>
  ),
};

/**
 * Custom decorative marker used to demonstrate component-based list markers.
 */
const CustomMarker = ({index}: VirtualListMarkerProps) => (
  <span className="ltw:pr-2">#{index + 1}</span>
);

export const CustomMarkers: Story = {
  args: {
    position: 'outside',
    markerSpaceSize: 40,
    items,
  },

  argTypes: {
    type: {
      control: false,
      table: {
        disable: true,
      },
    },
  },

  parameters: {
    docs: {
      description: {
        story:
          'Uses a custom marker component instead of a built-in list marker type.',
      },
    },
  },

  render: (args) => (
    <div>
      <p className="ltw:mb-3">
        This example uses a custom marker component. Change the marker position
        and marker space size to inspect its layout.
      </p>

      <StoryVirtualList {...args} type={CustomMarker} />
    </div>
  ),
};
