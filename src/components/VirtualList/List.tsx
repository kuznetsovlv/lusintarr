import type {FC, ReactNode, Ref} from 'react';

interface ListProps {
  children: ReactNode;
  className: string;
  listRef: Ref<HTMLUListElement | HTMLOListElement>;
  ordered: boolean;
  start: number;
}

const List: FC<ListProps> = ({children, className, listRef, ordered, start}) =>
  ordered ? (
    <ol
      className={className}
      start={start}
      ref={listRef as Ref<HTMLOListElement>}
    >
      {children}
    </ol>
  ) : (
    <ul className={className} ref={listRef}>
      {children}
    </ul>
  );

export default List;
