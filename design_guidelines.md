# Azerbaijan Mountain Tourism Application - Design Guidelines

## Design Approach

**Reference-Based Strategy**: Drawing inspiration from premium travel platforms (Airbnb, Booking.com) combined with adventure tourism sites, adapted for Azerbaijan's unique cultural heritage and mountain tourism focus.

**Core Principle**: Create an immersive, culturally-rich experience that balances wanderlust inspiration with practical trip planning, while gamifying the climbing journey through regional achievements.

---

## Typography System

**Font Families** (via Google Fonts):
- **Display/Headlines**: Montserrat (Bold 700, SemiBold 600) - strong, modern, adventure-ready
- **Body/UI**: Inter (Regular 400, Medium 500, SemiBold 600) - excellent readability
- **Accents**: Playfair Display (for cultural/heritage sections) - elegant, adds sophistication

**Scale**:
- Hero Headlines: text-5xl lg:text-7xl (60-72px desktop)
- Section Titles: text-3xl lg:text-4xl (36-48px)
- Card Titles: text-xl lg:text-2xl (20-24px)
- Body: text-base lg:text-lg (16-18px)
- Small/Meta: text-sm (14px)

---

## Layout System

**Spacing Units**: Tailwind units of **4, 6, 8, 12, 16, 20** for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: py-16 lg:py-24
- Card gaps: gap-6 lg:gap-8
- Container max-width: max-w-7xl

**Grid Strategy**:
- Trip Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Achievement Badges: grid-cols-2 md:grid-cols-3 lg:grid-cols-6
- Feature Highlights: grid-cols-1 md:grid-cols-2
- Reviews: grid-cols-1 lg:grid-cols-2

---

## Component Library

### Navigation
- Sticky header with transparent-to-solid transition on scroll
- Logo left, primary navigation center, CTA (Login/Profile) right
- Mobile: Hamburger menu with slide-in drawer
- Include quick stats in header (e.g., "500+ Adventures Completed")

### Hero Section
**Layout**: Full-width immersive hero (h-screen or min-h-[600px])
- Large background image: Dramatic Azerbaijan mountain landscape (Caucasus peaks)
- Overlay gradient for text readability
- Centered content: Main headline + subheadline + dual CTAs ("Explore Trips" + "View Achievements")
- Floating stats cards at bottom (trips completed, active climbers, regions explored)
- **Buttons on images**: Implement backdrop-blur-sm with semi-transparent backgrounds

### Trip Cards
- Image-first design (aspect-ratio-4/3)
- Difficulty badge overlay (color-coded: green/yellow/orange/red)
- Content: Title, location pin icon + region, duration, difficulty level
- Hover: Subtle lift (transform scale) + shadow intensification
- Quick stats row: elevation gain, distance, group size

### Achievement Badge System
- Hexagonal or shield-shaped containers for regional symbols
- Each badge shows: Symbol icon, region name, progress bar (if locked), completion date (if earned)
- Locked state: Grayscale with lock icon overlay
- Earned state: Full vibrant display with subtle glow effect
- Badge categories clearly labeled (Karabakh Horse, Nakhchivan Fortress, etc.)

### User Dashboard
- Profile header: Avatar + name + total climbing level (with progress bar to next level)
- Stats grid (4 columns): Trips Completed, Total Elevation, Days Climbing, Regions Explored
- Achievement showcase: Recently earned badges carousel
- Upcoming trips timeline
- Personal records section

### Review/Feedback Cards
- User avatar + name + climbing level badge
- Star rating system (5-star)
- Trip name + date completed
- Review text (max-w-prose for readability)
- Helpful vote buttons
- Image gallery option (2-4 photos per review)

### About Us Page
- Mission statement with full-width image backdrop
- Team section (if applicable): 3-column grid with photos
- Azerbaijan heritage highlight: 2-column layout (text + cultural images)
- Regional symbols explanation with icon showcase

### Forms
- Contact/Booking forms: 2-column layout (form + info sidebar with office hours, contact methods)
- Input fields: Rounded corners (rounded-lg), clear labels, helper text
- Primary action buttons: Prominent, full-width on mobile

### Footer
- Rich footer with 4-column grid: About, Destinations, Resources, Connect
- Newsletter signup section
- Social media icons (Heroicons or Font Awesome)
- Trust indicators: "Verified trips" + "Local guides" + "Safe climbing practices"

---

## Images

**Hero Section**: 
- Full-width landscape photo of Azerbaijan's Caucasus Mountains at golden hour, showing dramatic peaks and valleys. Should inspire adventure while showcasing natural beauty.

**Trip Cards**: 
- Each trip card features a high-quality photo of the specific mountain/trail, preferably with climbers/hikers for scale and aspiration.

**Regional Achievement Badges**:
- Custom illustrated icons for each symbol (Golden Horse, Ancient Fortress, Carpet Pattern, Silk Road Caravan, Mountain Peak, Petroglyphs) - can be sourced from icon libraries or described for designer

**About Us**: 
- Cultural images: Traditional Azerbaijan carpet patterns, historical landmarks, mountain villages
- Team photos (if applicable): Authentic portraits in mountain settings

**Reviews**: 
- User-submitted photos from completed trips

---

## Interactions

**Minimal Animation Approach**:
- Subtle fade-in on scroll for section reveals
- Smooth transition on badge unlock (brief scale + glow effect)
- Card hover states: transform scale-105 + shadow enhancement
- Hero CTA buttons: Gentle scale on hover
- Progress bar fills: Smooth width transitions

**No Distracting Effects**: Avoid parallax, excessive scroll-triggered animations, or auto-playing content

---

## Icon Library

**Primary**: Heroicons (via CDN)
- Navigation, UI controls, social media icons
- Trip amenities (backpack, compass, camera, etc.)
- Achievement indicators (lock, checkmark, star)

---

## Accessibility

- Minimum contrast ratios maintained (will be verified with final palette)
- Focus states visible on all interactive elements (ring-2 ring-offset-2)
- Semantic HTML structure throughout
- Alt text for all images (especially achievement badges and trip photos)
- Keyboard navigation fully supported
- ARIA labels for icon-only buttons

---

This design creates a culturally-rich, gamified mountain tourism experience that celebrates Azerbaijan's heritage while providing practical trip planning and inspiring adventure through achievement unlocks.