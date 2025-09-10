import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// --- Better Auth Adapter Tables ---
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// Profile table - handles students, admins, and security personnel details
export const profile = sqliteTable("profile", {
  id: text("id").notNull().primaryKey(), // Independent ID, not tied to user initially
  role: text("role", { enum: ["STUDENT", "ADMIN", "SECURITY"] }).default("STUDENT").notNull(),
  
  // Basic info (can be set by admin before login)
  name: text("name"),
  email: text("email").notNull().unique(), // Email is required for identification
  
  // Student specific details
  rollNumber: text("roll_number").unique(),
  branch: text("branch"),
  course: text("course", { enum: ["BTECH", "IDD", "MTECH", "PHD"] }),
  hostelName: text("hostel_name"),
  roomNumber: text("room_number"),
  bloodGroup: text("blood_group"),
  homeAddress: text("home_address"),
  photoPath: text("photo_path"), // e.g., /secure-assets/photos/rollnumber.png
  totpSecret: text("totp_secret"), // This will be stored encrypted
  
  // Link to user account (nullable - set when user first logs in)
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  
  // Timestamps
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .notNull(),
});

// Scan logs table - tracks all QR code scans
export const scanLogs = sqliteTable("scan_logs", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    studentId: text("student_id").notNull().references(() => profile.id, { onDelete: "cascade" }),
    scannedById: text("scanned_by_id").notNull().references(() => profile.id, { onDelete: "cascade" }),
    location: text("location").notNull(),
    timestamp: integer("timestamp", { mode: "timestamp" }).notNull(),
    status: text("status", { enum: ["SUCCESS", "MANUAL", "FAILURE"] }).notNull(),
    notes: text("notes"),
});

// User and Profile relationships
export const userRelations = relations(user, ({ one }) => ({
    profile: one(profile, {
        fields: [user.id],
        references: [profile.userId],
    }),
}));

export const profileRelations = relations(profile, ({ one, many }) => ({
    user: one(user, {
        fields: [profile.userId],
        references: [user.id],
    }),
    scansAsStudent: many(scanLogs, { relationName: "studentScans" }),
    scansAsScanner: many(scanLogs, { relationName: "scannerScans" }),
}));

export const scanLogsRelations = relations(scanLogs, ({ one }) => ({
    student: one(profile, {
        fields: [scanLogs.studentId],
        references: [profile.id],
        relationName: "studentScans",
    }),
    scanner: one(profile, {
        fields: [scanLogs.scannedById],
        references: [profile.id],
        relationName: "scannerScans",
    }),
}));

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});
