import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { getUserId, requireUser } from "~/session.server";
import { getDateStr, validateSlug } from "~/utils";
import { createEvent } from "~/event.server";
import type { Event } from "~/types.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request);
  return json({});
};

enum Category {
  AI = "AI",
  MOBILE_DEVELOPMENT = "Mobile Development",
  WEB_DEVELOPMENT = "Web Development",
  DATA_SCIENCE = "Data Science",
}

type ActionData =
  | {
      title: null | string;
      slug: null | string;
      description: null | string;
      address: null | string;
      date: null | string;
      category: null | string;
    }
  | undefined;

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const slug = formData.get("slug");
  const description = formData.get("description");
  const date = formData.get("date");
  const category = formData.get("category");
  const isVirtual = formData.get("isVirtual") === "on" ? true : false;
  const address = formData.get("address");
  // const redirectTo = safeRedirect(formData.get("redirectTo"), "/create-event");
  const errors: ActionData = {
    title: title ? null : "Title is required",
    slug: validateSlug(slug) ? null : "Slug is invalid",
    description: description ? null : "Description is required",
    address: address ? null : "Address is required",
    date: date ? null : "Date is required",
    category: category ? null : "Category is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  invariant(typeof title === "string", "title must be a string");
  invariant(typeof slug === "string", "slug must be a string");
  invariant(typeof description === "string", "description must be a string");
  invariant(typeof address === "string", "address must be a string");
  invariant(typeof date === "string", "date must be a string");
  invariant(typeof category === "string", "category must be a string");

  const userId = await getUserId(request);
  invariant(userId, "only logged in users can create events");

  await createEvent({
    title,
    slug,
    description,
    date: new Date(date),
    category: Category[category as keyof typeof Category],
    isVirtual,
    address,
    organizer: userId,
  });

  return redirect("/");
};

export default function CreateEvent() {
  const slugRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);

  const actionData = useActionData() as ActionData;
  const minDate = getDateStr();
  useEffect(() => {
    if (actionData?.title) {
      titleRef.current?.focus();
    } else if (actionData?.slug) {
      slugRef.current?.focus();
    } else if (actionData?.description) {
      descriptionRef.current?.focus();
    } else if (actionData?.address) {
      addressRef.current?.focus();
    } else if (actionData?.date) {
      dateRef.current?.focus();
    } else if (actionData?.category) {
      categoryRef.current?.focus();
    }
  }, [actionData]);

  return (
    <>
      <h3>Create Event Form</h3>
      <Form method="post">
        <div>
          <label htmlFor="title">Title</label>
          <div>
            <input
              ref={titleRef}
              id="title"
              required
              autoFocus={true}
              name="title"
              type="text"
            />
            {actionData?.title && (
              <div className="error-text" id="title-error">
                {actionData.title}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="slug">Slug</label>
          <div>
            <input id="slug" ref={slugRef} name="slug" type="text" />
            {actionData?.slug && (
              <div className="error-text" id="slug-error">
                {actionData.slug}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <div>
            <textarea
              id="description"
              ref={descriptionRef}
              name="description"
            />
            {actionData?.description && (
              <div className="error-text" id="description-error">
                {actionData.description}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="address">Address</label>
          <div>
            <input id="address" ref={addressRef} name="address" type="text" />
            {actionData?.address && (
              <div className="error-text" id="address-error">
                {actionData.address}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="date">Date</label>
          <div>
            <input
              id="date"
              ref={dateRef}
              name="date"
              type="date"
              min={minDate}
            />
            {actionData?.date && (
              <div className="error-text" id="date-error">
                {actionData.date}
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <div>
            <select id="category" name="category">
              {Object.values(Category).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {actionData?.category && (
              <div className="error-text" id="category-error">
                {actionData.category}
              </div>
            )}
          </div>
        </div>

        <div>
          <input id="isVirtual" name="isVirtual" type="checkbox" />
          <label htmlFor="isVirtual">Virtual</label>
        </div>

        <button type="submit">Create Event</button>
      </Form>
    </>
  );
}
