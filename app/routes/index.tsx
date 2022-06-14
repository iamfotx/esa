import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import type { Event } from "~/types.server";

import { useFetcher, useLoaderData } from "@remix-run/react";
import { getPage } from "~/utils.server";
import { getEventsPaginated, countEvents } from "~/event.server";
import { json } from "@remix-run/node";
import { useCallback, useEffect, useRef, useState } from "react";
import { useVirtual } from "react-virtual";

import indexStyleSheetUrl from "~/styles/index.css";

type LoaderData = {
  events: Event[];
  totalEvents: number;
};

const PAGE_LIMIT = 20;

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: indexStyleSheetUrl }];
};

export const loader: LoaderFunction = async ({ request }) => {
  const { page } = getPage(new URL(request.url).searchParams);
  const data: LoaderData = {
    events: await getEventsPaginated({ page, limit: PAGE_LIMIT }),
    totalEvents: await countEvents(),
  };
  return json(data, {
    headers: {
      "Cache-Control": "public, max-age=120",
    },
  });
};

export default function Index() {
  const data = useLoaderData<LoaderData>();
  const [events, setEvents] = useState(data.events);
  const fetcher = useFetcher();
  const page = useRef(0);
  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtual({
    size: data.totalEvents,
    parentRef,
    initialRect: { width: 0, height: 800 },
    estimateSize: useCallback(() => 300, []),
  });

  const canFetchMore = events.length < data.totalEvents;

  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.virtualItems].reverse();

    if (!lastItem) {
      return;
    }

    if (
      lastItem.index > events.length - 1 &&
      canFetchMore &&
      fetcher.state === "idle" &&
      page.current < events.length / PAGE_LIMIT
    ) {
      page.current += 1;
      fetcher.load(`/?index&page=${page.current}`);
    }
  }, [canFetchMore, fetcher, events.length, page, rowVirtualizer.virtualItems]);

  useEffect(() => {
    if (fetcher.data) {
      setEvents((prevEvents) => [...prevEvents, ...fetcher.data.events]);
    }
  }, [fetcher.data]);
  return (
    <main>
      <h1>Organized Events</h1>
      <div
        ref={parentRef}
        className="list"
        style={{
          height: `500px`,
          width: `100%`,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <div
          style={{
            height: `${rowVirtualizer.totalSize}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.virtualItems.map((virtualRow) => {
            const { index } = virtualRow;
            const isLoaderRow = index > events.length - 1;
            const event = events[index];

            return (
              <div
                key={virtualRow.key}
                className={
                  virtualRow.index % 2 ? "list-item-odd" : "list-item-even"
                }
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {isLoaderRow ? (
                  canFetchMore ? (
                    "Loading more..."
                  ) : (
                    "Nothing more to load"
                  )
                ) : (
                  <pre>{JSON.stringify(event, null, 2)}</pre>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
