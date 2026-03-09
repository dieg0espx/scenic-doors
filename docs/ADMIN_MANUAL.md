# Scenic Doors — Admin & Sales Rep Manual

This guide covers every feature available in the Scenic Doors admin dashboard. It is written for two roles: **Admins** (full system access) and **Sales Reps** (limited to their own quotes, leads, and account settings). Role-specific sections are clearly marked.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Managing Quotes](#2-managing-quotes)
3. [Managing Leads](#3-managing-leads)
4. [Managing Clients](#4-managing-clients)
5. [Managing Orders](#5-managing-orders)
6. [Portal Management](#6-portal-management)
7. [Payments & Invoices](#7-payments--invoices)
8. [Contracts](#8-contracts)
9. [Notification Settings (Admin Only)](#9-notification-settings-admin-only)
10. [User Management (Admin Only)](#10-user-management-admin-only)
11. [Marketing Analytics (Admin Only)](#11-marketing-analytics-admin-only)
12. [Account Settings (Sales Rep)](#12-account-settings-sales-rep)
13. [Email System Reference](#13-email-system-reference)
14. [Automated Processes](#14-automated-processes)

---

## 1. Getting Started

### Logging In

1. Navigate to `/login`
2. Enter your **email** and **password**
3. Click **Sign In**

If your account was just created, check your email for a welcome message containing your temporary password. You should change it immediately after logging in.

### Roles

| Role | Access |
|------|--------|
| **Admin** | Full access to all sections: Quotes, Leads, Orders, Marketing, Users, Notifications |
| **Sales Rep** | Access to own Quotes, all Leads (shared detail only), Orders, and Account Settings |

Your role is shown as a badge next to your name in the sidebar.

### Dashboard Overview

The dashboard (`/admin`) is the first screen you see after logging in.

**Admin Dashboard Metrics:**

| Metric | Description |
|--------|-------------|
| Total Leads | Count of all leads in the system |
| Total Quotes | Count of all quotes |
| Total Quote Value | Sum of all quote grand totals |
| Pending Orders | Orders not yet completed |
| Total Orders | Count of all orders |
| Conversion Rate | Percentage of quotes that became orders |
| Avg Order Volume | Average grand total across orders |

**Sales Rep Dashboard Metrics:**

| Metric | Description |
|--------|-------------|
| Total Leads | Count of all leads (shared) |
| My Quotes | Quotes you created or are assigned to |
| My Quote Value | Sum of your quotes' grand totals |
| Hot Leads | Leads marked as "hot" |
| Follow-Ups Due | Quotes with follow-ups due today |

**Dashboard Sections:**

- **Follow-Up Reminders** — Shows up to 5 quotes with follow-ups due today. Click any to go to the quote detail page.
- **Recent Activity** — The last 10 quotes with lead status badge, quote status badge, quote number, door type, creator, follow-up indicator, time ago, and grand total.
- **Quick Actions:**
  - **New Quote** — Opens the quote creation form
  - **View All Orders** — Goes to the orders list
  - **Generate Report** *(Admin only)* — Opens reporting tools
  - **Manage Users** *(Admin only)* — Goes to user management

### Sidebar Navigation

All users see:
- **Dashboard** — Home page with metrics and activity
- **Quotes** — Quote list and management
- **Leads** — Lead list and management
- **Orders** — Order list and management

Admin only:
- **Marketing** — Analytics and conversion tracking
- **Users** — User management
- **Notifications** — Notification recipient settings

Sales Rep only:
- **My Account** — Profile and password settings

**Sign Out** button is at the bottom of the sidebar.

---

## 2. Managing Quotes

### Quote List

Navigate to **Quotes** (`/admin/quotes`) to see all quotes.

**Header Stats:**
- **Total Quotes** — Count of quotes matching current filters
- **Pipeline Value** — Sum of grand totals for filtered quotes

**Filtering & Sorting:**

| Filter | Options |
|--------|---------|
| Status | All, Draft, Sent, Viewed, Accepted, Pending Approval, Declined |
| Intent Level | Browse, Medium, Full |
| Search | By quote number or client name |
| Sort | By date, total, status, client name |

> **Sales Reps:** You only see quotes you created, are assigned to, or that have been shared with you.

**Each quote row shows:**
- Quote number
- Client name with initials avatar
- Lead status badge (New / Hot / Warm / Cold / Hold / Archived)
- Customer type (Homeowner / Contractor / Architect / Dealer / Other)
- Door type
- Created by
- Grand total
- Last updated date

Click any quote to open its detail page.

---

### Creating a Quote

1. Click **"New Quote"** from the Quotes page or dashboard
2. Fill in the quote form at `/admin/quotes/new`

**Form Fields:**

| Field | Description |
|-------|-------------|
| **Client Info** | Name, email, phone, ZIP — or select an existing client |
| **Assign To** | Select a sales rep to own this quote |
| **Door Type** | Multi-Slide & Pocket, Ultra Slim, Bi-Fold, Slide & Stack, Awning |
| **Door Type Slug** | Auto-set based on door type selection |
| **Material** | Material specification |
| **Width × Height** | Opening dimensions in inches |
| **Number of Panels** | Panel count for the door |
| **Panel Layout** | Configuration code (e.g., "2L-2R" for split bi-fold) |
| **System Type** | Slider vs. Pocket (for applicable products) |
| **Exterior Color** | Frame color: Black, White, Bronze, Anodized Aluminum |
| **Interior Color** | *(If different from exterior)* Two-tone interior finish |
| **Glass Type** | Low-E3, Clear, Laminated |
| **Hardware Finish** | Black, White, Silver (Bronze for Awning) |
| **Delivery Type** | Delivery or Local Pickup |
| **Delivery Address** | Full address (street, unit, city, state, zip) if delivery |
| **Installation Cost** | $30/sq ft calculated, can override |
| **Delivery Cost** | $800 flat fee default |
| **Tax** | 8% calculated automatically |
| **Notes** | Additional notes visible to client |
| **Lead Status** | New, Hot, Warm, Cold, Hold, Archived |
| **Follow-Up Date** | Next follow-up date |
| **Customer Type** | Homeowner, Contractor, Architect, Dealer, Other |

**Line Items & Pricing:**
The form automatically calculates:
- **Base Price** = (width × height / 144) × rate per sq ft
- **Glass Modifier** = glass price adjustment × number of panels
- **Product Price** = base + glass modifier
- **Subtotal**, **Installation**, **Delivery**, **Tax**, **Grand Total**

**Saving:**
- **Save as Draft** — Saves without sending to the client
- **Send to Client** — Saves and sends the quote email with portal link

> **Tip:** When creating a quote from a lead, fields are pre-filled with the lead's contact information.

---

### Quote Detail Page

The quote detail page (`/admin/quotes/[id]`) is the central hub for managing a single quote.

**Header:**
- Quote number and creation date
- Lead status badge and quote status badge
- Assigned rep name with avatar
- Shared-with list (who else can see this quote)
- Portal link (the URL clients use to access their portal)

**If status is "Pending Approval":** A prominent banner appears with **"Approve"** and **"Decline"** buttons.

**Sections:**

| Section | What It Shows |
|---------|---------------|
| **Customer Info** | Client name, email, phone, ZIP, customer type badge |
| **Door Specifications** | Door type, material, size, panels, per-panel width, layout, direction, swing, colors, glass, hardware, system type |
| **Line Items** | Table of items with name, quantity, unit price, total, descriptions |
| **Pricing** *(sidebar)* | Grand total, per-item breakdown (base price, glass modifier, product price), subtotal, installation, delivery, tax |
| **Delivery Info** | Delivery type, full formatted address |
| **Shared With** *(Admin only)* | List of reps with access; add/remove via dropdown |
| **Email History** | Last 5 emails sent with subject, recipient, date |
| **Notes & Tasks** | Add notes, create tasks with due dates, check off completed tasks |
| **Portal Management** | Approval drawings, photos, documents, follow-ups (see [Section 6](#6-portal-management)) |

---

### Quote Actions

| Action | How | Description |
|--------|-----|-------------|
| **Send to Client** | Click **"Send to Client"** button | Sends quote email with portal link. Sets status to "sent." |
| **Edit** | Click **"Edit"** button | Opens the edit form with all fields pre-filled |
| **Download PDF** | Click **"Download"** button | Generates and downloads a PDF of the quote |
| **Print** | Click **"Print"** button | Opens a print-friendly view at `/admin/quotes/[id]/print` |
| **Approve** | Click **"Approve"** on pending approval banner | Approves the quote, sends approval email with contract link to client. Status → "approved" |
| **Decline** | Click **"Decline"** on pending approval banner | Declines the quote. Status → "declined" |
| **Assign** *(Admin)* | Use the assign dropdown | Assigns the quote to a sales rep |
| **Share** *(Admin)* | Use the share modal | Gives another sales rep read access |

---

### Quote Status Lifecycle

```
draft → sent → viewed → pending_approval → approved → order
                                         → declined
```

| Status | Meaning | How It's Triggered |
|--------|---------|--------------------|
| **Draft** | Quote saved but not sent | Created and saved |
| **Sent** | Email sent to client | Admin clicks "Send to Client" |
| **Viewed** | Client opened the portal link | Auto-set when client visits quote page |
| **Pending Approval** | Client accepted, awaiting admin review | Client clicks "Accept Quote" |
| **Approved** | Admin approved; contract sent | Admin clicks "Approve" |
| **Declined** | Client or admin declined | Client clicks "Decline" or admin declines |
| **Order** | Converted to an order | Contract signed and order created |

---

## 3. Managing Leads

### Lead List

Navigate to **Leads** (`/admin/leads`) to see all leads.

**Lead Metrics:**

| Metric | Description |
|--------|-------------|
| Total Leads | All leads |
| Without Quotes | Leads that don't have a related quote |
| With Quotes | Leads with at least one quote |
| New This Week | Leads created in the last 7 days |
| Needs Attention | Leads with follow-ups due today + hot leads older than 48 hours |

**Lead List Shows:**
- Lead name
- Contact info (email, phone, ZIP)
- Status badge with color coding
- "Needs Attention" badge if applicable
- Related quotes with status badges
- Number of quotes

**Lead Status Colors:**

| Status | Color |
|--------|-------|
| Hot | Orange |
| Warm | Amber |
| Cold | Sky Blue |
| New | Blue |
| Hold | Gray |
| Archived | Zinc |

---

### Lead Detail Page

The lead detail page (`/admin/leads/[id]`) shows everything about a lead.

**Header:**
- Lead name
- Status badge (Hot / Warm / Cold / New / Hold / Archived)
- Workflow status (Contacted / Qualified / Lost)
- **"Create Quote"** button — creates a new quote pre-filled with this lead's contact info

**Sections:**

| Section | Content |
|---------|---------|
| **Lead Info** | Name, email, phone, ZIP, customer type, created date, last contact date |
| **Related Quotes** | All quotes created from this lead with quote number, status, total, created date. Click any to go to the quote. |
| **Follow-Ups** | Scheduled follow-ups with date, notes, assigned rep |
| **Shared With** *(Admin only)* | Share lead with sales reps; select multiple reps; view current shares |

**Creating a Quote from a Lead:**
1. Open the lead detail page
2. Click **"Create Quote"**
3. The quote form opens with the lead's name, email, phone, ZIP, and customer type pre-filled
4. Complete the remaining fields and save

---

### Lead Status Management

Statuses can be changed manually or are aged automatically (see [Section 14](#14-automated-processes)):

| Status | Description |
|--------|-------------|
| **New** | Freshly created lead |
| **Hot** | Actively interested, high priority |
| **Warm** | Interested but not urgent |
| **Cold** | Low engagement or no recent activity |
| **Hold** | Paused — waiting on the client |
| **Archived** | No longer active |

**Workflow statuses** (independent of lead status):
- **Contacted** — Initial outreach made
- **Qualified** — Lead has been vetted
- **Lost** — Lead did not convert

---

## 4. Managing Clients

### Client List

Navigate to **Clients** (`/admin/clients`) to see all clients.

Shows:
- Total clients count
- Search and filter controls
- Client cards with name, email, phone, number of quotes, total quote value, and quick action buttons

---

### Creating a Client

1. Click **"New Client"** to go to `/admin/clients/new`
2. Fill in the form:

| Field | Required | Description |
|-------|----------|-------------|
| **Name** | Yes | Full name |
| **Email** | No | Email address |
| **Phone** | No | Phone number |
| **Addresses** | No | Add one or more addresses with labels; mark one as default |
| **Customer Type** | No | Homeowner, Contractor, Architect, Dealer, Other |
| **Notes** | No | Internal notes |

3. Click **"Save"**

---

### Editing a Client

1. Go to the client list and click **"Edit"** on any client
2. Update any fields on the edit form (`/admin/clients/[id]/edit`)
3. Click **"Save Changes"**

---

### Client Detail Page

The client detail page (`/admin/clients/[id]`) shows:
- Full profile with contact info
- All addresses
- Quote history with totals
- Related orders

---

## 5. Managing Orders

### Order List

Navigate to **Orders** (`/admin/orders`) to see all orders.

Shows:
- Total orders count
- Search and filter by status
- Order cards with quote number, client name, status badge, total value, created date

**Order Statuses:**

| Status | Color | Description |
|--------|-------|-------------|
| **Pending** | Gray | Order created, awaiting action |
| **In Progress** | Blue | Deposit paid, manufacturing underway |
| **Completed** | Green | Fully delivered |
| **On Hold** | Amber | Paused |
| **Cancelled** | Red | Order cancelled |

---

### Order Detail Page

The order detail page (`/admin/orders/[id]`) is the command center for fulfillment.

**Header:**
- Quote number (links to quote)
- Client name
- Status badge
- Order total

**Progress Timeline:**
A visual timeline showing 6 stages:
1. Order Created
2. Deposit Paid (50% advance)
3. Manufacturing
4. Balance Paid (50% balance)
5. Shipping
6. Delivered

Completed stages show filled green dots. The current stage is highlighted. Future stages are grayed out.

**Sections:**

| Section | Content |
|---------|---------|
| **Customer & Delivery** | Client name, email, phone, delivery address, order date |
| **Door Specifications** | Same spec grid as the quote |
| **Pricing Breakdown** | Full price breakdown from the quote |
| **Payments** | Payment cards, invoice actions (see below) |
| **Portal Management** | Approval drawing, photos, documents, notes & tasks |
| **Email History** | All emails sent for this order |
| **Downloads** | Quote PDF, approval drawing, signed contract, other documents |

---

### Order Actions

These are the key actions you'll take to move an order through its lifecycle:

#### Sending Invoices

| Action | Button | What Happens |
|--------|--------|--------------|
| **Send Deposit Invoice** | "Send Deposit Invoice" | Creates 50% advance payment record, sends invoice email to client with payment link |
| **Send Balance Invoice** | "Send Balance Invoice" | Creates 50% balance payment record, sends invoice email to client |

#### Manufacturing

| Action | Button | What Happens |
|--------|--------|--------------|
| **Start Manufacturing** | "Start Manufacturing" | Updates order to "In Progress," sets portal stage to "manufacturing," sends manufacturing started email to client |

#### Shipping

| Action | Field/Button | What Happens |
|--------|-------------|--------------|
| **Enter Tracking** | Tracking code input field | Enter the tracking number and carrier info |
| **Sync Tracking** | "Sync Tracking" button | Confirms tracking info and sends shipping notification email to client |

#### Delivery

| Action | Button | What Happens |
|--------|--------|--------------|
| **Mark as Delivered** | "Mark as Delivered" | Sets order to "Completed," portal stage to "delivered," sends delivery thank-you email to client |

---

### Order Lifecycle

```
Order Created
  → Deposit Invoice Sent → Deposit Paid → Start Manufacturing
  → Manufacturing Complete → Balance Invoice Sent → Balance Paid
  → Enter Tracking → Ship → Mark as Delivered
```

**Portal stage progression (visible to client):**

| Portal Stage | Triggered By |
|-------------|-------------|
| `quote_sent` | Quote sent to client |
| `drawing_requested` | Client requests approval drawing |
| `approval_pending` | Drawing ready for review |
| `approval_signed` | Client signs drawing |
| `deposit_1_pending` | Order confirmed, waiting for deposit |
| `manufacturing` | Deposit paid, manufacturing starts |
| `deposit_2_pending` | Manufacturing done, waiting for balance |
| `shipping` | Balance paid, order ships |
| `delivered` | Order delivered |

---

## 6. Portal Management

Portal management tools appear within the quote and order detail pages. They let you manage everything the client sees in their portal.

### Approval Drawings

**Creating and Sending an Approval Drawing:**
1. Open the quote or order detail page
2. Find the **Approval Drawing** section in Portal Management
3. Configure the drawing details (panel count, dimensions, colors, hardware)
4. Click **"Save"** to save the drawing
5. Click **"Send"** to send it to the client

The client receives an email: *"Approval Drawing Ready — Quote QT-XXXX-XXX"* with a link to review and sign in their portal.

**Checking Signature Status:**
- **Not requested:** No drawing exists yet
- **Requested:** Client has requested a drawing (you'll see the request)
- **Sent:** Drawing sent, awaiting client signature
- **Signed:** Client has signed — shows signer name and date

> When a client signs an approval drawing, an order is automatically created and the portal stage advances to "deposit_1_pending."

---

### Photos

- View photos the client has uploaded (organized by Interior / Exterior)
- Upload additional photos from the admin side
- Delete photos as needed
- Photos are displayed in a thumbnail grid with captions

---

### Documents

- Upload supporting documents (PDFs, Word files, etc.)
- Documents are available for the client to download in their portal
- Drag to organize
- Delete documents as needed

---

### Follow-Ups

- Set a **follow-up date** for the quote
- View existing follow-ups
- Mark follow-ups as completed
- Follow-up reminders appear on the dashboard when due

> **Note:** Three automated follow-up emails are also scheduled when a quote is created (see [Section 14](#14-automated-processes)). These are separate from manually set follow-up dates.

---

### Notes & Tasks

- **Add a note** — Free-text note with timestamp, visible to all team members
- **Create a task** — Task with a due date that can be checked off when complete
- **View task history** — See completed and pending tasks

---

## 7. Payments & Invoices

### Payments Page

Navigate to **Orders** and open an order to manage payments, or view payment records within the order detail.

**Payment List Shows:**
- Quote number
- Client name
- Payment type badge (50% Advance / 50% Balance)
- Amount
- Status badge (Pending / Confirmed / Failed)
- Date
- Action buttons

**Payment Statuses:**

| Status | Color | Description |
|--------|-------|-------------|
| Pending | Amber | Invoice sent, awaiting payment |
| Confirmed | Green | Payment received and confirmed |
| Failed | Red | Payment attempt failed |

---

### Sending an Invoice

1. Open the order detail page
2. Click **"Send Deposit Invoice"** (for 50% advance) or **"Send Balance Invoice"** (for 50% balance)
3. The system:
   - Creates a payment record (type: `advance_50` or `balance_50`, status: `pending`)
   - Sends an invoice email to the client with a link to pay online
   - Records the email in history

---

### Confirming a Payment

When a client completes payment through Square, the system automatically:
1. Updates the payment status to "confirmed"
2. Sends a **payment receipt email** to the client (with PDF attachment)
3. Updates the order status and portal stage:
   - **Advance paid:** Order → "In Progress," portal → "manufacturing"
   - **Balance paid:** Order → "Completed," portal → "shipping"
4. Sends internal notification to configured admins
5. Sends Slack notification (if configured)

You can also manually mark a payment as confirmed if needed.

---

### Downloading Invoices and Receipts

| Document | File Name Format | When Available |
|----------|-----------------|----------------|
| Invoice (Advance) | `Invoice-INV-XXXXX-A.pdf` | After sending deposit invoice |
| Invoice (Balance) | `Invoice-INV-XXXXX-B.pdf` | After sending balance invoice |
| Receipt (Advance) | `Receipt-INV-XXXXX-A.pdf` | After advance payment confirmed |
| Receipt (Balance) | `Receipt-INV-XXXXX-B.pdf` | After balance payment confirmed |

Click the **"Download Invoice"** or **"Download Receipt"** buttons on the payment cards. You can also resend invoice emails to the client.

---

## 8. Contracts

### Viewing Contracts

Navigate to the contract section (accessible via order details) to see signed contracts.

**Contract List Shows:**
- Quote number
- Client name
- Signed date
- **"Download PDF"** button
- **"View Details"** button

**Contract Details Include:**
- Service agreement text
- Project specifications
- Payment terms (50% advance amount)
- Terms and conditions (5 items)
- Client signature image
- Signer name and date
- IP address and user agent (for verification)

> **Note:** Contracts are signed by clients on the contract page (`/quote/[id]/contract`) after you approve a quote. You cannot create or modify contracts from the admin side — they are generated automatically when the client signs.

---

## 9. Notification Settings (Admin Only)

Navigate to **Notifications** (`/admin/notifications`) to configure who receives email notifications for each event type.

### Notification Types

| # | Type | Trigger |
|---|------|---------|
| 1 | **New Lead** | A new lead is created (from the quote wizard) |
| 2 | **New Quote** | A new quote is submitted |
| 3 | **Quote Pending Approval** | A client accepts a quote, awaiting admin approval |
| 4 | **Quote Accepted** | Admin approves a quote |
| 5 | **Quote Declined** | A client declines a quote |
| 6 | **Payment Received** | A client payment is confirmed |
| 7 | **Approval Drawing Signed** | A client signs their approval drawing |
| 8 | **Order Stage Change** | An order moves to a new stage (manufacturing, shipping, delivered) |
| 9 | **Contract Signed** | A client signs their contract |

### Configuring Recipients

For each notification type:
1. Click the notification type card
2. Use the dropdown to **add team member email addresses** as recipients
3. Multiple recipients are supported
4. Click to **remove** any recipient

Emails are sent from the system SMTP address to all configured recipients when the event occurs.

### Slack Integration

If the `SLACK_WEBHOOK_URL` environment variable is configured:
- A **"Connected"** status indicator appears on the notifications page
- All notifications are also sent to Slack with rich formatting (Block Kit)
- Slack messages include color-coded sidebars, details tables, and action buttons linking to the admin page

**Slack Notification Colors:**

| Event | Color |
|-------|-------|
| New Quote | Purple (#7c3aed) |
| Quote Pending Approval | Amber (#d97706) |
| Quote Declined | Red (#dc2626) |
| Quote Approved | Green (#16a34a) |
| Payment Received | Green (#16a34a) |
| Approval Drawing Requested | Amber (#d97706) |
| Approval Drawing Signed | Blue (#2563eb) |
| New Lead | Teal (#0d9488) |

> Slack notifications are non-blocking — if the webhook fails, it doesn't affect any operations.

---

## 10. User Management (Admin Only)

Navigate to **Users** (`/admin/users`) to manage team members.

### User List

A table showing all users with:
- Name
- Email
- Role badge (Admin / Sales Rep)
- Status badge (Active / Inactive)
- Phone
- Start date
- Quotes assigned count
- Orders assigned count
- Action buttons: View Profile, Edit, Delete

---

### Adding a New User

1. Click **"Add User"**
2. Fill in the form:

| Field | Required | Description |
|-------|----------|-------------|
| **Name** | Yes | Full name |
| **Email** | Yes | Login email — a welcome email with temporary password is sent here |
| **Phone** | No | Phone number |
| **Home Zipcode** | No | User's home ZIP code |
| **Prefix** | No | 2–4 letter code used in quote numbering (e.g., "SD" → QT-SD-2025-001) |
| **Start Date** | No | Defaults to today |
| **Location Code** | No | Location identifier (e.g., "SD" for San Diego) |
| **Role** | Yes | Admin or Sales Rep |
| **Zipcodes** | No | Service area ZIP codes (enter multiple, comma or space separated) |
| **Referral Codes** | No | Referral codes assigned to this user (enter multiple, comma or space separated) |

3. Click **"Save"**

The new user receives a **welcome email** with their role, email, temporary password, and a login link. The email instructs them to change their password after first login.

---

### Editing a User

1. Click **"Edit"** on any user in the list
2. Update any fields
3. Click **"Save Changes"**

You can:
- Change their role (Admin ↔ Sales Rep)
- Update their zipcodes and referral codes
- Modify their prefix and location code
- Change their status (Active / Inactive)

---

### Deleting a User

1. Click **"Delete"** on any user in the list
2. Confirm the deletion

> **Caution:** Deleting a user removes their account. Quotes and leads assigned to them remain in the system but will no longer be associated with an active user.

---

## 11. Marketing Analytics (Admin Only)

Navigate to **Marketing** (`/admin/marketing`) to view business metrics and conversion data.

### Metric Cards

| Metric | Description |
|--------|-------------|
| **Abandoned Leads** | Leads that never received a quote |
| **Completed Quotes** | Quotes that converted to orders |
| **Revenue** | Total revenue from completed orders |
| **Conversion Rate** | Quote-to-order conversion percentage |
| **Avg Quote Value** | Average quote grand total |
| **Cost Per Lead** | Marketing spend divided by lead count |
| **ROI** | Return on investment percentage |

### Charts & Visualizations

| Chart | What It Shows |
|-------|---------------|
| **Revenue by Source** | Revenue breakdown by lead source (Google, Referral, Social Media, etc.) |
| **Leads Over Time** | Time-series chart of lead volume |
| **Conversion Funnel** | Visual funnel: Leads → Quotes → Orders |

---

## 12. Account Settings (Sales Rep)

Sales Reps can manage their own profile and password at **My Account** (`/admin/account`).

### Profile Information

Edit your personal details:

| Field | Description |
|-------|-------------|
| **Name** | Your display name |
| **Email** | Your login email |
| **Phone** | Your phone number |
| **Home Zipcode** | Your home ZIP code |
| **Prefix** | Your 2–4 letter quote prefix |
| **Start Date** | Your start date |
| **Location Code** | Your location identifier |
| **Zipcodes** | Your assigned service area ZIP codes (add/remove) |
| **Referral Codes** | Your referral codes (add/remove) |
| **Role** | *(Read-only)* Shown as a badge |
| **Status** | *(Read-only)* Active or Inactive badge |

Click **"Save Changes"** to update.

### Change Password

1. Enter your **new password** (minimum 8 characters)
2. **Confirm** the new password
3. Use the **show/hide toggle** to verify what you typed
4. Click **"Update Password"**

---

## 13. Email System Reference

The system sends 14 distinct email types. Here is the complete reference:

### Client-Facing Emails

| # | Email Name | Subject | Trigger | Recipient |
|---|-----------|---------|---------|-----------|
| 1 | **Quote Email** | "Your Quote QT-XXXX-XXX from Scenic Doors" | Admin sends quote | Client |
| 2 | **Estimate Confirmation** | "We Received Your Inquiry — QT-XXXX-XXX" | New quote/estimate submitted | Client |
| 3 | **Follow-Up #1** | "Had a chance to review your quote? — Quote QT-XXXX-XXX" | Cron job, 4 days after quote creation | Client |
| 4 | **Follow-Up #2** | "Just checking in on your door project — Quote QT-XXXX-XXX" | Cron job, 8 days after creation | Client |
| 5 | **Follow-Up #3** | "Final follow-up on your Scenic Doors quote — Quote QT-XXXX-XXX" | Cron job, 12 days after creation | Client |
| 6 | **Quote Approved** | "Quote QT-XXXX-XXX Approved — Sign Your Contract" | Admin approves quote | Client |
| 7 | **Approval Drawing Ready** | "Approval Drawing Ready — Quote QT-XXXX-XXX" | Admin sends approval drawing | Client |
| 8 | **Invoice** | "Invoice INV-XXXXX-A — 50% Advance Payment" | Admin sends invoice | Client |
| 9 | **Payment Receipt** | "Payment Receipt INV-XXXXX-A" | Payment confirmed | Client |
| 10 | **Manufacturing Started** | "Your Doors Are Now in Manufacturing — [Order#]" | Admin starts manufacturing | Client |
| 11 | **Shipping Notification** | "Your Order Has Shipped — [Order#]" | Admin enters tracking info | Client |
| 12 | **Delivery Thank You** | "Your Order Has Been Delivered — [Order#]" | Admin marks delivered | Client |

### Internal Emails

| # | Email Name | Subject | Trigger | Recipient |
|---|-----------|---------|---------|-----------|
| 13 | **New Quote Notification** | "New Quote QT-XXXX-XXX — [Client Name]" | New quote created | Configured admins + assigned rep |
| 14 | **Welcome Email** | "Your Scenic Doors Account Has Been Created" | New user account created | New user |

### Internal Notifications (via Generic Template)

These use the internal notification email template and are sent to admins configured in notification settings:

| Event | Heading |
|-------|---------|
| Quote Pending Approval | Client accepted, awaiting admin review |
| Quote Declined | Client declined quote |
| Quote Accepted | Admin approved quote |
| Contract Signed | Client signed contract |
| Approval Drawing Requested | Client requested drawing |
| Approval Drawing Signed | Client signed drawing |
| Payment Received | Client completed payment |
| Order Stage Change | Order moved to new stage |
| New Lead | New lead created |

---

### Email History

All emails are logged in the email history and visible on the quote/order detail page. The last 5 emails are shown with subject, recipient, and send date. Older emails show as a "+N more" indicator.

---

## 14. Automated Processes

### Follow-Up Email Automation

The system automatically sends three follow-up emails to clients who haven't responded to their quote.

**Schedule:**

| Follow-Up | Days After Quote | Subject | Tone |
|-----------|-----------------|---------|------|
| #1 | 4 days | "Had a chance to review your quote?" | Casual check-in |
| #2 | 8 days | "Just checking in on your door project" | Understanding, giving time |
| #3 | 12 days | "Final follow-up on your Scenic Doors quote" | Last attempt, open door |

**How it works:**
1. When a quote is created, three follow-up records are scheduled at 4-day intervals
2. A daily cron job (`/api/cron/follow-ups`) checks for follow-ups due "now or earlier"
3. For each due follow-up:
   - Checks that the quote still exists and isn't already converted, closed, or an order
   - Sends the email to the client (full-tier quotes include portal link; browse/medium tier show contact info)
   - Marks the follow-up as "sent"
   - Records the email in history
4. After the 3rd follow-up with no response, the lead is automatically marked as **"cold"**

**Follow-ups are skipped if:**
- The quote status is "converted," "closed," or "order"
- The follow-up has already been sent
- The quote no longer exists

---

### Lead Status Auto-Aging

The same daily cron job also automatically ages lead and quote statuses based on inactivity.

**Quote Lead Status Aging:**

| Current Status | Days of Inactivity | New Status |
|---------------|-------------------|------------|
| New or Hot | 3 days | Warm |
| Warm | 7 days | Cold |
| Cold | 14 days | Archived |

**Lead Temperature Aging:**

| Current Status | Days of Inactivity | New Status |
|---------------|-------------------|------------|
| Hot | 3 days | Warm |
| Warm | 7 days | Cold |

> **Note:** Leads do not auto-age to "archived" — only quotes do.

**What resets the inactivity timer:**
Any admin activity on the quote or lead resets the clock:
- Adding or editing notes
- Changing status manually
- Sharing with team members
- Any field update (updates the `last_activity_at` timestamp)

**Workflow status** (`contacted`, `qualified`, `lost`) is never auto-aged — it can only be changed manually.

---

### Auto-Created Records

Certain actions automatically create related records:

| Trigger | Auto-Created Records |
|---------|---------------------|
| Client signs **approval drawing** | Order record created; order tracking record created with deposit amounts; portal stage → "deposit_1_pending" |
| Client signs **contract** | Contract record; 50% advance payment record (pending); order record; redirect to invoice page |
| **Advance payment** confirmed | Order status → "in_progress"; portal stage → "manufacturing"; tracking stage updated |
| **Balance payment** confirmed | Order status → "completed"; portal stage → "shipping"; tracking stage updated |

---

### Cron Job Configuration

The follow-up and aging cron endpoint is at:
```
GET /api/cron/follow-ups
Authorization: Bearer {CRON_SECRET}
```

This endpoint runs both `sendPendingFollowUps()` and `ageLeadStatuses()` in parallel and returns the results. It should be configured to run daily (e.g., via Vercel Cron, external cron service, or similar scheduler).

---

*This guide covers the Scenic Doors admin dashboard as of the current platform version. For questions or issues, contact your system administrator.*
