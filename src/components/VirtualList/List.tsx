import type {FC, ReactNode, Ref, UIEvent} from 'react';

interface ListProps {
  children: ReactNode;
  className: string;
  listRef: Ref<HTMLUListElement | HTMLOListElement>;
  ordered: boolean;
  onScroll(event: UIEvent<HTMLUListElement | HTMLOListElement>): void;
}

const List: FC<ListProps> = ({
  children,
  className,
  listRef,
  ordered,
  onScroll,
}) =>
  ordered ? (
    <ol
      className={className}
      onScroll={onScroll}
      ref={listRef as Ref<HTMLOListElement>}
    >
      {children}
    </ol>
  ) : (
    <ul className={className} onScroll={onScroll} ref={listRef}>
      {children}
    </ul>
  );

export default List;
