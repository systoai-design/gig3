# GIG3 Brand Kit
## Complete Brand Guidelines & Visual Identity

---

## 1. Brand Overview

### Mission Statement
Empower creators and clients worldwide through secure, transparent, and decentralized freelance marketplace powered by Web3 technology.

### Vision
To become the leading Web3 freelance platform where trust is automated, payments are instant, and opportunities are borderless.

### Core Values
- **Trust Through Technology**: Smart contract escrow ensures secure transactions
- **Creator First**: Fair 5% platform fees, empowering freelancers
- **Transparency**: Blockchain-backed proof of work and reviews
- **Innovation**: Leveraging Solana for fast, low-cost transactions
- **Community**: Building a global network of talented creators

### Brand Personality
- **Professional** yet approachable
- **Tech-forward** but accessible
- **Trustworthy** and secure
- **Innovative** and forward-thinking
- **Empowering** for creators

---

## 2. Logo System

### Available Logo Variants

We have 6 logo files optimized for different use cases:

#### Primary Logos
- **`gig3_logo.png`** - Primary full-color logo (use on light backgrounds)
- **`gig3_logo_transparent.png`** - Logo with transparent background (versatile use)

#### Theme-Specific Logos
- **`gig3_logo_light.png`** - Light version (use on dark backgrounds)
- **`gig3_logo_dark.png`** - Dark version (use on light backgrounds)
- **`gig3_logo_dark_v2.png`** - Alternative dark version

#### Special Variants
- **`gig3_logo_6.png`** - Alternative variant for special applications

### Logo Usage Guidelines

#### Primary Usage
- Always use the primary logo (`gig3_logo.png`) on light backgrounds
- Use light logo variant on dark backgrounds for optimal contrast
- Maintain original aspect ratio - never stretch or distort

#### Clear Space
- Minimum clear space: Equal to the height of "3" in GIG3 on all sides
- No text, graphics, or other elements should enter this space

#### Minimum Size
- **Digital**: Minimum width of 120px
- **Print**: Minimum width of 1 inch (2.54cm)
- Below these sizes, legibility is compromised

#### Background Contrast
- Ensure sufficient contrast between logo and background
- Light logo on dark backgrounds (minimum contrast ratio 4.5:1)
- Dark logo on light backgrounds (minimum contrast ratio 4.5:1)

### What NOT to Do

❌ Do not change logo colors  
❌ Do not rotate or skew the logo  
❌ Do not add effects (shadows, glows, outlines)  
❌ Do not place on busy backgrounds that reduce legibility  
❌ Do not recreate or modify the logo  
❌ Do not use outdated logo versions  

---

## 3. Color Palette

### Primary Colors

#### GIG3 Blue (Brand Primary)
- **HSL**: `hsl(212, 100%, 48%)`
- **HEX**: `#0077FF`
- **RGB**: `rgb(0, 119, 255)`
- **Usage**: Primary CTAs, links, brand elements, accents
- **CSS Variable**: `--primary`

#### Dark Blue (Secondary)
- **HSL**: `hsl(200, 88%, 42%)`
- **HEX**: `#0D7DC1`
- **RGB**: `rgb(13, 125, 193)`
- **Usage**: Hover states, secondary buttons, depth
- **CSS Variable**: `--brand-blue-dark`

#### Bright Blue (Accent)
- **HSL**: `hsl(200, 100%, 55%)`
- **HEX**: `#1A9BFF`
- **RGB**: `rgb(26, 155, 255)`
- **Usage**: Highlights, active states, notifications
- **CSS Variable**: `--brand-blue-bright`

### Neutral Colors

#### GIG3 Black
- **HSL**: `hsl(0, 0%, 0%)`
- **HEX**: `#000000`
- **RGB**: `rgb(0, 0, 0)`
- **Usage**: Primary text, headers, high contrast elements
- **CSS Variable**: `--brand-black`

#### Dark Gray
- **HSL**: `hsl(0, 0%, 20%)`
- **HEX**: `#333333`
- **RGB**: `rgb(51, 51, 51)`
- **Usage**: Secondary text, subheadings
- **CSS Variable**: `--foreground`

#### Light Gray
- **HSL**: `hsl(0, 0%, 96%)`
- **HEX**: `#F5F5F5`
- **RGB**: `rgb(245, 245, 245)`
- **Usage**: Backgrounds, subtle borders, dividers
- **CSS Variable**: `--background`

