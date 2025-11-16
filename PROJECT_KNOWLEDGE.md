# GIG3 Platform - Project Knowledge Base

## Project Overview

GIG3 is a Web3-powered freelance marketplace built on Solana blockchain, enabling secure peer-to-peer transactions between creators and clients through smart contract escrow.

### Core Technology Stack
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system (HSL tokens)
- **Animation**: Framer Motion
- **Blockchain**: Solana Web3.js, Wallet Adapter
- **Backend**: Lovable Cloud (Supabase)
- **Smart Contract**: Anchor Framework (Rust)
- **State Management**: React Query, React Context

---

## Authentication & User Management

### Authentication Methods
1. **Email/Password Authentication**
   - Standard signup with email verification (auto-confirm enabled)
   - Secure password-based login
   - Session persistence via localStorage

2. **Wallet-Based Authentication**
   - Solana wallet connection (Phantom, Solflare, etc.)
   - Message signing for verification
   - Wallet address linked to user profile
   - No password required for wallet users

### Multi-Step Onboarding Flow
Located in: `src/components/AuthDialog.tsx`

**Steps:**
1. **CONNECT_WALLET**: User connects Solana wallet
2. **SIGN_MESSAGE**: User signs message to verify ownership
3. **PROFILE_SETUP**: New users complete name/username (existing users auto-sign-in)
4. **COMPLETE**: Success confirmation with auto-redirect

**Key Features:**
- Visual progress indicators
- Animated transitions between steps
- Error handling for wallet rejections
- Automatic step advancement
- Form validation with Zod schemas

### User Roles
Managed via `user_roles` table with enum: `buyer | seller | admin`

- **Buyer**: Default role, can purchase gigs, leave reviews
- **Seller**: Can create gigs, manage orders, receive payments
- **Admin**: Full platform management, dispute resolution

### Profile System
Two-tier profile structure:

1. **Base Profile** (`profiles` table)
   - username, name, bio, tagline
   - avatar_url, banner_url
   - location, languages
   - social_links (JSON)
   - wallet_address

2. **Seller Profile** (`seller_profiles` table)
   - skills, portfolio_links
   - portfolio_items, certifications, education (JSON)
   - verified status, pro_member status
   - completion_rate, response_time_hours
   - languages_proficiency (JSON)

---

## Gig Management System

### Gig Structure
Located in: `gigs` table

**Core Fields:**
- title, description, category
- price_sol (base price in SOL)
- delivery_days
- images (array of URLs)
- status: `draft | active | paused | deleted`
- has_packages (boolean)
- packages (JSON array)
- is_pro_only (requires Pro membership)
- view_count, order_count (analytics)

### Package System
Gigs can offer multiple pricing tiers:
```json
[
  {
    "name": "Basic",
    "price": 0.5,
    "deliveryDays": 3,
    "features": ["Feature 1", "Feature 2"]
  },
  {
    "name": "Standard",
    "price": 1.0,
    "deliveryDays": 5,
    "features": ["All Basic", "Feature 3"]
  }
]
```

### Gig Lifecycle
1. **Draft**: Creator writes gig details
2. **Active**: Published and discoverable
3. **Paused**: Temporarily unavailable
4. **Deleted**: Soft-deleted, not shown

### Categories
Predefined categories for gig classification:
- Graphic Design
- Digital Marketing
- Writing & Translation
- Video & Animation
- Music & Audio
- Programming & Tech
- Business
- Lifestyle

---

## Order & Escrow System

### Order Lifecycle States
Enum: `order_status`

1. **pending**: Order created, awaiting payment confirmation
2. **in_progress**: Payment confirmed, seller working
3. **awaiting_proof**: Seller must submit proof of work
4. **proof_submitted**: Buyer must review proof
5. **delivered**: Buyer approved, escrow ready to release
6. **completed**: Escrow released, order finalized
7. **cancelled**: Order cancelled
8. **disputed**: Dispute raised, admin intervention needed
9. **approved_for_release**: Admin approved escrow release

### Order Fields
Key tracking fields:
- `expected_delivery_date`: Calculated from delivery_days
- `platform_fee_sol`: 5% of order amount
- `proof_description`: Seller's delivery notes
- `proof_files`: Array of delivery file URLs
- `revision_requested`: Boolean flag
- `revision_notes`: Buyer's revision feedback
- `escrow_account`: Solana PDA address
- `escrow_released`: Boolean flag
- `transaction_signature`: Solana transaction hash

