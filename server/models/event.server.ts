import type { Document, Model } from "mongoose";
import type { Event } from "~/types.server";
import { Category } from "~/types.server";
import mongoose from "mongoose";

interface EventDocument extends Omit<Event, "id">, Document {}

const eventSchema = new mongoose.Schema<EventDocument, Model<EventDocument>>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: { unique: true },
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isVirtual: {
      type: Boolean,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: Category,
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// Duplicate the ID field.
eventSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
eventSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_, ret) {
    delete ret._id;
  },
});

export default mongoose.model<EventDocument, Model<EventDocument>>(
  "Event",
  eventSchema
);
