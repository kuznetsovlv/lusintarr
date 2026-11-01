import type {FC, ReactNode, Ref, CSSProperties, HTMLAttributes} from 'react';

interface ListProps extends HTMLAttributes<
  HTMLUListElement | HTMLOListElement
> {
  /** List items currently rendered by VirtualList. */
  children: ReactNode;

  /** CSS classes applied to the underlying `ul` or `ol` element. */
  className: string;

  /** Ref to the underlying semantic list element. */
  listRef: Ref<HTMLUListElement | HTMLOListElement>;

  /** Whether the list should be rendered as an ordered `ol` list. */
  ordered: boolean;

  /**
   * Inline styles applied to the semantic `ul` or `ol` element.
   *
   * VirtualList currently uses this to override the space reserved for outside
   * list markers.
   */
  style?: CSSProperties;
}

/**
 * Renders the semantic list element used by VirtualList.
 *
 * Ordered lists are rendered as `ol` and receive the `start` attribute so
 * their numbering reflects the position of the first currently rendered
 * item. Unordered lists are rendered as `ul`.
 */
const List: FC<ListProps> = ({
  children,
  className,
  listRef,
  ordered,
  style,
  ...props
}) =>
  ordered ? (
    <ol
      {...props}
      className={className}
      style={style}
      ref={listRef as Ref<HTMLOListElement>}
    >
      {children}
    </ol>
  ) : (
    <ul {...props} className={className} style={style} ref={listRef}>
      {children}
    </ul>
  );

export default List;