### Accent Colors

#### Purple
- **HSL**: `hsl(250, 80%, 65%)`
- **HEX**: `#7B5CFF`
- **RGB**: `rgb(123, 92, 255)`
- **Usage**: Pro badges, premium features, special highlights
- **CSS Variable**: `--brand-purple`

#### Pink
- **HSL**: `hsl(280, 70%, 68%)`
- **HEX**: `#CD6FFF`
- **RGB**: `rgb(205, 111, 255)`
- **Usage**: Gradients, decorative elements, featured content
- **CSS Variable**: `--brand-pink`

#### Amber
- **HSL**: `hsl(45, 93%, 58%)`
- **HEX**: `#F5C439`
- **RGB**: `rgb(245, 196, 57)`
- **Usage**: Warnings, highlights, energy, attention
- **CSS Variable**: `--brand-amber`

#### Cyan
- **HSL**: `hsl(185, 95%, 55%)`
- **HEX**: `#0FE8D6`
- **RGB**: `rgb(15, 232, 214)`
- **Usage**: Success states, active indicators, Web3 elements
- **CSS Variable**: `--brand-cyan`

### Color Usage Guidelines

#### Hierarchy
1. **Primary (Blue)**: Main CTAs, primary actions, brand presence
2. **Neutral (Black/Gray)**: Text, backgrounds, structure
3. **Accent (Purple/Pink/Amber/Cyan)**: Highlights, special features, calls to attention

#### Accessibility
- All text meets WCAG 2.1 AA standards (minimum 4.5:1 contrast ratio)
- Large text (18pt+) meets WCAG AAA standards (7:1 contrast ratio)
- Color is never the only indicator of information

#### Dark Mode
- Background: `hsl(0, 0%, 0%)` (true black)
- Foreground: `hsl(0, 0%, 98%)` (near white)
- All accent colors remain consistent for brand recognition

---

## 4. Typography

### Font System

#### Primary Font Family
```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```
- Clean, modern system fonts
- Optimized for readability across all devices
- No web font loading required (performance optimized)

### Font Sizes & Hierarchy

#### Display Text (Hero Headlines)
- **display-xl**: 4.5rem (72px) - Major hero headlines
- **display-lg**: 3.75rem (60px) - Section heroes
- **display-md**: 3rem (48px) - Page titles
- **display-sm**: 2.25rem (36px) - Subsection titles

#### Heading Text
- **h1**: 2.5rem (40px) / font-weight: 700 (bold)
- **h2**: 2rem (32px) / font-weight: 700 (bold)
- **h3**: 1.5rem (24px) / font-weight: 600 (semi-bold)
- **h4**: 1.25rem (20px) / font-weight: 600 (semi-bold)

#### Body Text
- **body-lg**: 1.125rem (18px) / line-height: 1.75
- **body**: 1rem (16px) / line-height: 1.5
- **body-sm**: 0.875rem (14px) / line-height: 1.5
- **body-xs**: 0.75rem (12px) / line-height: 1.5

#### Special Text
- **button**: 1rem (16px) / font-weight: 500 / letter-spacing: 0.025em
- **label**: 0.875rem (14px) / font-weight: 500 / letter-spacing: 0.05em

### Line Height
- **Tight**: 1.25 (headings)
- **Normal**: 1.5 (body text)
- **Relaxed**: 1.75 (large body text, readability)

### Font Weights
- **Regular**: 400 (body text)
- **Medium**: 500 (buttons, labels)
- **Semi-bold**: 600 (subheadings)
- **Bold**: 700 (headings, emphasis)

---

## 5. Visual Elements

### Gradient System

#### Primary Gradient
```css
background: linear-gradient(135deg, hsl(212, 100%, 48%), hsl(200, 88%, 42%));
```
- **Usage**: Hero sections, primary CTAs, featured cards
- **CSS Class**: `.gradient-primary`

#### Vivid Gradient
```css
background: linear-gradient(135deg, hsl(250, 80%, 65%), hsl(280, 70%, 68%));
```
- **Usage**: Pro features, premium elements, special highlights
- **CSS Class**: `.gradient-vivid`

#### Warm Gradient
```css
background: linear-gradient(135deg, hsl(45, 93%, 58%), hsl(280, 70%, 68%));
```
- **Usage**: Success states, celebratory elements, energy
- **CSS Class**: `.gradient-warm`

