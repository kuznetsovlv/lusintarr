import {createPortal} from 'react-dom';
import {useId} from 'react';
import type {CSSProperties, FC, PropsWithChildren} from 'react';

/**
 * Props for the {@link OutBound} component.
 */
export interface OutBoundProps extends PropsWithChildren {
  /**
   * Controls the stacking order of the portal container.
   *
   * Accepts the same values as the CSS `z-index` property.
   */
  zIndex?: CSSProperties['zIndex'];
}

/**
 * Renders its children into `document.body` using a React portal.
 *
 * `OutBound` moves the rendered DOM outside of the component's parent DOM
 * hierarchy while preserving its position in the React component tree.
 * This makes it useful for UI elements such as overlays, popovers, tooltips,
 * menus, and other content that should not be constrained by ancestor layout
 * or overflow.
 *
 * @remarks
 * The portal container is positioned at the viewport origin and has no size.
 * Children are responsible for their own positioning and dimensions.
 *
 * This component requires a browser DOM and is not intended for server-side
 * rendering.
 *
 * @example
 * ```tsx
 * <OutBound zIndex={1000}>
 *   <div className="fixed top-4 right-4">
 *     Portal content
 *   </div>
 * </OutBound>
 * ```
 */
export const OutBound: FC<OutBoundProps> = ({children, zIndex}) =>
  createPortal(
    <div
      id={useId()}
      className="ltw:fixed ltw:w-0 ltw:h-0 ltw:top-0 ltw:left-0 ltw:overflow-visible"
      style={{
        zIndex,
      }}
    >
      {children}
    </div>,
    document.body,
  );
