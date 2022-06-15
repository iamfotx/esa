import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import type { Event } from "~/types.server";

import { useFetcher, useLoaderData } from "@remix-run/react";
import { getPage } from "~/utils.server";
import { getEventsPaginated, countEvents } from "~/event.server";
import { json } from "@remix-run/node";
import { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "~/context";

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
  const socket = useSocket();
  const data = useLoaderData<LoaderData>();
  const [events, setEvents] = useState(data.events);
  const fetcher = useFetcher();
  const page = useRef(0);
  const canFetchMore = events.length < data.totalEvents;

  // useEffect(() => {
  //   if (
  //     canFetchMore &&
  //     fetcher.state === "idle" &&
  //     page.current < events.length / PAGE_LIMIT
  //   ) {
  //     page.current += 1;
  //     fetcher.load(`/?index&page=${page.current}`);
  //   }
  // }, [canFetchMore, fetcher, events.length, page]);

  const fetchMore = useCallback(() => {
    if (
      canFetchMore &&
      fetcher.state === "idle" &&
      page.current < events.length / PAGE_LIMIT
    ) {
      page.current += 1;
      fetcher.load(`/?index&page=${page.current}`);
    }
  }, [canFetchMore, fetcher, events.length, page]);

  useEffect(() => {
    if (fetcher.data) {
      setEvents((prevEvents) => [...prevEvents, ...fetcher.data.events]);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (!socket) return;

    socket.on("EVENT_CREATED", (data) => {
      setEvents((prevEvents) => [data, ...prevEvents]);
      window.scrollTo(0, 0);
      // TODO: hack
      data.totalEvents = data.totalEvents + 1;
    });
  }, [socket]);

  return (
    <main>
      <h1>Organized Events</h1>
      {events.map((event, index) => {
        const isLoaderRow = index === events.length - 1;
        return isLoaderRow ? (
          <div key={"loader-row"}>
            {canFetchMore ? (
              fetcher.state == "loading" ? (
                "loading more..."
              ) : (
                <button onClick={fetchMore}>load more</button>
              )
            ) : (
              "Nothing to load..."
            )}
          </div>
        ) : (
          <div
            key={`${event.slug}-${index}`}
            className={index % 2 ? "list-item-odd" : "list-item-even"}
          >
            <pre>{JSON.stringify(event, null, 4)}</pre>
          </div>
        );
      })}
    </main>
  );
}