#### Cool Gradient
```css
background: linear-gradient(135deg, hsl(185, 95%, 55%), hsl(212, 100%, 48%));
```
- **Usage**: Innovation, technology, Web3 elements
- **CSS Class**: `.gradient-cool`

#### Radial Gradient (Background)
```css
background: radial-gradient(circle at 20% 50%, rgba(123, 92, 255, 0.15), transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(15, 232, 214, 0.15), transparent 50%);
```
- **Usage**: Page backgrounds, hero sections, ambient lighting
- **CSS Class**: `.gradient-radial`

### Shadow System

#### Subtle Shadow
```css
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
```
- **Usage**: Cards, slight elevation

#### Medium Shadow
```css
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
```
- **Usage**: Hovering cards, modals, dropdowns

#### Large Shadow
```css
box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
```
- **Usage**: Floating elements, pop-ups, major emphasis

#### Glow Shadow (Interactive)
```css
box-shadow: 0 0 20px hsla(212, 100%, 48%, 0.3);
```
- **Usage**: Active states, focus states, CTAs

### Border Radius System

#### Rounded Design Philosophy
GIG3 uses generous rounded corners for a modern, friendly feel.

- **Default**: 35px (cards, buttons, major containers)
- **Medium**: 24px (smaller cards, inputs)
- **Small**: 16px (badges, tags)
- **Full**: 9999px (pills, avatar borders)

**CSS Variables:**
```css
--radius-default: 35px;
--radius-md: 24px;
--radius-sm: 16px;
--radius-full: 9999px;
```

---

## 6. Animation System

### Custom Animations

#### Gradient Animation
```css
@keyframes gradient {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
animation: gradient 8s ease infinite;
```
- **Usage**: Animated backgrounds, hero sections

#### Float Animation
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
animation: float 6s ease-in-out infinite;
```
- **Usage**: Floating shapes, decorative elements

#### Shimmer Animation
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
animation: shimmer 3s infinite linear;
```
- **Usage**: Loading states, skeleton screens, highlights

#### Blob Bounce
```css
@keyframes blob-bounce {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}
animation: blob-bounce 8s ease-in-out infinite;
```
- **Usage**: Decorative background blobs

### Transition Standards

