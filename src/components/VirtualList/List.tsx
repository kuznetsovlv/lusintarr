import type {FC, ReactNode, Ref} from 'react';

interface ListProps {
  children: ReactNode;
  className: string;
  listRef: Ref<HTMLUListElement | HTMLOListElement>;
  ordered: boolean;
}

const List: FC<ListProps> = ({children, className, listRef, ordered}) =>
  ordered ? (
    <ol className={className} ref={listRef as Ref<HTMLOListElement>}>
      {children}
    </ol>
  ) : (
    <ul className={className} ref={listRef}>
      {children}
    </ul>
  );

export default List;
