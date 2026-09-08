import type {FC, ReactNode, Ref, CSSProperties} from 'react';

interface ListProps {
  /** List items currently rendered by VirtualList. */
  children: ReactNode;

  /** CSS classes applied to the underlying `ul` or `ol` element. */
  className: string;

  /** Ref to the underlying semantic list element. */
  listRef: Ref<HTMLUListElement | HTMLOListElement>;

  /** Whether the list should be rendered as an ordered `ol` list. */
  ordered: boolean;

  /**
   * Ordinal value of the first rendered item.
   *
   * Applied only to ordered lists. This preserves correct marker numbering
   * when virtualization omits preceding items from the DOM.
   */
  start: number;

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
  start,
  style,
}) =>
  ordered ? (
    <ol
      className={className}
      start={start}
      style={style}
      ref={listRef as Ref<HTMLOListElement>}
    >
      {children}
    </ol>
  ) : (
    <ul className={className} style={style} ref={listRef}>
      {children}
    </ul>
  );

export default List;
