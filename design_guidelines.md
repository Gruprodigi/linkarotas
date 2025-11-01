# Design Guidelines: iFood Delivery Route Management System

## Design Approach

**Selected Approach:** Design System (Material Design) with Logistics Application Patterns

**Justification:** This is a utility-focused, information-dense application where efficiency and clarity are paramount for delivery drivers. Drawing inspiration from successful logistics platforms like Uber Driver and DoorDash Driver apps, combined with Material Design's strong data visualization patterns.

**Core Principles:**
- Speed and efficiency over visual flourish
- Information hierarchy optimized for quick scanning
- Mobile-first responsive design (drivers use phones)
- Clear call-to-action hierarchy for rapid decision-making

---

## Typography System

**Font Stack:** 
- Primary: Inter (Google Fonts) - exceptional readability for data-dense interfaces
- Monospace: JetBrains Mono - for order numbers and addresses

**Hierarchy:**
- H1 (Page Titles): text-3xl md:text-4xl, font-bold, tracking-tight
- H2 (Section Headers): text-2xl md:text-3xl, font-semibold
- H3 (Card Headers): text-xl, font-semibold
- Body Large (Primary Info): text-base md:text-lg, font-medium
- Body Regular (Secondary Info): text-sm md:text-base, font-normal
- Small (Metadata): text-xs md:text-sm, font-normal
- Order Numbers: font-mono, text-sm, font-semibold

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, and 12 (p-2, m-4, gap-6, py-8, space-y-12)

**Container Strategy:**
- Dashboard/Main View: max-w-7xl mx-auto with px-4 md:px-6
- Sidebar (if used): Fixed width of w-64 md:w-80
- Content Cards: Full width within containers with consistent p-6
- Map Container: Full viewport height minus header (h-[calc(100vh-4rem)])

**Grid Layouts:**
- Order Cards Grid: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
- Order Details: Single column on mobile, 2-column split on desktop
- Action Buttons: Flex row with gap-2 md:gap-4

---

## Core Component Library

### A. Navigation & Layout

**Top Navigation Bar:**
- Sticky positioning (sticky top-0 z-50)
- Height: h-16
- Contains: Logo/Brand (left), primary actions (center), user menu (right)
- Shadow: shadow-md for depth separation
- Padding: px-4 md:px-6

**Main Dashboard Layout:**
- Two-section design: Order List (left 60%) + Map View (right 40%) on desktop
- Stacked on mobile: Order List → Map View
- Toggle button for mobile to switch between list and map views

### B. Order Management Components

**Order Card (Critical Component):**
- Border with rounded-lg corners
- Padding: p-6
- Shadow: shadow-sm with hover:shadow-md transition
- Internal structure:
  - Header row: Order number (left, bold, monospace) + Status badge (right)
  - Customer name: text-lg font-semibold, mb-2
  - Address: text-sm, mb-4, max 2 lines with text-ellipsis
  - Action buttons row: Flex layout with gap-2
  - Distance indicator: Small badge showing proximity to current location

**Order Status Badges:**
- Pill-shaped: px-3 py-1 rounded-full text-xs font-semibold
- States: Pending, In Route, Delivered, Cancelled
- Position: Absolute top-right of card

**Quick Action Buttons:**
- Primary: "Open in Waze" and "Open in Maps" buttons
- Icon + Text layout (icon left, text right with gap-2)
- Size: h-10 px-4 with text-sm
- Icons from Heroicons (map-pin, navigation)

### C. Import & Data Entry

**Import Interface:**
- Drag-and-drop zone: border-2 border-dashed, rounded-lg, min-h-40
- File upload button as alternative: Prominent, centered
- Accepted formats clearly listed: "CSV, Excel (.xlsx, .xls)"
- Progress indicator for bulk imports

**Manual Entry Form:**
- Single column layout with consistent spacing (space-y-6)
- Input groups with clear labels (text-sm font-medium mb-2)
- Input fields: h-12 px-4 rounded-lg border with focus states
- Grid layout for related fields: 2 columns on desktop (Order # + Customer Name)
- Address field: Larger textarea (h-24) for full address entry
- Auto-complete suggestions for addresses

### D. Map Integration

**Interactive Map Component:**
- Full height within section: h-full min-h-96
- Markers: Custom pins numbered by delivery sequence
- Cluster markers for grouped nearby orders (showing count)
- Route polyline overlay connecting delivery points
- Current location indicator (if geolocation enabled)
- Zoom controls: Positioned bottom-right with shadow

**Map Controls Panel:**
- Floating above map: Absolute positioning, top-4 left-4
- Quick filters: Toggle nearby orders, show/hide routes
- Compact design: px-4 py-3 rounded-lg with backdrop blur

### E. Route Optimization Panel

**Grouped Orders Section:**
- Accordion-style collapsible groups
- Group header shows: Area name + Order count + Total distance
- Expand to reveal: Ordered list of deliveries with sequence numbers
- "Optimize Route" button per group (runs algorithm)
- Drag-and-drop to manually reorder within groups

**Route Summary Card:**
- Sticky position at top of order list
- Shows: Total orders, total distance, estimated time
- Primary action: "Export All" button (prominent)
- Secondary actions: Print, Share route

### F. Export & Output

**Export Options Modal:**
- Center-screen overlay with backdrop
- Format selection: Radio buttons for CSV vs Excel
- Include options: Checkboxes (Include maps links, Include customer phones, etc.)
- Preview section showing first 3 rows
- Download button: Large, full-width at bottom

### G. Data Display Tables

**Order List Table (Alternative View):**
- Responsive: Cards on mobile, table on tablet+
- Columns: Order #, Customer, Address (truncated), Distance, Actions
- Row height: h-16 for comfortable touch targets
- Striped rows for easier scanning
- Sortable headers with arrow indicators
- Action column: Icon buttons only (compact)

---

## Interactive States & Feedback

**Loading States:**
- Skeleton screens for order cards (animated pulse)
- Spinner for map loading: Centered with text "Loading map..."
- Progress bars for file processing

**Empty States:**
- Illustration or icon (size: h-32 w-32)
- Clear message: "No orders yet" with suggestion
- Primary CTA: "Import Orders" or "Add Manual Order"

**Success/Error Notifications:**
- Toast notifications: Fixed top-right, slide-in animation
- Size: max-w-sm with p-4
- Icon + Message + Close button
- Auto-dismiss after 5 seconds

---

## Accessibility Implementation

- Keyboard navigation for all interactive elements (tab order logical)
- Focus indicators: Ring-2 offset-2 on focus for all inputs/buttons
- ARIA labels for icon-only buttons
- Screen reader announcements for route updates
- Minimum touch target size: 44x44px (h-11 w-11 minimum)
- Form validation with clear error messages below fields
- High contrast ratios maintained throughout

---

## Images

**No hero images required** - This is a utility application where speed and efficiency take priority over visual branding.

**Iconography:**
Use Heroicons (via CDN) exclusively:
- Navigation icons: map, list-bullet, cog-6-tooth
- Action icons: paper-airplane (Waze), map-pin (Maps), download, printer
- Status icons: check-circle, clock, x-circle
- UI icons: chevron-down, chevron-up, x-mark, bars-3

---

## Responsive Breakpoints

- Mobile: base (< 768px) - Single column, stacked layout
- Tablet: md (768px+) - Two columns where appropriate
- Desktop: lg (1024px+) - Split view (list + map side-by-side)
- Wide: xl (1280px+) - Three-column order grid option