import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'pz22ntol',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: 'skFsVNJgys3k7mpt1Mfrsn3y82nmd0MjNUHcesigTIGEE8RPbOvYotyQPL0NGMKtUbgw867fqrqIvdFEER9Fcr920WUw7SUZ958v1Gb4y6N7l8gV6A3jJ8dIYrMXxdX6osCrN3R3hQPSLGhR7C3mkkCK9iyunAg7zC2lHGATFsVsAHpFVA08'
})

// Convert plain text to Sanity portable text blocks
function textToPortableText(text: string) {
  const lines = text.split('\n');
  const blocks = [];
  
  let currentBlock = '';
  let currentStyle = 'normal';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (trimmedLine === '') {
      // Empty line - finish current block if exists
      if (currentBlock) {
        blocks.push({
          _type: 'block',
          style: currentStyle,
          children: [{ _type: 'span', text: currentBlock }],
          markDefs: []
        });
        currentBlock = '';
        currentStyle = 'normal';
      }
    } else if (trimmedLine.startsWith('## ')) {
      // H2 heading
      if (currentBlock) {
        blocks.push({
          _type: 'block',
          style: currentStyle,
          children: [{ _type: 'span', text: currentBlock }],
          markDefs: []
        });
        currentBlock = '';
      }
      blocks.push({
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: trimmedLine.substring(3) }],
        markDefs: []
      });
      currentStyle = 'normal';
    } else if (trimmedLine.startsWith('# ')) {
      // H1 heading
      if (currentBlock) {
        blocks.push({
          _type: 'block',
          style: currentStyle,
          children: [{ _type: 'span', text: currentBlock }],
          markDefs: []
        });
        currentBlock = '';
      }
      blocks.push({
        _type: 'block',
        style: 'h1',
        children: [{ _type: 'span', text: trimmedLine.substring(2) }],
        markDefs: []
      });
      currentStyle = 'normal';
    } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
      // Bold text as a separate block
      if (currentBlock) {
        blocks.push({
          _type: 'block',
          style: currentStyle,
          children: [{ _type: 'span', text: currentBlock }],
          markDefs: []
        });
        currentBlock = '';
      }
      blocks.push({
        _type: 'block',
        style: 'normal',
        children: [{ 
          _type: 'span', 
          text: trimmedLine.slice(2, -2),
          marks: ['strong']
        }],
        markDefs: []
      });
      currentStyle = 'normal';
    } else {
      // Regular text - accumulate
      if (currentBlock) {
        currentBlock += ' ' + trimmedLine;
      } else {
        currentBlock = trimmedLine;
      }
    }
  }
  
  // Don't forget the last block
  if (currentBlock) {
    blocks.push({
      _type: 'block',
      style: currentStyle,
      children: [{ _type: 'span', text: currentBlock }],
      markDefs: []
    });
  }
  
  return blocks;
}

// Your existing 12 Flow Key articles
const LEGACY_CONTENT = [
  {
    id: 'tuned-emotions-essential',
    title: 'Tuned Emotions',
    description: 'Using your feelings as a compass to navigate into flow states and peak performance',
    content: `Your emotions are like compass needles—they always point toward something important.

Most people treat feelings as distractions to push through or problems to solve. But emotions are actually your brain's real-time feedback system, telling you whether you're in the flow channel or drifting out of it.

## The Emotional GPS System

Think of your emotions as a GPS for peak performance. When you're bored, you're cruising in the slow lane—time to add some challenge. When you're anxious, you're speeding toward a crash—time to slow down or get better tools.

The sweet spot? That place where you're slightly stretched but not snapping. Research shows this happens when tasks are about 4% harder than your current skill level. Your emotions are the warning system that keeps you in this goldilocks zone.

## How It Works

Your brain has an emotional control center that constantly monitors whether your challenge and skill levels match. When they're aligned, you get those good feelings—engagement, curiosity, energy. When they're mismatched, you get warning signals—boredom, anxiety, frustration.

Most people ignore these signals or fight them. Smart performers read them like instruments on a dashboard.

## What You'll Do

**Before You Start Working**
Take 30 seconds to check your emotional state. Feeling flat? You might need more challenge. Feeling wired? You might need to break things down or get more resources.

**During Work**
Notice when your emotions shift. Frustration usually means "make this easier or get help." Boredom means "add complexity or time pressure." 

**When You're Stuck**
Anxiety = break the task smaller or gather tools. Restlessness = add stakes, deadlines, or competition.

## What You'll Notice

**When It's Working:**
- Your feelings guide you toward better choices
- You bounce back from setbacks quickly
- You naturally know when to push and when to pause
- Emotions inform instead of overwhelm
- Focus feels effortless, not forced

**When It's Not:**
- Emotions feel random or disruptive
- You stay anxious or bored for long stretches
- Bad moods stick around and ruin the next task
- You can't find your optimal energy level
- You swing between overstimulation and understimulation

## Build This Skill

**Track Your Patterns**
Note which emotional states produce your best work in different activities. Build your personal performance database.

**Quick Check-ins**
Set a timer for every 20 minutes. Rate your current emotional state 1-10 and adjust if you're off track.

**Challenge Tuning**
When understimulated, add complexity. When overwhelmed, reduce scope or get support.

**Energy Tools**
Develop go-to methods to amp up (deadlines, stakes, music) or calm down (smaller steps, more preparation, lower pressure).

## Related Keys
Open Mind helps you read emotional signals clearly. Focused Body gives you the body awareness to feel emotions accurately. Intentional Space creates environments that support the right emotional states.`,
    tags: ['emotions', 'flow-navigation', 'emotional-intelligence', 'performance'],
    type: 'learn',
    dimension: 'self',
    key: 'tuned-emotions',
    is_pinned: true,
    pin_order: 1,
    created_date: '2024-12-19',
    read_time: 2,
    difficulty: 'Beginner'
  },
  // ... I'll continue with all 12 articles in the actual migration
];

async function migrateContent() {
  console.log('Starting migration to Sanity...');
  
  try {
    // First, let's check if we can connect to Sanity
    const datasets = await client.datasets.list();
    console.log('✅ Connected to Sanity successfully');
    
    for (const item of LEGACY_CONTENT) {
      console.log(`Migrating: ${item.title}`);
      
      // Convert content to portable text
      const portableTextContent = textToPortableText(item.content);
      
      // Create the document
      const doc = {
        _type: 'contentItem',
        _id: item.id,
        title: item.title,
        description: item.description,
        content: portableTextContent,
        tags: item.tags,
        type: item.type,
        dimension: item.dimension,
        key: item.key,
        difficulty: item.difficulty,
        readTime: item.read_time,
        isPinned: item.is_pinned,
        pinOrder: item.pin_order,
        createdDate: item.created_date
      };
      
      // Upload to Sanity
      await client.createOrReplace(doc);
      console.log(`✅ Migrated: ${item.title}`);
    }
    
    console.log('🎉 Migration completed successfully!');
    console.log(`📊 Migrated ${LEGACY_CONTENT.length} articles`);
    console.log('🔧 You can now start Sanity Studio with: npm run sanity:dev');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateContent();