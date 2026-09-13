import type {Meta, StoryObj} from '@storybook/react-vite';
import {OutBound} from '../OutBound';
import lusintarrImage from './lusintarr.png?url';

export default {
  title: 'components/OutBound',
  component: OutBound,
} satisfies Meta<typeof OutBound>;

type Story = StoryObj<typeof OutBound>;

export const Default: Story = {
  render: () => (
    <>
      <h1 className="ltw:mb-4 ltw:text-3xl ltw:font-semibold ltw:text-(--lus-demo-heading)">
        OutBound Component: two overlapping images
      </h1>
      <OutBound>
        <img
          src={lusintarrImage}
          alt="image"
          width={328}
          height={192}
          className="ltw:fixed ltw:top-1/2 ltw:left-1/2 ltw:-translate-x-1/2 ltw:-translate-y-1/2"
        />
      </OutBound>
      <OutBound>
        <img
          src={lusintarrImage}
          alt="image"
          width={328}
          height={192}
          className="ltw:fixed ltw:top-1/2 ltw:left-1/2"
        />
      </OutBound>
    </>
  ),
};
