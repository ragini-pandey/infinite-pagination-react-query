import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { fetchItems } from './api/items';

type ItemProps = {
  item: {
    id: number;
    name: string;
  };
};

type PageProps = {
  page: {
    currentPage: number;
    data: ItemProps['item'][];
  };
};

type ErrorProps = {
  message: string;
};

const Loading = () => <div>Loading...</div>;
const Error = ({ message }: ErrorProps) => <div>{message}</div>;

const Item = ({ item }: ItemProps) => (
  <div key={item.id} className="rounded-md bg-grayscale-700 p-4">
    {item.name}
  </div>
);

const Page = ({ page }: PageProps) => (
  <div key={page.currentPage} className="flex flex-col gap-2">
    {page.data.map((item) => (
      <Item key={item.id} item={item} />
    ))}
  </div>
);

export default function App() {
  const { data, error, status, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  if (status === 'pending') return <Loading />;
  if (status === 'error') return <Error message={(error as Error).message} />;

  return (
    <div className="flex flex-col gap-2">
      {data.pages.map((page) => (
        <Page key={page.currentPage} page={page} />
      ))}
      <div ref={ref}>{isFetchingNextPage && 'Loading...'}</div>
    </div>
  );
}
