import type { ObjectId } from "mongoose";
import type { Event } from "~/types.server";
import { Category } from "~/types.server";
import { faker } from "@faker-js/faker";

export function createFakeEvents(
  organizer: ObjectId,
  nEvents: number
): Event[] {
  const events: Event[] = [];
  for (let i = 1; i <= nEvents; i++) {
    events.push({
      organizer,
      title: `Event ${i}`,
      slug: `event-${i}`,
      description: faker.lorem.paragraph(),
      date: faker.date.future(),
      isVirtual: faker.helpers.arrayElement([true, false]),
      address: faker.address.city(),
      category: faker.helpers.arrayElement([
        Category.AI,
        Category.MOBILE_DEVELOPMENT,
        Category.WEB_DEVELOPMENT,
        Category.DATA_SCIENCE,
      ]),
    });
  }
  return events;
}
