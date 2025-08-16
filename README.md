# FourFlowOS - Interactive Web Application

## Project Overview

FourFlowOS is an interactive web application that embodies the FourFlow framework - a holistic approach to achieving flow states through the systematic integration of Self, Space, Story, and Spirit dimensions. The application serves as both a practical navigation tool for personal development and a sophisticated expression of the integrated four-dimensional approach to flow states.

## Framework Philosophy

**Mission**: Awakening millions through flow, guiding individuals to find their unique role in life's greater synchronicity.

**Transformation Goal**: Moving professionals from overwhelm, apathy, and disconnection to clarity, engagement, and meaningful success through a systematic approach to flow states.

**Core Belief**: When individuals operate in their optimal flow states across Self, Space, Story, and Spirit, they naturally align with meaningful work and create positive impact in the world.

**User Transformation Journey**: From overwhelm → clarity, apathy → engagement, stagnation → growth, resistance → flow, fragmented → whole.

## The Four Dimensions Framework

### 🟠 SELF (Coral #FF6F61) - Flow Keys #1-3
**Dimension Description**: "Develop unshakeable focus and presence by integrating physical, mental, and emotional intelligence."

- **FLOW KEY #1 - Tuned Emotions**: Use your feelings as signals to stay in the sweet spot between bored and overwhelmed.
- **FLOW KEY #2 - Open Mind**: Clear mental clutter and stay flexible so new ideas can flow naturally.
- **FLOW KEY #3 - Focused Body**: Get out of your head and into your body to stop overthinking and stay present.

### 🟢 SPACE (Sage Green #6BA292) - Flow Keys #4-6
**Dimension Description**: "Build spaces and systems that multiply your leverage while removing distractions."

- **FLOW KEY #4 - Intentional Space**: Set up your environment to automatically put you in focus mode without willpower.
- **FLOW KEY #5 - Optimized Tools**: Use the right systems and tech to get more done with less effort.
- **FLOW KEY #6 - Feedback Systems**: Build quick ways to know if you're on track and course-correct fast.

### 🔵 STORY (Steel Blue #5B84B1) - Flow Keys #7-9
**Dimension Description**: "Transform your sense of purpose into a driving force for excellence and fulfillment."

- **FLOW KEY #7 - Generative Story**: Create a personal narrative that makes challenges feel like adventure, not problems.
- **FLOW KEY #8 - Worthy Mission**: Connect your daily work to something bigger that naturally motivates you.
- **FLOW KEY #9 - Empowered Role**: Know what you own and why it matters so you can work with real purpose.

### 🟣 SPIRIT (Amethyst #7A4DA4) - Flow Keys #10-12
**Dimension Description**: "Access unlimited energy and direction through aligned values, wonder, and vision."

- **FLOW KEY #10 - Grounding Values**: Know what you stand for so decisions become obvious and doubt disappears.
- **FLOW KEY #11 - Visualized Vision**: See your future clearly so your brain starts noticing the right opportunities.
- **FLOW KEY #12 - Ignited Curiosity**: Stay genuinely interested in your work so focus happens without forcing it.

## Application Architecture

### Navigation Hierarchy
1. **Framework Page** (Entry Point) → **Dimension Pages** → **Key Pages**
2. **Direct Key Access**: Users can navigate directly from Framework Page to any specific Key
3. **Bottom Navigation**: Persistent access to Framework (Home), Self, Space, Story, Spirit
4. **Top Menu**: Global access to About, Blog, and Contact sections

### Page Structure

#### Framework Page (`/`)
- Entry point with 4 dimension blocks
- Direct access to all 12 flow keys
- Central hub for navigation

#### Dimension Pages (`/dimension/[dimension]`)
- Compact header with dimension branding
- Overview of 3 keys per dimension
- Benefit-driven descriptions
- Brand color integration

#### Key Pages (`/dimension/[dimension]/key/[key]`)
- Deep dive into individual flow keys
- Learn/Practice content organization
- Tagged content feeds

### Design System

#### Brand Colors
- **SELF**: Coral `#FF6F61`
- **SPACE**: Sage Green `#6BA292`
- **STORY**: Steel Blue `#5B84B1`
- **SPIRIT**: Amethyst `#7A4DA4`

#### Typography Hierarchy
- **Dimension Labels**: `text-xs font-bold uppercase tracking-wider` in brand color
- **Key Numbers**: `FLOW KEY #N` in brand color, small caps
- **Key Names**: `text-base font-bold text-gray-900`
- **Descriptions**: `text-xs text-gray-600`

#### Component Spacing
- **Dimension Header**: Compact with minimal white space
- **Key Sections**: Reduced padding (`p-3`) and gaps (`gap-2`)
- **Icons**: Smaller sizes (`w-10 h-10` for keys, `w-12 h-12` for dimensions)

