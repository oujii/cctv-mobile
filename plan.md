# Vigilance Mobile App Development Plan

## Project Overview
Mock security camera mobile app for TV/film production. Built with Next.js 15.5.0, React 19, TypeScript, and TailwindCSS.

## Completed Features

### User State Management (Dashboard)
- **Simplified 2-function user system** for easier filming
- **Function 1 - Name tap**: Switches active user "(You)" between Adam and Carl
  - Adam (You - Guest) ↔ Carl (You - Admin)
  - "(You)" is always Online
- **Function 2 - Plus icon tap**: Toggles other user's online status
  - If Adam is "(You)": Carl (Admin) toggles Online/Offline
  - If Carl is "(You)": Adam (Guest) toggles Online/Offline
- **Roles preserved**: Carl = Admin, Adam = Guest
- **Files modified**: `app/dashboard/page.tsx`

### Camera System Enhancements
- **9 camera feeds** total (up from 6)
- **Mixed height variants**: 4 full height, 5 short height
- **3-state interaction system**:
  - Short → Full → Focused → Short (cycle)
  - Full → Focused → Short → Full (cycle)
- **Focus mode**: Dimmed background + enlarged view
- **Camera IDs**: Professional format (ADC6-10-M022, JBS-AF-1080P, etc.)
- **Model standardization**: All cameras show "PAN 2500 HD"
- **Optimized grain effect**: Tile-based rendering for better performance
- **Files modified**: `app/dashboard/page.tsx`, `components/CameraFeed.tsx`

### Dashboard Updates
- **Camera stats**: Changed to 14/14 active cameras
- **Home name**: Changed from "Wander001 home" to "CW001 home"
- **Interactive elements**: Users and cameras both clickable

### Invitation Screen Improvements
- **Removed auto-redirect**: No longer redirects after 2 seconds
- **Manual progression**: "Continue" button to proceed
- **Professional styling**: Outline button style instead of solid
- **Smooth transition**: 300ms delay with loading state
- **Carl as inviter**: Shows Carl's avatar with "Has granted you access"
- **Updated text**: References "CW001 home" instead of "Wander001"
- **Files modified**: `app/login/page.tsx`

## Camera Configuration

### Current Cameras
1. **ADC6-10-M022** (full height, video)
2. **BDH4-15-S081** (full height, green `#093` background in day+green mode)
3. **CDK2-08-X104** (short height, green `#093` background in day+green mode)
4. **DFL7-22-Y045** (short height, video)
5. **EGM9-31-Z067** (full height, green `#093` background in night+green mode)
6. **FHN3-17-A129** (short height, black.mp4 in night modes)
7. **GJP5-26-B088** (short height, video)
8. **HKQ8-13-C156** (full height, video)
9. **ILR1-29-D093** (short height, video)

### Video Files Location
- **Path**: `public/` directory
- **Day videos**: `d-hall.mp4`, `d-hiss.mp4`, `d-kok.mp4`, `d-matsal.mp4`, `d-pool.mp4`, `d-sovrum.mp4`, `d-spa.mp4`, `d-ute.mp4`, `d-vardagsrum.mp4`
- **Night videos**: `n1.mp4`, `n2.mp4`, `n3.mp4`, `n4.mp4`, `n5.mp4`, `n6.mp4`, `n7.mp4`, `n8.mp4`, `black.mp4`
- **Rotation**: Videos rotate between cameras based on camera ID
- **To update**: Modify `getVideoSource()` in `components/CameraFeed.tsx`

### Hidden Video State System
- **4-state toggle system** accessed via settings icon (cogwheel) in bottom navigation
- **State 1 "day-videos"**: Day video feeds, no green screen
- **State 2 "day-videos + green"**: Day videos with green `#093` background on cameras 2&3 (d-kok, d-matsal)
- **State 3 "night-videos"**: Night video feeds, no green screen
- **State 4 "night-videos + green"**: Night videos with green `#093` background on camera 5
- **Hidden toggle**: No visual indicator of current state, cycles through all 4 states on settings icon click
- **Files modified**: `app/dashboard/page.tsx`, `components/CameraFeed.tsx`

### Notification System
- **Service Worker registered** for cross-platform notification support
- **Trigger**: Click Events icon (second icon from left) in bottom navigation
- **Delay**: 5 second delay before notification appears
- **Message**: "Carl (owner) started watching"
- **Android support**: Uses `registration.showNotification()` API for Android Chrome PWA compatibility
- **iOS support**: Fallback to `new Notification()` for browsers without service worker
- **Visual feedback**: Icon, badge, and vibration pattern included
- **Files modified**: `app/dashboard/page.tsx`, `public/sw.js` (added)

## Navigation & Authentication
- **Logout**: Click VIGILANCE logo in dashboard to return to invitation screen
- **Login flow**: Invitation → Continue → Sign In → Dashboard
- **Authentication**: Uses localStorage for session management

## Technical Architecture

### Key Files
- `app/dashboard/page.tsx` - Main dashboard with users and cameras
- `app/login/page.tsx` - Invitation and login screens
- `components/CameraFeed.tsx` - Camera feed component with interactions
- `app/layout.tsx` - Root layout
- `public/` - Video and image assets

### State Management
- User states (2-function system: active user + other user online status)
- Video states (4 configurations: day/night with/without green)
- Camera expansion states (short/full/focused)
- Focused camera tracking
- Authentication state

## Design System
- **Colors**: Dark theme with blue accents (`#101828`, `#1D2939`)
- **Fonts**: Geist Sans via next/font/google
- **Interactive feedback**: Hover/active states, smooth transitions
- **Professional styling**: Security app aesthetic

## Future Considerations
- Video file management system
- Additional camera states/views
- User role permissions
- Real-time camera status updates

---
*Last updated: 2025-09-10*