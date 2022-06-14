import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const lodaer: LoaderFunction = async () => {
  // const userId = await getUserId(request);
  // console.log(`mongoose`, mongoose);
  return json({});
};

export default function Index() {
  return (
    <div>
      <h1>ESA - News Feed!</h1>
      <div>
        <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
