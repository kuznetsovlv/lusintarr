<p align="center">
  <picture>
    <source
      srcset="https://raw.githubusercontent.com/kuznetsovlv/lusintarr/main/logo/logo.png"
    />
    <img
      src="https://raw.githubusercontent.com/kuznetsovlv/lusintarr/main/logo/logo.png"
      alt="Lusintarr"
      width="760"
    />
  </picture>
</p>

<p align="center">
  React components for data-heavy and content-oriented applications.
</p>

<p align="center">
  <picture>
    <source
      srcset="https://raw.githubusercontent.com/kuznetsovlv/lusintarr/main/logo/moon.png"
    />
    <img
      src="https://raw.githubusercontent.com/kuznetsovlv/lusintarr/main/logo/moon.png"
      alt="Lusintarr moon"
      width="320"
    />
  </picture>
</p>

<p align="center">
  <a href="https://kuznetsovlv.github.io/lusintarr/">Storybook</a>
  ·
  <a href="https://kuznetsovlv.github.io/lusintarr/coverage/">Coverage</a>
</p>

## About

Lusintarr is a React component library focused on frontend primitives for
data-heavy and content-oriented applications.

The project is intentionally not a generic UI kit. Its focus is on components
where behavior, performance, accessibility, and reusable frontend engineering
matter more than providing a predefined visual design.

Current areas of development include:

- virtualization;
- data-heavy UI;
- content-oriented components;
- accessibility;
- performance.

## Installation

```bash
pnpm add lusintarr
```

Or with another package manager:

```bash
npm install lusintarr
```

Lusintarr requires React 18 or React 19.

Import the library styles once in your application:

```ts
import 'lusintarr/style.css';
```

Lusintarr uses Tailwind CSS internally, but applications consuming the library
do not need Tailwind or a Tailwind configuration.

## VirtualList

`VirtualList` renders a vertical list while keeping only the currently visible
items mounted in the DOM.

It is intended for lists where rendering the complete item set would create
unnecessary React and DOM work.

Unlike fixed-size virtual lists, `VirtualList` does not require the exact item
height to be known in advance. It starts with either a shared height estimate
or a per-item estimate and replaces those estimates with actual measurements
as items are rendered.

### Basic usage

```tsx
import {VirtualList} from 'lusintarr';
import 'lusintarr/style.css';

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

export function Example() {
  return (
    <VirtualList
      className="planet-list"
      items={items}
      estimatedItemHeight={40}
    />
  );
}
```

The scrollable viewport needs a constrained height for vertical scrolling to
occur:

```css
.planet-list {
  height: 20rem;
}
```

`className` is applied to the scrollable viewport, so applications remain in
control of its size and surrounding layout.

### Variable-height items

Items may have different heights:

```tsx
const items = [
  <div>Short item</div>,
  <div>
    A larger item whose content may occupy considerably more vertical space.
  </div>,
  <ArticlePreview article={article} />,
];

<VirtualList className="content-list" items={items} estimatedItemHeight={64} />;
```

`estimatedItemHeight` is only the initial estimate. Once an item is rendered,
Lusintarr measures its actual height and uses that value for subsequent layout
calculations.

Rendered items are also observed for size changes, so an item may change its
height after mounting.

Examples include:

- expandable content;
- asynchronously loaded content;
- text wrapping after a width change;
- images or other content changing the size of an existing item.

### Per-item height estimates

If different items are expected to have significantly different heights,
`estimatedItemHeight` can also be a function:

```tsx
const getEstimatedItemHeight = (index: number) => (index % 3 === 0 ? 80 : 40);

<VirtualList
  className="content-list"
  items={items}
  estimatedItemHeight={getEstimatedItemHeight}
/>;
```

The function receives the zero-based index of the item in the source array and
returns its estimated height in CSS pixels.

The estimate is used only while the actual item height is unknown. Once an
item is rendered and measured, its measured height takes precedence.

This is useful when the application already knows that some kinds of items are
typically taller or shorter than others.

Negative estimates, whether supplied directly or returned by the function, are
normalized to `0`.

### Native scrolling

`VirtualList` uses the browser's native scrolling rather than implementing a
custom scrollbar.

The semantic list element represents the estimated height of the complete
source list, while only the currently visible items are mounted.

As measurements become available, the estimated layout is refined.

### List markers

`VirtualList` can render both unordered and ordered lists.

Unordered marker types:

```tsx
<VirtualList type="none" items={items} />
<VirtualList type="disc" items={items} />
<VirtualList type="circle" items={items} />
<VirtualList type="square" items={items} />
```

Ordered marker types:

```tsx
<VirtualList type="1" items={items} />
<VirtualList type="A" items={items} />
<VirtualList type="a" items={items} />
<VirtualList type="I" items={items} />
<VirtualList type="i" items={items} />
```

Ordered types render a semantic `<ol>`. Unordered types render a semantic
`<ul>`.

### Custom markers

A React component can be used instead of a built-in marker type:

```tsx
import type {VirtualListMarkerProps} from 'lusintarr';

const Marker = ({index}: VirtualListMarkerProps) => <span>#{index + 1}</span>;

<VirtualList type={Marker} items={items} />;
```