## Technical Implementation

### Technology Stack
- **Frontend**: Next.js 14+ with React
- **Styling**: Tailwind CSS with custom brand color system
- **Deployment**: Vercel (auto-deploy from main branch)
- **Repository**: Git with submodule structure

### File Structure
```
src/
├── app/
│   ├── page.tsx                    # Framework landing page
│   ├── dimension/[dimension]/
│   │   ├── page.tsx               # Dimension overview
│   │   └── key/[key]/page.tsx     # Individual key pages
│   ├── about/page.tsx
│   ├── blog/page.tsx
│   └── contact/page.tsx
├── components/
│   ├── pages/
│   │   ├── DimensionPage.tsx      # Main dimension page component
│   │   ├── FrameworkPage.tsx      # Landing page component
│   │   └── KeyPage.tsx            # Individual key component
│   └── navigation/
│       ├── BottomNav.tsx          # Main navigation bar
│       ├── MenuButton.tsx         # Hamburger menu
│       └── TopContextBar.tsx      # Contextual navigation
├── data/
│   ├── framework.ts               # Dimension and key definitions
│   └── content.ts                 # Content management
└── types/
    └── framework.ts               # TypeScript interfaces
```

### Key Components

#### DimensionPage.tsx
**Location**: `src/components/pages/DimensionPage.tsx`

**Key Features**:
- Dynamic dimension branding with brand colors
- Compact header layout with dimension labels
- Flow key numbering system (#1-12)
- Emoji-free, clean design
- Responsive key sections that fit on screen

**Important Functions**:
- `getDimensionDescription()`: Returns benefit-driven dimension descriptions
- `getKeyDisplayInfo()`: Returns key data with numbering and descriptions

#### Data Structure (framework.ts)
**Location**: `src/data/framework.ts`

**Key Data**:
- `DIMENSIONS`: Contains brand colors, logos, and basic info
- `KEYS`: Individual key definitions with icons and descriptions
- Automatic key population for each dimension

### Content Management

#### Copy Strategy
- **Benefit-Driven**: All descriptions focus on practical outcomes
- **Down-to-Earth**: Relatable language, no jargon
- **Flow-Focused**: Every description connects to flow state benefits
- **Concise**: Short, actionable descriptions

#### Brand Integration
- Consistent use of brand colors across all components
- Systematic numbering for all 12 flow keys
- Clean typography hierarchy
- Minimal, professional design aesthetic

## Development Workflow

### Making Content Changes

1. **Dimension Descriptions**: Update in `DimensionPage.tsx` → `getDimensionDescription()`
2. **Key Descriptions**: Update in `DimensionPage.tsx` → `getKeyDisplayInfo()`
3. **Brand Colors**: Defined in `framework.ts` → `DIMENSIONS`
4. **Key Numbering**: Automatic based on order (SELF: 1-3, SPACE: 4-6, etc.)

### Deployment Process

1. **Local Development**: `npm run dev`
2. **Commit Changes**: Git commit with descriptive message
3. **Push to Repository**: `git push origin main`
4. **Auto-Deploy**: Vercel automatically deploys from main branch
5. **Verification**: Check live site for updates

### Testing URLs
- **Local**: `http://localhost:3000`
- **Production**: Deployed via Vercel
- **Dimension Pages**: `/dimension/self`, `/dimension/space`, `/dimension/story`, `/dimension/spirit`

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/alxmrtl/fourflowos.git
cd fourflowos/fourflowos-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

## Content Reference

### Source Material
- **REFERENCES Folder**: Contains comprehensive framework documentation
- **Philosophy.md**: Core framework principles
- **Dimension Folders**: Detailed explanations for each dimension and key
- **Brand Assets**: Located in `/public/assets/LOGOS/`

### Copy Principles
1. **Simplicity**: Use clear, everyday language
2. **Benefits**: Focus on what users gain, not features
3. **Action**: Include practical next steps
4. **Flow**: Always connect back to flow state benefits
5. **Brevity**: Keep descriptions concise and scannable

## Future Development

### Planned Features
- Blog/content management system
- User accounts and progress tracking
- Interactive flow assessments
- Community features

### Architecture Considerations
- Component-based design for easy updates
- Centralized data management in framework.ts
- Brand color system for consistent theming
- Responsive design for all devices

### Maintenance Notes
- Brand colors are centrally managed
- Key numbering is automatic and consistent
- Content updates should maintain benefit-driven focus
- Always test on both local and production environments

---

*Last Updated: August 2025*  
*Project Status: Active Development - Interactive Web Application*  
*Repository: https://github.com/alxmrtl/fourflowos*