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
- **9 camera feeds** total (up from 6)
- **Mixed height variants**: 4 full height, 5 short height
- **3-state interaction system**:
  - Short → Full → Focused → Short (cycle)
  - Full → Focused → Short → Full (cycle)
- **Focus mode**: Dimmed background + enlarged view
- **Camera IDs**: Professional format (ADC6-10-M022, JBS-AF-1080P, etc.)
- **Model standardization**: All cameras show "PAN 2500 HD"
- **Green camera**: First camera (ADC6-10-M022) shows solid green `#093` for greenscreen post-production
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
1. **ADC6-10-M022** (full height, green `#093` background for greenscreen in night+green mode)
2. **BDH4-15-S081** (full height, video)
3. **CDK2-08-X104** (short height, video)
4. **DFL7-22-Y045** (short height, video)
5. **EGM9-31-Z067** (full height, video)
6. **FHN3-17-A129** (short height, video)
7. **GJP5-26-B088** (short height, video)
8. **HKQ8-13-C156** (full height, video)
9. **ILR1-29-D093** (short height, video)

### Video Files Location
- **Path**: `public/` directory
- **Current files**: `/0823.mp4`, `/0824.mp4`
- **Rotation**: Videos rotate between cameras based on camera ID
- **To update**: Modify `getVideoSource()` in `components/CameraFeed.tsx:48-51`

### Hidden Video State System
- **3-state toggle system** accessed via settings icon (cogwheel) in bottom navigation
- **State 1 "day-videos"**: Normal video feeds, no green screen
- **State 2 "night-videos"**: Alternative video set (currently same videos)
- **State 3 "night-videos + green"**: Same as State 2 but with green `#093` background on first camera
- **Hidden toggle**: No visual indicator of current state, cycles through states on settings icon click
- **Files modified**: `app/dashboard/page.tsx`, `components/CameraFeed.tsx`

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