import {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
  json,
} from "@remix-run/node";
import {
  Form,
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { getUser } from "~/session.server";

import rootStyleSheetUrl from "~/styles/root.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: rootStyleSheetUrl }];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  return json<LoaderData>({
    user: await getUser(request),
  });
};

export default function App() {
  const data = useLoaderData();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <NavItem to="/">Events</NavItem>
        {!data?.user && <NavItem to="/login">Login</NavItem>}
        {data?.user && (
          <>
            <NavItem to="/create-event">Create Event</NavItem>
            <Form method="post" action="/logout" className="logout-form">
              <button className="logout" type="submit">
                Logout
              </button>
            </Form>
          </>
        )}
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function NavItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      prefetch="intent"
      className={({ isActive }) => `navlink ${isActive ? "active" : ""}`}
    >
      {children}
    </NavLink>
  );
}
