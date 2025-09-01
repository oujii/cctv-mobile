# Vigilance Mobile App Development Plan

## Project Overview
Mock security camera mobile app for TV/film production. Built with Next.js 15.5.0, React 19, TypeScript, and TailwindCSS.

## Completed Features

### User State Management (Dashboard)
- **4-state user system** with tap cycling
- State 1: Adam (You) Online, Carl (Admin) Offline
- State 2: Both Adam (You) and Carl (Admin) Online  
- State 3: Carl (You) Online, Adam (Guest) Offline
- State 4: Both Carl (You) and Adam (Guest) Online
- **Interactive**: Tap either user to cycle through states
- **Files modified**: `app/dashboard/page.tsx`

### Camera System Enhancements
- **6 camera feeds** total (up from 2)
- **Mixed height variants**: 3 full height, 3 short height
- **3-state interaction system**:
  - Short → Full → Focused → Short (cycle)
  - Full → Focused → Short → Full (cycle)
- **Focus mode**: Dimmed background + enlarged view
- **Camera IDs**: Professional format (ADC6-10-M022, JBS-AF-1080P, etc.)
- **Model standardization**: All cameras show "PAN 2500 HD"
- **Gray camera**: First camera (ADC6-10-M022) shows solid gray `#808080` for post-production
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
1. **ADC6-10-M022** (full height, gray background)
2. **JBS-AF-1080P** (full height, video)
3. **OFC-B3-720P** (short height, video)
4. **WSP-C4-1080P** (short height, video)
5. **FRT-D5-4K** (full height, video)
6. **EXT-E6-1080P** (short height, video)

### Video Files Location
- **Path**: `public/` directory
- **Current files**: `/0823.mp4`, `/0824.mp4`
- **Rotation**: Videos rotate between cameras based on camera ID
- **To update**: Modify `getVideoSource()` in `components/CameraFeed.tsx:48-51`

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
- User states (4 configurations)
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
*Last updated: 2025-08-26*