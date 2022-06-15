import type { Event } from "./types.server";
import EventModel from "~/models/event.model.server";

export async function getEventsPaginated({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): Promise<Event[]> {
  return EventModel.find()
    .sort({ createdAt: -1 })
    .skip(page * limit)
    .limit(limit)
    .exec();
}

export async function countEvents(): Promise<number> {
  return EventModel.countDocuments({});
}

export async function createEvent(event: Event): Promise<void> {
  const newEvent = new EventModel(event);
  await newEvent.save();
}