### Proof Submission Workflow
Located in: `src/components/ProofUpload.tsx` & `ProofReview.tsx`

**Seller Side (ProofUpload):**
1. Upload proof files to `review-proofs` storage bucket
2. Add description of completed work
3. Submit proof → status changes to `proof_submitted`
4. Can resubmit if revision requested

**Buyer Side (ProofReview):**
1. Review submitted proof files and description
2. Options:
   - **Approve**: Triggers escrow release process
   - **Request Revision**: Provides feedback, seller resubmits

### Escrow Smart Contract
Located in: `solana-program/programs/gig3-escrow/`

**Contract Operations:**
- `initialize`: Create escrow PDA, lock buyer funds
- `release`: Transfer funds to seller (95%) and platform (5%)
- `refund`: Return funds to buyer (dispute resolution)

**Key Features:**
- PDA-based escrow accounts
- Admin whitelist for dispute handling
- Platform fee enforcement (500 basis points = 5%)
- Automatic fund distribution

**Program ID**: Set in `Anchor.toml` (devnet: GIG3EscrowProgramIDChangeBeforeDeployment11111)

### Edge Functions
Payment processing handled via Supabase Edge Functions:

1. **create-order**: Initialize order, calculate fees
2. **approve-delivery**: Release escrow to seller + platform
3. **handle-dispute**: Admin dispute resolution
4. **release-escrow**: Execute Solana escrow release transaction
5. **auto-complete-orders**: Cron job for deadline enforcement
6. **check-delivery-deadlines**: Notify about approaching deadlines

---

## Messaging System

### Message Structure
Located in: `messages` table

**Fields:**
- sender_id, receiver_id
- content (text)
- attachments (array of file URLs)
- order_id (optional, links to order)
- read_at (timestamp)
- edited_at (timestamp)

**Storage:**
- Files stored in `message-attachments` bucket
- Public read access for participants

**Notifications:**
- Automatic notification on new message
- Database trigger: `notify_new_message()`

### Real-time Messaging
Uses Supabase Realtime for instant message delivery:
```typescript
const channel = supabase
  .channel('messages')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'messages'
  }, handleMessageUpdate)
  .subscribe()
```

---

## Review & Rating System

### Review Structure
Located in: `reviews` table

**Fields:**
- order_id (one review per order)
- reviewer_id (buyer)
- reviewee_id (seller)
- rating (1-5 stars)
- comment (text)
- proof_urls (array of screenshot/proof URLs)

**Rules:**
- Only buyers can leave reviews
- One review per completed order
- Reviews are public and permanent
- Average rating calculated in real-time

**Components:**
- `ReviewDialog.tsx`: Modal for submitting reviews
- `ReviewList.tsx`: Display reviews on profiles

---

## Subscription & Pro Membership

### Subscription Plans
Enum: `free | pro`

**Pro Benefits:**
- Pro badge on profile
- Access to pro-only gigs
- Enhanced visibility
- Priority support

### Subscription Tracking
Tables: `subscriptions`, `subscription_payments`

**Status States:**
- `pending`: Awaiting payment
- `active`: Currently subscribed
- `cancelled`: User cancelled, expires at period end
- `expired`: No longer active

**Automatic Updates:**
- Database trigger `update_pro_status()` syncs `seller_profiles.pro_member`
- Edge function `check-expired-subscriptions` handles expirations

---

## Shopping Cart & Favorites

### Cart System
Located in: `cart_items` table

**Features:**
- Multi-item cart support
- Package selection tracking
- Quantity management
- Automatic cart update timestamps

**Hook:** `src/hooks/useCart.tsx`
- Add/remove items
- Update quantities
- Clear cart on checkout

### Favorites/Wishlist
Located in: `favorites` table

**Features:**
- Save gigs for later
- Quick access to favorite creators
- One-click favorite toggle

**Hook:** `src/hooks/useFavorites.tsx`

---

## Analytics & Tracking

### Gig Analytics
Located in: `gig_analytics` table

**Event Types:**
- `view`: Gig page viewed
- `click`: Gig clicked from search/browse
- `order`: Gig purchased

**Usage:**
- Sellers can view their gig performance
- Admins can see platform-wide analytics
- Real-time view/order count updates

### Profile Badges
Located in: `profile_badges` table

**Badge Types:**
- `early_adopter`: Early platform users
- `top_seller`: High-performing sellers
- `verified`: Verified creators
- `pro_member`: Active Pro subscribers

