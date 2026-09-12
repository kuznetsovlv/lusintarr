import type {Meta, StoryObj} from '@storybook/react-vite';

import {VirtualList} from '../VirtualList';

import DemoPlanets, {CustomMarker} from './DemoPlanets';
import type {DemoPlanetsProps} from './DemoPlanets';
import planets from './planets.json';

const meta = {
  title: 'Components/VirtualList',
  render: (args) => <DemoPlanets {...args} />,

  args: {
    type: 'none',
    position: 'outside',
    startFrom: 1,
    markerSpaceSize: 40,
    estimatedItemHeight: 40,
    useMarkerSpaceSize: true,
    itemLayout: 'block',
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

    itemLayout: {
      control: 'select',
      options: ['inline', 'block'],
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

    items: {
      control: false,
    },

    title: {
      control: false,
    },
  },
} satisfies Meta<DemoPlanetsProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    items: [],
    title: 'Empty list',
  },
};

export const WithItems: Story = {
  args: {
    type: '1',
    items: planets,
    title: 'With items',
  },
};

/**
 * Provides different initial height estimates for items in the demo.
 *
 * Every third item is expected to be taller than the others.
 */
const getEstimatedItemHeight = (index: number): number =>
  Math.floor(80 * Math.sqrt(planets[index]?.radius ?? 0));

export const PerItemEstimatedHeight: Story = {
  args: {
    type: '1',
    items: planets,
    position: 'outside',
    title: 'With functional estimated height',
    estimatedItemHeight: getEstimatedItemHeight,
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
};

export const WithCustomMarker: Story = {
  args: {
    type: CustomMarker,
    items: planets,
    title: 'With custom marker',
  },

  parameters: {
    controls: {
      exclude: ['type'],
    },
    docs: {
      description: {
        story: 'Uses a custom marker for individual items.',
      },
    },
  },
};

const textItems = [
  'This is a deliberately long plain-text list item. It is not interactive and is intended to wrap across several lines so that the relationship between the list marker and inline text can be inspected, especially when switching between inside and outside marker positioning.',

  'Another long non-interactive text item used to compare marker positioning with ordinary inline content. The text should wrap onto multiple lines and make it easy to see how subsequent lines are aligned relative to the marker and the beginning of the list item.',
];

export const PlainTextItems: Story = {
  args: {
    type: '1',
    position: 'outside',
    items: [],
    title: 'Plain-text items',
  },
  parameters: {
    controls: {
      exclude: ['itemLayout'],
    },
  },

  render: (args) => {
    const {
      useMarkerSpaceSize,
      markerSpaceSize: currentMarkerSpaceSize,
      title,
      ...props
    } = args;

    const markerSpaceSize = useMarkerSpaceSize
      ? currentMarkerSpaceSize
      : undefined;

    return (
      <>
        <h1 className="ltw:mb-4 ltw:text-3xl ltw:font-semibold ltw:text-(--lus-demo-heading)">
          {title}
        </h1>

        <VirtualList
          {...props}
          items={textItems}
          markerSpaceSize={markerSpaceSize}
          className="ltw:h-80 ltw:w-xl ltw:rounded-lg ltw:border ltw:border-(--lus-demo-border) ltw:bg-(--lus-demo-background) ltw:p-3 ltw:text-(--lus-demo-text)"
        />
      </>
    );
  },
};
