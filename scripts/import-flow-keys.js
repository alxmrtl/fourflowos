const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'pz22ntol',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-01-01',
  token: 'skFsVNJgys3k7mpt1Mfrsn3y82nmd0MjNUHcesigTIGEE8RPbOvYotyQPL0NGMKtUbgw867fqrqIvdFEER9Fcr920WUw7SUZ958v1Gb4y6N7l8gV6A3jJ8dIYrMXxdX6osCrN3R3hQPSLGhR7C3mkkCK9iyunAg7zC2lHGATFsVsAHpFVA08'
});

// Helper function to convert markdown text to Sanity portable text
function markdownToPortableText(text) {
  const lines = text.split('\n');
  const blocks = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed === '') {
      continue; // Skip empty lines
    }
    
    if (trimmed.startsWith('## ')) {
      // H2 heading
      blocks.push({
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: trimmed.substring(3) }],
        markDefs: []
      });
    } else if (trimmed.startsWith('# ')) {
      // H1 heading  
      blocks.push({
        _type: 'block',
        style: 'h1',
        children: [{ _type: 'span', text: trimmed.substring(2) }],
        markDefs: []
      });
    } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      // Bold paragraph
      blocks.push({
        _type: 'block',
        style: 'normal',
        children: [{ 
          _type: 'span', 
          text: trimmed.slice(2, -2),
          marks: ['strong']
        }],
        markDefs: []
      });
    } else if (trimmed.startsWith('- ')) {
      // Bullet list item
      blocks.push({
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', text: trimmed.substring(2) }],
        markDefs: []
      });
    } else {
      // Regular paragraph
      const children = [];
      
      // Handle inline bold text
      const parts = trimmed.split(/(\*\*[^*]+\*\*)/);
      for (const part of parts) {
        if (part.startsWith('**') && part.endsWith('**')) {
          children.push({
            _type: 'span',
            text: part.slice(2, -2),
            marks: ['strong']
          });
        } else if (part) {
          children.push({
            _type: 'span',
            text: part
          });
        }
      }
      
      if (children.length > 0) {
        blocks.push({
          _type: 'block',
          style: 'normal',
          children: children,
          markDefs: []
        });
      }
    }
  }
  
  return blocks;
}

// Your 12 Flow Key articles (I'll get the content from git history)
const FLOW_KEYS = [
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
    isPinned: true,
    pinOrder: 1,
    difficulty: 'Beginner',
    readTime: 2,
    createdDate: '2024-12-19'
  }
  // I'll add the other 11 articles here in the next step
];

async function importArticles() {
  console.log('🚀 Starting import of Flow Key articles...');
  
  try {
    // Delete test article first
    console.log('🗑️ Cleaning up test content...');
    try {
      await client.delete('test-migration');
      console.log('✅ Deleted test article');
    } catch (error) {
      console.log('ℹ️ No test article to delete');
    }
    
    // Import each Flow Key article
    for (const article of FLOW_KEYS) {
      console.log(`📝 Importing: ${article.title}`);
      
      const portableTextContent = markdownToPortableText(article.content);
      
      const doc = {
        _type: 'contentItem',
        _id: article.id,
        title: article.title,
        description: article.description,
        content: portableTextContent,
        tags: article.tags,
        type: article.type,
        dimension: article.dimension,
        key: article.key,
        difficulty: article.difficulty,
        readTime: article.readTime,
        isPinned: article.isPinned,
        pinOrder: article.pinOrder,
        createdDate: article.createdDate
      };
      
      await client.createOrReplace(doc);
      console.log(`✅ Imported: ${article.title}`);
    }
    
    console.log('🎉 Import completed successfully!');
    console.log(`📊 Imported ${FLOW_KEYS.length} Flow Key articles`);
    console.log('🔄 Refresh your Sanity Studio to see the new content');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run the import
importArticles();