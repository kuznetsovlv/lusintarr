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

## Components

### VirtualList

`VirtualList` renders a vertical list while keeping only the currently visible
items mounted in the DOM.

It is intended for lists where rendering the complete item set would create
unnecessary React and DOM work.

Unlike fixed-size virtual lists, `VirtualList` does not require the exact item
height to be known in advance. It starts with either a shared height estimate
or a per-item estimate and replaces those estimates with actual measurements
as items are rendered.

#### Basic usage

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

#### Variable-height items

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

#### Per-item height estimates

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

#### Automatic estimate refinement

When `estimatedItemHeight` is omitted, `VirtualList` starts with a default
estimate of `40px`.

As item heights are measured, estimates for items that have not yet been
rendered are gradually adjusted toward the average measured height. The
measured average gains more influence as a larger portion of the list becomes
known.

Measured heights always take precedence over estimates.

If `estimatedItemHeight` is provided explicitly — either as a number or as a
per-item getter — automatic refinement is disabled and the supplied estimates
are preserved until actual measurements become available.

#### Native scrolling

`VirtualList` uses the browser's native scrolling rather than implementing a
custom scrollbar.

The semantic list element represents the estimated height of the complete
source list, while only the currently visible items are mounted.

As measurements become available, the estimated layout is refined.

#### List markers

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

#### Custom markers

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

#### Marker position

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

#### Marker space

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

#### Ordered-list numbering

Use `startFrom` to change the ordinal of the first source item:

```tsx
<VirtualList type="1" startFrom={100} items={items} />
```

Virtualization preserves numbering even when earlier list items are currently
not mounted.

For example, if the fifth source item is the first item currently rendered,
the corresponding ordered list begins at `104`.

#### Props

| Prop                  | Type                                                                                                        | Default         | Description                                                                                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `items`               | `ReactNode[]`                                                                                               | `[]`            | Items contained in the virtual list.                                                                                        |
| `estimatedItemHeight` | `number \| ((index: number) => number)`                                                                     | `40`            | Initial estimate for unmeasured items. When omitted, the default estimate is gradually refined using measured item heights. |
| `type`                | `'none' \| 'disc' \| 'circle' \| 'square' \| '1' \| 'A' \| 'a' \| 'I' \| 'i' \| FC<VirtualListMarkerProps>` | `'none'`        | Selects a built-in marker style or a custom decorative marker component.                                                    |
| `position`            | `'inside' \| 'outside'`                                                                                     | browser default | Controls built-in and custom marker positioning.                                                                            |
| `markerSpaceSize`     | `number`                                                                                                    | browser default | Overrides the inline space reserved for outside markers, in CSS pixels.                                                     |
| `startFrom`           | `number`                                                                                                    | `1`             | Ordinal assigned to the first source item of an ordered list.                                                               |
| `className`           | `string`                                                                                                    | —               | CSS class applied to the scrollable viewport.                                                                               |

#### Notes

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

### Modal

`Modal` renders viewport-positioned content through a React portal.

It is intentionally controlled and behavior-oriented rather than being a
pre-styled, fully managed dialog component. Applications remain responsible for the modal
content, visual appearance, close policy, and drag positioning.

`Modal` supports:

- optional full-screen blocking backdrop;
- viewport-relative positioning in pixels or percentages;
- pointer interaction detection outside the logical React subtree;
- optional pointer-driven drag lifecycle events;
- nested modals and React portal descendants.

#### Basic usage

```tsx
import {useState} from 'react';
import {Modal} from 'lusintarr';
import 'lusintarr/style.css';

export function Example() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open modal
      </button>

      <Modal open={open} blocking onInteractOutside={() => setOpen(false)}>
        <div className="modal-content">
          Modal content
          <button type="button" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      </Modal>
    </>
  );
}
```

`Modal` does not change `open` itself. An outside interaction only invokes
`onInteractOutside`; the application decides whether that interaction should
close the modal or trigger another action.

The component also does not provide an implicit Escape-key close policy.
Keyboard behavior can be implemented by the consuming application according to
its own interaction requirements.

#### Blocking mode

With `blocking={true}`, the modal window is rendered inside a fixed backdrop
covering the viewport:

