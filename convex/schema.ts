import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  waitlist: defineTable({
    email: v.string(),
    referralCode: v.string(),
    referredBy: v.optional(v.string()),
    referralCount: v.number(),
    source: v.string(),
  })
    .index("by_email", ["email"])
    .index("by_referralCode", ["referralCode"]),
});