---

## File Storage Architecture

### Storage Buckets
All buckets are public with appropriate RLS policies:

1. **gig-images**: Gig cover images and galleries
2. **profile-media**: User avatars and banners
3. **review-proofs**: Proof files for reviews
4. **message-attachments**: Files sent in messages

### Upload Pattern
```typescript
const { data, error } = await supabase.storage
  .from('bucket-name')
  .upload(`${userId}/${filename}`, file)

const publicUrl = supabase.storage
  .from('bucket-name')
  .getPublicUrl(data.path)
```

---

## Security & RLS Policies

### Authentication Requirement
Most tables require authentication except:
- Public read access to active gigs
- Public read access to profiles
- Public read access to reviews

### Key RLS Patterns

**User-Owned Data:**
```sql
-- Users can only modify their own data
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id)
```

**Role-Based Access:**
```sql
-- Sellers can create gigs
WITH CHECK (
  auth.uid() = seller_id AND 
  has_role(auth.uid(), 'seller'::app_role)
)
```

**Order Participants:**
```sql
-- Buyers and sellers can view their orders
USING (
  auth.uid() = buyer_id OR 
  auth.uid() = seller_id OR 
  has_role(auth.uid(), 'admin'::app_role)
)
```

---

## UI/UX Components

### Design System
Located in: `src/index.css`, `tailwind.config.ts`

**Color System:**
- All colors use HSL semantic tokens
- Dark/Light mode support
- Consistent color palette via CSS variables
- Example: `bg-primary`, `text-foreground`, `border-border`

### Animation Components
Located in: `src/components/animations/`

**Available Animations:**
- `FloatingShapes`: Background decorative elements
- `ScrollReveal`: Fade/slide in on scroll
- `StaggerContainer`: Sequential child animations
- `ParallaxCard`: 3D hover effects
- `MarqueeCarousel`: Infinite scrolling testimonials
- `TextReveal`: Animated text reveals
- `HoverTilt`: Interactive card tilting
- `MagneticButton`: Mouse-following button effect

### Reusable UI Components
Located in: `src/components/ui/`

**Shadcn Components:**
- All components use consistent variants
- Customized for GIG3 design system
- Includes: Button, Card, Dialog, Input, Tabs, etc.

---

## Database Triggers & Functions

### Automatic Timestamp Updates
```sql
-- Function: update_updated_at_column()
-- Triggers on: profiles, gigs, orders, subscriptions
```

### Order Status Automation
```sql
-- Function: update_order_timestamps()
-- Sets: payment_confirmed_at, delivered_at, completed_at
```

### Expected Delivery Calculation
```sql
-- Function: set_expected_delivery()
-- Calculates: expected_delivery_date, platform_fee_sol
```

### Gig Statistics
```sql
-- Function: increment_gig_order_count()
-- Updates: gigs.order_count on new order
```

### New User Setup
```sql
-- Function: handle_new_user()
-- Creates: profile + assigns buyer role
-- Trigger: on auth.users insert
```

---

## Navigation & Routing

### Main Routes
- `/` - Landing page
- `/auth` - Authentication page (legacy, now using AuthDialog popup)
- `/explore` - Browse gigs
- `/gig/:id` - Gig detail page
- `/profile/:username` - User profile
- `/messages` - Messaging inbox
- `/cart` - Shopping cart
- `/checkout` - Checkout flow
- `/favorites` - Saved gigs

### Creator Routes
- `/become-creator` - Creator onboarding
- `/create-gig` - Create new gig
- `/edit-gig/:id` - Edit existing gig
- `/creator-dashboard` - Seller dashboard

### Buyer Routes
- `/buyer-dashboard` - Order management
- `/order/:id` - Order detail

### Admin Routes
- `/admin-dashboard` - Platform administration

### Protected Routes
Component: `src/components/ProtectedRoute.tsx`
- Checks authentication status
- Redirects to home if unauthenticated
- Preserves return URL

---

## Custom Hooks

### Authentication
- `useAuth()`: Access auth context (user, session, signIn, signOut)
- `useCreatorRegistration()`: Handle creator signup flow
- `useSignOut()`: Safe sign-out with cleanup

### Wallet
- `useWalletMonitor()`: Track wallet connection/disconnection
- `useWalletRegistrationCache()`: Cache wallet registration checks