```tsx
<Modal open blocking>
  <div>Blocking modal</div>
</Modal>
```

The default backdrop background is:

```css
#0007
```

It can be overridden with `background`:

```tsx
<Modal open blocking background="rgba(20, 30, 50, 0.65)">
  <div>Modal content</div>
</Modal>
```

When `blocking` is disabled, no backdrop is rendered.

#### Positioning

`position` controls the modal window position relative to the viewport.

A position may contain either one value:

```tsx
<Modal open position="50%">
  ...
</Modal>
```

or separate horizontal and vertical values in `x:y` format:

```tsx
<Modal open position="20:75%">
  ...
</Modal>
```

Unitless values are interpreted as CSS pixels:

```tsx
<Modal open position="20:40">
  ...
</Modal>
```

This places the modal at `20px` from the left and `40px` from the top.

Percentage values have anchor semantics. The same relative point of the modal
is aligned with the corresponding relative point of the viewport.

For example:

```tsx
<Modal open position="0%">
  ...
</Modal>

<Modal open position="50%">
  ...
</Modal>

<Modal open position="100%">
  ...
</Modal>
```

represent top-left alignment, centering, and bottom-right alignment
respectively.

A single value is applied to both axes, so:

```ts
'50%';
```

is equivalent to:

```ts
'50%:50%';
```

Pixel and percentage coordinates may be mixed:

```tsx
<Modal open position="32:50%">
  ...
</Modal>
```

When `position` is omitted, the modal is centered using `50%`.

#### Outside interaction

`onInteractOutside` is called when a pointer interaction starts outside the
modal's logical React subtree:

```tsx
<Modal
  open={open}
  onInteractOutside={(event) => {
    console.log(event);
    setOpen(false);
  }}
>
  ...
</Modal>
```

Outside detection follows the React tree rather than relying only on physical
DOM ancestry.

This means that content belonging to the modal but rendered elsewhere through
a React portal is still considered inside the modal:

```tsx
<Modal open onInteractOutside={handleOutside}>
  <ContentWithPortal />
</Modal>
```

Pointer interaction with a portal rendered by `ContentWithPortal` does not
trigger `handleOutside`.

This also allows nested modals to behave independently. An interaction inside a
nested modal is inside both modal React subtrees, while an interaction in the
parent modal but outside the nested modal is outside only the nested modal.

`Modal` does not impose an automatic close or stack policy. Applications can
decide whether an outside interaction should close the current modal, several
modals, or none of them.

Content rendered through a completely independent React root does not share
the modal's React event ancestry and therefore cannot automatically be
classified as part of the modal.

#### Dragging

A React node can be supplied as `dragHandle`:

```tsx
<Modal open dragHandle={<header>Drag me</header>}>
  <div>Modal content</div>
</Modal>
```

Providing a drag handle does not make the modal move automatically.

Instead, `Modal` emits pointer-driven drag lifecycle callbacks and leaves the
position controlled by the application:

```tsx
import {useRef, useState} from 'react';
import type {Coords, PointerDragEvent, Position} from 'lusintarr';
import {Modal} from 'lusintarr';

export function DraggableModal() {
  const [position, setPosition] = useState<Position>('50%');
  const previousCursor = useRef<Coords | null>(null);

  const handleDragStart = ({cursor, container}: PointerDragEvent) => {
    previousCursor.current = cursor;

    // Convert the currently rendered position to pixels before movement.
    setPosition(`${container.x}:${container.y}`);
  };

  const handleDrag = ({cursor, container}: PointerDragEvent) => {
    if (previousCursor.current) {
      const dx = cursor.x - previousCursor.current.x;
      const dy = cursor.y - previousCursor.current.y;

      setPosition(`${container.x + dx}:${container.y + dy}`);
    }

    previousCursor.current = cursor;
  };

  const handleDragStop = () => {
    previousCursor.current = null;
  };

  return (
    <Modal
      open
      position={position}
      dragHandle={<header>Drag me</header>}
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragStop={handleDragStop}
    >
      <div>Modal content</div>
    </Modal>
  );
}
```

Dragging uses Pointer Events and pointer capture, so an active drag continues
to receive movement and termination events after the pointer leaves the
physical bounds of the drag handle.

