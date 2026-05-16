import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Generate a unique referral code: AX-XXXXX
function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "AX-";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ── Public: get count (with 100 FOMO base + remaining spots) ──
export const getCount = query({
  args: {},
  handler: async (ctx) => {
    const realTotal = await ctx.db.query("waitlist").count();
    const displayTotal = realTotal + 100;
    const remaining = Math.max(0, 200 - displayTotal);
    return { total: displayTotal, remaining };
  },
});

// ── Public: join the waitlist ──
export const join = mutation({
  args: {
    email: v.string(),
    ref: v.optional(v.string()),
  },
  handler: async (ctx, { email, ref }) => {
    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      return { success: false, error: "Please provide a valid email address" };
    }

    // Check duplicate
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", cleanEmail))
      .first();

    if (existing) {
      const realTotal = await ctx.db.query("waitlist").count();
      const displayPosition = Math.max(1, 101 - realTotal);
      return {
        success: false,
        error: "This email is already on the waitlist!",
        referralCode: existing.referralCode,
        position: displayPosition,
      };
    }

    // Generate unique referral code
    let referralCode = generateReferralCode();
    let codeExists = await ctx.db
      .query("waitlist")
      .withIndex("by_referralCode", (q) => q.eq("referralCode", referralCode))
      .first();
    while (codeExists) {
      referralCode = generateReferralCode();
      codeExists = await ctx.db
        .query("waitlist")
        .withIndex("by_referralCode", (q) => q.eq("referralCode", referralCode))
        .first();
    }

    // If referred, increment referrer's count
    let referrerName: string | null = null;
    if (ref) {
      const referrer = await ctx.db
        .query("waitlist")
        .withIndex("by_referralCode", (q) => q.eq("referralCode", ref))
        .first();
      if (referrer) {
        await ctx.db.patch(referrer._id, {
          referralCount: referrer.referralCount + 1,
        });
      }
    }

    // Create entry
    const entryId = await ctx.db.insert("waitlist", {
      email: cleanEmail,
      referralCode,
      referredBy: ref || undefined,
      referralCount: 0,
      source: ref ? "referral" : "waitlist-page",
    });

    const realTotal = await ctx.db.query("waitlist").count();
    const displayPosition = Math.max(1, 101 - realTotal);

    return {
      success: true,
      message: `Welcome! You're #${displayPosition} on the list.`,
      entry: {
        id: entryId,
        email: cleanEmail,
        position: displayPosition,
        referralCode,
        referredBy: ref || null,
        referrerName,
      },
    };
  },
});

// ── Public: get referral stats ──
export const getReferralStats = query({
  args: { referralCode: v.string() },
  handler: async (ctx, { referralCode }) => {
    const entry = await ctx.db
      .query("waitlist")
      .withIndex("by_referralCode", (q) => q.eq("referralCode", referralCode))
      .first();
    if (!entry) return { success: false, error: "Not found" };
    return {
      success: true,
      referralCode: entry.referralCode,
      referralCount: entry.referralCount,
      email: entry.email,
    };
  },
});

// ── Admin: get all entries ──
// Admin key is validated server-side using Convex environment variable.
// Set it via: npx convex env set ADMIN_KEY "your-secret-key"
export const getAll = query({
  args: { adminKey: v.string() },
  handler: async (ctx, { adminKey }) => {
    const expectedKey = process.env.ADMIN_KEY;
    if (!expectedKey || adminKey !== expectedKey) {
      return { success: false, error: "Unauthorized" };
    }
    const entries = await ctx.db.query("waitlist").order("desc").collect();
    return { success: true, entries };
  },
});