### UI State
- `useCart()`: Shopping cart management
- `useFavorites()`: Wishlist management
- `useNotifications()`: Notification system
- `useProStatus()`: Check Pro membership status
- `useProfileBadges()`: Fetch user badges
- `useScrollProgress()`: Track page scroll position

---

## Edge Function Architecture

### Function List
Located in: `supabase/functions/`

1. **create-order**: Order initialization
2. **approve-delivery**: Escrow release trigger
3. **release-escrow**: Solana transaction execution
4. **release-escrow-payment**: Payment distribution
5. **handle-dispute**: Admin dispute handling
6. **release-dispute-funds**: Dispute resolution payouts
7. **manage-subscription**: Pro subscription management
8. **check-expired-subscriptions**: Cron job for expirations
9. **check-delivery-deadlines**: Deadline notifications
10. **auto-complete-orders**: Auto-complete overdue orders

### Common Patterns
```typescript
// CORS headers (required for web access)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Supabase client with service role
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)
```

---

## Environment Variables

### Frontend (.env)
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Public anon key
- `VITE_SUPABASE_PROJECT_ID`: Project identifier

### Edge Functions (Secrets)
- `SUPABASE_URL`: Backend URL
- `SUPABASE_ANON_KEY`: Public key
- `SUPABASE_SERVICE_ROLE_KEY`: Admin key
- `SUPABASE_DB_URL`: Direct database connection
- `ESCROW_WALLET_PRIVATE_KEY`: Platform wallet for escrow operations

---

## Deployment & Build

### Frontend Deployment
- Automatic preview builds on code changes
- Production deployment via "Publish" button
- Custom domain support available

### Edge Functions Deployment
- Automatic deployment on code push
- No manual deployment needed
- View logs in Lovable Cloud backend

### Solana Program Deployment
Located in: `solana-program/`

**Build & Deploy:**
```bash
cd solana-program
anchor build
anchor deploy --provider.cluster devnet
```

**Important:** Update program ID in:
- `solana-program/Anchor.toml`
- `solana-program/programs/gig3-escrow/src/lib.rs`
- `src/lib/solana/escrow.ts`

---

## Testing Checklist

### Order Flow Testing
- [ ] Create order → funds held in escrow PDA
- [ ] Submit proof → buyer can review
- [ ] Approve delivery → escrow releases to seller
- [ ] Request revision → seller resubmits
- [ ] Dispute → admin can refund/release

### Authentication Testing
- [ ] Email signup → profile created
- [ ] Email login → session persists
- [ ] Wallet connect → signature prompt
- [ ] Wallet signup → onboarding flow
- [ ] Wallet login → auto sign-in

### Payment Testing (Devnet)
- [ ] Buyer has devnet SOL
- [ ] Order payment deducts SOL
- [ ] Escrow holds correct amount
- [ ] Release splits 95%/5% correctly
- [ ] Transaction signatures logged

---

## Known Limitations & Future Work

### Current Limitations
1. Solana program not deployed to mainnet (devnet only)
2. No direct program integration in order flow (requires manual deployment)
3. Email confirmation disabled (auto-confirm for development)
4. No real-time order status updates (requires manual refresh)

### Planned Enhancements (per MAINNET_MIGRATION_PLAN.md)
1. Deploy escrow program to mainnet
2. Integrate `initializeEscrow()` in order creation
3. Integrate `releaseEscrow()` in delivery approval
4. Integrate `refundEscrow()` in dispute handling
5. Professional security audit before mainnet launch

---

## Support & Resources

### Documentation
- Implementation Guide: `IMPLEMENTATION_GUIDE.md`
- Mainnet Plan: `MAINNET_MIGRATION_PLAN.md`
- Solana Program: `solana-program/README.md`

### Key Files for New Developers
1. `src/contexts/AuthContext.tsx` - Authentication logic
2. `src/components/AuthDialog.tsx` - Onboarding flow
3. `src/pages/OrderDetail.tsx` - Order management UI
4. `src/lib/solana/escrow.ts` - Solana integration
5. `supabase/functions/approve-delivery/index.ts` - Payment flow

### Common Issues & Solutions
**Issue**: Wallet not connecting
- **Solution**: Check wallet browser extension installed and unlocked

**Issue**: Order stuck in pending
- **Solution**: Confirm transaction signature in database

**Issue**: Escrow release failing
- **Solution**: Verify program deployed and program ID matches

**Issue**: RLS policy error
- **Solution**: Check user has correct role assigned in `user_roles`