Only the primary pointer using the primary button starts a drag.

`onDragStop` is also invoked when an active pointer interaction is cancelled.

#### Drag event

Drag callbacks receive a `PointerDragEvent`:

```ts
interface PointerDragEvent {
  type: 'start' | 'drag' | 'end';
  dragHandle: ElementBox;
  container: ElementBox;
  cursor: Coords;
  view: BoxSize;
}
```

`cursor` contains the current pointer coordinates relative to the viewport.

`container` contains the current viewport-relative bounds of the complete modal
window.

`dragHandle` contains the current bounds of the drag handle.

`view` contains the current viewport width and height.

Element measurements are snapshots taken when each drag callback is created.

#### Props

| Prop                | Type                                | Default   | Description                                                               |
| ------------------- | ----------------------------------- | --------- | ------------------------------------------------------------------------- |
| `children`          | `ReactNode`                         | —         | Content rendered inside the modal window.                                 |
| `open`              | `boolean`                           | `false`   | Controls whether the modal is rendered.                                   |
| `blocking`          | `boolean`                           | `false`   | Renders a full-screen backdrop behind the modal.                          |
| `background`        | `CSSProperties['background']`       | `'#0007'` | Background used by the blocking backdrop.                                 |
| `position`          | `Position`                          | `'50%'`   | Controls the viewport-relative modal position.                            |
| `className`         | `string`                            | —         | CSS class applied to the modal window container.                          |
| `zIndex`            | `CSSProperties['zIndex']`           | —         | Sets the `z-index` of the portal container.                               |
| `dragHandle`        | `ReactNode`                         | —         | Content used as the pointer drag handle.                                  |
| `onDragStart`       | `(event: PointerDragEvent) => void` | —         | Called when a primary pointer starts dragging the handle.                 |
| `onDrag`            | `(event: PointerDragEvent) => void` | —         | Called when the active pointer moves during a drag.                       |
| `onDragStop`        | `(event: PointerDragEvent) => void` | —         | Called when an active drag finishes or is cancelled.                      |
| `onInteractOutside` | `(event: PointerEvent) => void`     | —         | Called when pointer interaction starts outside the logical modal subtree. |

#### Notes

`Modal` is rendered through `OutBound`, so it requires a browser DOM and is
ultimately mounted under `document.body`.

The modal remains part of its original React component tree even though its DOM
is rendered through a portal. React context and React event propagation
therefore continue to work normally.

`Modal` exposes dialog semantics through `role="dialog"`.

Applications remain responsible for higher-level accessibility behavior such as
focus management, focus restoration, accessible labelling, and any
application-specific keyboard interaction such as Escape-key handling.

### OutBound

Renders its children into `document.body` using a React portal.

`OutBound` is useful for UI elements that need to escape the DOM hierarchy of their parent, such as overlays, popovers, tooltips, menus, and floating controls.

The portal container is fixed at the top-left corner of the viewport and has no size of its own. Children are responsible for their own positioning and dimensions.

```tsx
import {OutBound} from 'lusintarr';

function Example() {
  return (
    <OutBound zIndex={1000}>
      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
        }}
      >
        Portal content
      </div>
    </OutBound>
  );
}
```

Although the rendered DOM is moved to `document.body`, the children remain in the same React component tree, so React context and event propagation continue to work as expected.

#### Props

| Prop       | Type                      | Default | Description                                 |
| ---------- | ------------------------- | ------- | ------------------------------------------- |
| `children` | `ReactNode`               | —       | Content rendered into the portal.           |
| `zIndex`   | `CSSProperties['zIndex']` | —       | Sets the `z-index` of the portal container. |

> `OutBound` requires a browser DOM because it renders directly into `document.body`.

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

The `Modal` stories demonstrate:

- blocking and non-blocking rendering;
- configurable backdrop appearance;
- viewport-relative positioning;
- nested modals;
- configurable outside-interaction policies;
- controlled pointer-based dragging.

The `OutBound` story demonstrates multiple independent portal containers
rendering overlapping content into `document.body`.

The example highlights that each `OutBound` keeps its children in the original
React tree while allowing the rendered DOM to escape the component's physical
DOM hierarchy.

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