The marker component receives the zero-based index of the corresponding item
in the source array.

Custom markers are decorative and are hidden from assistive technologies.
They should not contain interactive controls or other semantically meaningful
content.

Custom markers support the same `position` option as built-in markers:

```tsx
<VirtualList type={Marker} position="outside" items={items} />
```

### Marker position

With `position="outside"`, the custom marker is positioned immediately before
the item's inline-start edge. With `position="inside"`, it remains in the
normal item content flow.

Marker position can also be controlled:

```tsx
<VirtualList type="1" position="inside" items={items} />
```

Supported values are:

```ts
'inside' | 'outside';
```

When `position` is omitted, the browser's default list marker position is
preserved.

### Marker space

Browsers normally reserve inline space for outside list markers. This space can
be overridden with `markerSpaceSize`:

```tsx
<VirtualList
  type={Marker}
  position="outside"
  markerSpaceSize={48}
  items={items}
/>
```

`markerSpaceSize` is expressed in CSS pixels and controls the list's
inline-start padding while markers are positioned outside.

This is especially useful for custom markers that need more or less space than
the browser reserves by default.

When `markerSpaceSize` is omitted, the browser's default list padding is
preserved.

The option has no effect when `type="none"` or when markers are positioned
inside.

### Ordered-list numbering

Use `startFrom` to change the ordinal of the first source item:

```tsx
<VirtualList type="1" startFrom={100} items={items} />
```

Virtualization preserves numbering even when earlier list items are currently
not mounted.

For example, if the fifth source item is the first item currently rendered,
the corresponding ordered list begins at `104`.

### Props

| Prop                  | Type                                                                                                        | Default         | Description                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------- |
| `items`               | `ReactNode[]`                                                                                               | `[]`            | Items contained in the virtual list.                                                                          |
| `estimatedItemHeight` | `number \| ((index: number) => number)`                                                                     | `40`            | Initial height estimate for unmeasured items. A getter can provide a different estimate for each source item. |
| `type`                | `'none' \| 'disc' \| 'circle' \| 'square' \| '1' \| 'A' \| 'a' \| 'I' \| 'i' \| FC<VirtualListMarkerProps>` | `'none'`        | Selects a built-in marker style or a custom decorative marker component.                                      |
| `position`            | `'inside' \| 'outside'`                                                                                     | browser default | Controls built-in and custom marker positioning.                                                              |
| `markerSpaceSize`     | `number`                                                                                                    | browser default | Overrides the inline space reserved for outside markers, in CSS pixels.                                       |
| `startFrom`           | `number`                                                                                                    | `1`             | Ordinal assigned to the first source item of an ordered list.                                                 |
| `className`           | `string`                                                                                                    | —               | CSS class applied to the scrollable viewport.                                                                 |

### Notes

`VirtualList` treats a new `items` array as a new list layout and resets
previous item measurements. Prefer immutable React data patterns rather than
mutating the same array instance in place.

The component currently virtualizes the vertical axis. Horizontal overflow,
when present, uses the browser's native horizontal scrolling.

`estimatedItemHeight` does not need to be exact. An estimate reasonably close
to the expected item heights gives the list a more accurate initial scroll
range before measurements become available.

When a function is used, its identity is part of the height-map calculation.
For frequently re-rendering parents, prefer passing a stable function when
practical. Measured item heights are preserved when the estimate changes;
only unmeasured items use the new estimate.

When `position` is omitted, built-in markers preserve the browser's default
marker positioning. Custom markers use outside positioning by default.

Outside custom markers are positioned independently of the list item's
measured size. A custom marker that is significantly taller than its item may
therefore overlap adjacent items. Applications using unusually large markers
should account for this in their item layout.

## Styling

Lusintarr is intentionally minimally opinionated about visual appearance.

The package ships compiled CSS:

```ts
import 'lusintarr/style.css';
```

Consumers do not need Tailwind CSS.

Application-specific layout and appearance can be applied through the public
component API, such as `className`, without depending on Lusintarr's internal
Tailwind setup.

## Storybook

Interactive examples and controls are available in the
[Live Storybook](https://kuznetsovlv.github.io/lusintarr/).

The `VirtualList` stories include examples with:

- built-in ordered and unordered marker types;
- custom marker components;
- configurable marker spacing;
- inside and outside marker positioning;
- fixed and per-item height estimates;
- variable-height items and runtime size changes;
- configurable ordered-list numbering.

## Development

Lusintarr uses:

- React;
- TypeScript;
- Vite;
- Vitest;
- React Testing Library;
- Storybook;
- Tailwind CSS;
- Changesets.

Test coverage is published at:

[Test coverage](https://kuznetsovlv.github.io/lusintarr/coverage/)

## License

[MIT](./LICENSE)

<p align="center">
  <picture>
    <source
      srcset="https://raw.githubusercontent.com/kuznetsovlv/lusintarr/main/logo/moon.png"
    />
    <img
      src="https://raw.githubusercontent.com/kuznetsovlv/lusintarr/main/logo/moon.png"
      alt="Lusintarr moon"
      width="320"
    />
  </picture>
</p>