#### Default Transition
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```
- **Easing**: Custom smooth curve for natural movement
- **Duration**: 300ms for most interactions

#### Quick Transition
```css
transition: all 0.15s ease;
```
- **Usage**: Subtle hover effects, small changes

#### Slow Transition
```css
transition: all 0.5s ease;
```
- **Usage**: Major layout changes, page transitions

---

## 7. Component Patterns

### Buttons

#### Primary Button
- **Background**: GIG3 Blue gradient
- **Text**: White, font-weight: 500
- **Border-radius**: 35px
- **Padding**: 12px 32px
- **Hover**: Slight scale (1.02), enhanced shadow
- **Active**: Scale (0.98)

#### Secondary Button
- **Background**: Transparent
- **Border**: 2px solid GIG3 Blue
- **Text**: GIG3 Blue, font-weight: 500
- **Border-radius**: 35px
- **Padding**: 12px 32px
- **Hover**: Background GIG3 Blue, text white

#### Ghost Button
- **Background**: Transparent
- **Text**: Foreground color
- **Border-radius**: 35px
- **Padding**: 12px 24px
- **Hover**: Subtle background (background/5)

### Cards

#### Standard Card
- **Background**: Background color or white
- **Border**: 1px solid border color
- **Border-radius**: 35px
- **Padding**: 24px
- **Shadow**: Subtle shadow
- **Hover**: Medium shadow, slight translate (-2px)

#### Glassmorphic Card
- **Background**: `rgba(255, 255, 255, 0.1)`
- **Backdrop-filter**: blur(12px)
- **Border**: 1px solid rgba(255, 255, 255, 0.2)
- **Border-radius**: 35px
- **Usage**: Hero overlays, floating UI

### Form Elements

#### Input Fields
- **Background**: Background color
- **Border**: 2px solid border color
- **Border-radius**: 24px
- **Padding**: 12px 16px
- **Focus**: Border color changes to primary
- **Font-size**: 1rem (16px)

#### Textarea
- Same styling as input fields
- **Min-height**: 120px
- **Resize**: vertical only

### Icons & Badges

#### Icons
- **Default size**: 20px × 20px
- **Large**: 24px × 24px
- **Library**: Lucide React
- **Stroke-width**: 2px
- **Color**: Inherits from parent or uses semantic colors

#### Badges
- **Border-radius**: 16px (small rounded)
- **Padding**: 4px 12px
- **Font-size**: 0.75rem (12px)
- **Font-weight**: 500
- **Colors**: Variant-based (primary, success, warning, destructive)

#### Pro Badge
- **Gradient**: Purple to pink gradient
- **Icon**: Sparkles or Zap
- **Animation**: Subtle shimmer effect
- **Text**: "PRO" in white, bold

---

## 8. Design Principles

### 1. Rounded Corner Philosophy
- **Default 35px radius**: Creates friendly, modern, approachable feel
- Consistent across all major UI elements
- Reinforces brand personality of being innovative yet welcoming

### 2. Blue-First Color Approach
- GIG3 Blue (`hsl(212, 100%, 48%)`) is the hero of every design
- Used strategically for:
  - Primary actions and CTAs
  - Navigation active states
  - Brand presence in headers/footers
  - Links and interactive elements

### 3. Smooth Transitions
- **Standard timing**: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- Creates perceived performance
- Reduces jarring changes
- Enhances user experience

### 4. Generous Whitespace
- Breathing room around elements
- Improves readability and comprehension
- Creates premium feel
- Guides user attention

### 5. Gradient Elevation
- Gradients indicate importance and interactivity
- Primary elements use blue gradients
- Premium features use purple/pink gradients
- Creates visual hierarchy without complexity

### 6. Animation with Purpose
- Animations guide attention, don't distract
- Loading states always have feedback
- Micro-interactions reward user actions
- Respect prefers-reduced-motion settings

### 7. Accessibility First
- WCAG 2.1 AA compliance minimum
- Color never sole indicator of information
- All interactive elements keyboard accessible
- Focus states clearly visible
- Alt text for all images
- Semantic HTML structure

### 8. Mobile-First Responsive
- Designs work beautifully from 320px to 4K
- Touch targets minimum 44px × 44px
- Readable text without zooming
- Optimized for thumb zones on mobile

---

## 9. Brand Applications

### Website
- Use primary logo in header (white version on dark header)
- Hero sections: Large display text + primary gradient backgrounds
- Cards: Rounded (35px), subtle shadows, hover animations
- CTAs: Primary blue gradient buttons with generous padding

### Social Media
- Profile images: Square version of logo on brand blue background
- Cover images: Use gradient backgrounds with logo and tagline
- Post graphics: Maintain 35px border radius, use brand colors
- Stories: Vertical format, bold typography, blue accent highlights

### Marketing Materials
- Presentations: Clean layouts, generous whitespace, blue accents
- One-pagers: Hero section with gradient, rounded cards for features
- Brochures: Professional photography, overlay gradients, readable typography

### Merchandise
- T-shirts: Large logo on chest, tagline on back optional
- Stickers: Die-cut logo with transparent background
- Business cards: Minimal design, logo + contact info, rounded corners (if possible)

---

## 10. File Organization

### Logo Files Location
```
src/assets/
├── gig3_logo.png              # Primary full-color
├── gig3_logo_transparent.png  # Transparent background
├── gig3_logo_light.png        # Light version
├── gig3_logo_dark.png         # Dark version
├── gig3_logo_dark_v2.png      # Alternative dark
└── gig3_logo_6.png            # Special variant
```

### Design System Files
```
src/
├── index.css                  # Global styles, animations, design tokens
└── tailwind.config.ts         # Tailwind configuration, colors, spacing
```

---

## 11. Brand Checklist

Before publishing any brand material, verify:

✅ Logo is properly sized and has clear space  
✅ Colors match exact HSL/HEX values  
✅ Typography follows hierarchy guidelines  
✅ Border radius is 35px for major elements  
✅ Transitions are smooth (0.3s cubic-bezier)  
✅ Contrast ratios meet accessibility standards  
✅ Responsive design works on mobile  
✅ Animations have purpose and respect motion preferences  
✅ All interactive elements are keyboard accessible  
✅ Brand voice is consistent with guidelines  

---

## Contact & Support

For brand guideline questions or asset requests:
- **Website**: [Your website URL]
- **Email**: brand@gig3.io
- **Design Team**: design@gig3.io

---

**Document Version**: 1.0  
**Last Updated**: 2025  
**Maintained By**: GIG3 Brand Team
