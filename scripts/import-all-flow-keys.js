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
      blocks.push({
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: trimmed.substring(3) }],
        markDefs: []
      });
    } else if (trimmed.startsWith('# ')) {
      blocks.push({
        _type: 'block',
        style: 'h1',
        children: [{ _type: 'span', text: trimmed.substring(2) }],
        markDefs: []
      });
    } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
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
      blocks.push({
        _type: 'block',
        style: 'normal',
        listItem: 'bullet',
        children: [{ _type: 'span', text: trimmed.substring(2) }],
        markDefs: []
      });
    } else {
      // Regular paragraph - handle inline bold text
      const children = [];
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

// All 12 Flow Key articles
const ALL_FLOW_KEYS = [
  // Flow Key 2: Focused Body
  {
    id: 'focused-body-essential',
    title: 'Focused Body',
    description: 'Your body as an anchor that keeps your attention steady and your energy flowing',
    content: `Your mind follows your body more than you think.

Ever notice how hunched shoulders make you feel stressed? Or how deep breathing naturally calms your thoughts? Your body isn't just carrying your brain around—it's actively shaping how well that brain can focus.

## Your Physical Foundation

Think of your body like the foundation of a house. If it's solid and stable, everything built on top works better. If it's shaky or tense, even simple mental tasks become harder.

Most people try to force their minds to focus while their bodies are sending distress signals—tight jaw, shallow breathing, cramped posture. It's like trying to write while someone's shaking your desk.

## How It Works

Your brain has a constant conversation with your body through something called the vagus nerve. When your body feels safe and stable, it sends "all clear" signals that free up mental resources for deep work. When your body is uncomfortable or tense, it sends "something's wrong" signals that hijack your attention.

Research shows that people who can accurately sense their body's signals—heart rate, muscle tension, breathing—have better focus and emotional control. Your body wisdom is actually measurable brain power.

## What You'll Do

**Set Your Foundation**
Find a posture you can hold comfortably for long periods. Think stable, not rigid. Your spine should stack naturally without forcing it straight.

**Breathe With Your Work**
Match your breathing to what you're doing. Slow, deep breaths for thinking tasks. Moderate rhythm for routine work. Quick, energizing breaths when you need activation.

**Scan and Release**
Every 20 minutes, do a quick body scan. Tight shoulders? Drop them. Clenched jaw? Let it soften. Holding tension burns mental fuel.

**Move Smartly**
Add tiny movements that help without hurting focus. Roll your shoulders, flex your fingers, adjust your feet. Keep blood flowing without breaking concentration.

## What You'll Notice

**When It's Working:**
- You stay comfortable without thinking about it
- Breathing supports your work instead of fighting it
- Long focus sessions energize rather than drain you
- Body sensations guide you instead of distract you  
- You settle into natural stillness without forcing it

**When It's Not:**
- Constant fidgeting and position changes
- Breathing gets shallow when you concentrate
- Neck, shoulders, or jaw lock up regularly
- You feel exhausted after mental work
- You feel "stuck in your head" and disconnected

## Build This Skill

**Foundation Practice**
Spend time finding and maintaining good posture. Build the core strength to hold it without effort.

**Breathing Training**
Practice different breathing patterns for different types of work. Learn to use your breath as an attention anchor.

**Tension Release**
Daily practice scanning your body and releasing tight spots. Build awareness of where you hold stress.

**Sensory Awareness**
Regular exercises focusing on what you can feel—temperature, texture, pressure. Sharpen your body's feedback system.

## Related Keys
Tuned Emotions needs body awareness to read emotional signals clearly. Open Mind works better when physical tension isn't creating mental static. Intentional Space includes the ergonomic setup that supports your physical foundation.`,
    tags: ['embodiment', 'body-awareness', 'attention', 'physical-foundation'],
    type: 'learn',
    dimension: 'self',
    key: 'focused-body',
    isPinned: true,
    pinOrder: 2,
    difficulty: 'Beginner',
    readTime: 2,
    createdDate: '2024-12-19'
  },

  // Flow Key 3: Open Mind
  {
    id: 'open-mind-essential',
    title: 'Open Mind',
    description: 'Mental flexibility that lets you adapt quickly and see solutions others miss',
    content: `Your mind is like a river—when it flows freely, it finds ways around any obstacle.

But most of us live with minds more like dammed-up ponds, stuck in familiar patterns and old ways of thinking. We approach new problems with old solutions and wonder why we keep getting the same results.

## Mental Freedom vs. Mental Prison

An open mind doesn't mean believing everything or having no opinions. It means staying curious enough to see what you're missing. It's the difference between saying "That won't work" and "How might that work?"

When your mind gets rigid, you miss opportunities, ignore feedback, and keep banging your head against walls. When it stays flexible, you adapt quickly, learn from failures, and find creative solutions.

## How It Works

Your brain has two modes: executive control (focused, planned thinking) and network thinking (loose, connected, creative). Flow happens when executive control relaxes its grip and lets network thinking take over.

But if your mind is stuck in rigid patterns—fixed beliefs, automatic reactions, habitual approaches—it can't make this shift. Open mind practices specifically target the mental rigidity that blocks flow.

## What You'll Do

**Question Your Assumptions**
Every day, pick one thing you're sure about and ask "What if the opposite were true?" Or "What am I not seeing here?" Get comfortable with not knowing.

**Try Different Angles**
When you're stuck on a problem, force yourself to see it from three different perspectives. What would a child see? An expert in a different field? Someone from another culture?

**Delay Solutions**
When facing a challenge, resist your first answer. Sit with the problem longer than feels comfortable. Better solutions often come after the obvious ones.

**Reframe Failures**
When something doesn't work, ask "What did this teach me?" instead of "Why did I screw up?" Treat setbacks as data, not disasters.

## What You'll Notice

**When It's Working:**
- You stay curious when things get uncertain
- You pivot quickly when your first approach isn't working
- You genuinely wonder about different ways to do things
- Failures teach you instead of defeat you
- You can hold multiple ideas at once without stress

**When It's Not:**
- You stick to plans even when they're clearly not working
- You get defensive when someone challenges your ideas
- Problems look the same no matter how you approach them
- You rush to find "the answer" instead of exploring options
- Uncertainty and complexity frustrate you

## Build This Skill

**Challenge Yourself Daily**
Pick one belief or assumption you hold and spend 10 minutes researching evidence against it. Build intellectual humility.

**Vary Your Methods**
Do routine tasks differently. Take a new route to work. Use different tools. Try unfamiliar approaches.

**Get Comfortable With Confusion**
Practice making decisions with incomplete information. Start small and build your tolerance for not knowing.

**Fresh Eyes Practice**
Look at familiar things like you've never seen them before. What would you notice? What questions would you ask?

## Related Keys
Tuned Emotions gives you the emotional flexibility to handle mental uncertainty. Ignited Curiosity provides the drive to explore new possibilities. Grounding Values creates a stable foundation that makes mental flexibility feel safe.`,
    tags: ['mental-flexibility', 'adaptability', 'problem-solving', 'creativity'],
    type: 'learn',
    dimension: 'self',
    key: 'open-mind',
    isPinned: true,
    pinOrder: 3,
    difficulty: 'Beginner',
    readTime: 2,
    createdDate: '2024-12-19'
  },

  // Flow Key 4: Intentional Space
  {
    id: 'intentional-space-essential',
    title: 'Intentional Space',
    description: 'Your environment as a flow amplifier - removing friction and creating the perfect conditions for deep work',
    content: `Your environment is working against you or for you—there's no neutral.

Every cluttered surface, every uncomfortable chair, every time you have to hunt for the right tool is stealing a little bit of your focus. But when you design your space intentionally, it becomes like having a personal assistant that anticipates your every need.

## Your Space Shapes Your Mind

Think of your workspace like the track for a race car. A smooth, well-designed track lets the car perform at its peak. A bumpy track with obstacles forces the driver to slow down and navigate around problems.

Most people try to achieve flow while working in spaces designed for everything except deep work. They wonder why focus feels so hard when their environment is constantly interrupting them.

## How It Works

Your brain has only so much attention to give. Every time you have to adjust your chair, search for a pen, or squint at a poorly lit screen, you're spending mental energy on logistics instead of your actual work.

Research shows that visual clutter alone can increase stress hormones and make it harder to process information. When your space is clean, organized, and designed for your specific work, your brain can dedicate all its resources to the task at hand.

## What You'll Do

**Remove the Friction**
Walk through your workspace and notice every tiny interruption. The pen that doesn't work. The chair that makes you fidget. The lighting that forces you to squint. Fix or eliminate each one.

**Control Your Senses**
Get lighting that supports your circadian rhythm and doesn't strain your eyes. Control noise with headphones or sound masking. Keep temperature in the 65-68°F range where your brain performs best.

**Make It Clean and Clear**
Remove visual clutter that fragments your attention. Use clean lines, neutral colors, and strategic empty space. Add one or two inspiring elements, but don't overload the visual field.

**Position Your Tools**
Put everything you need regularly within arm's reach. Set up your screen at eye level. Make sure your keyboard and mouse feel natural. Create dedicated spots for different types of work.

## What You'll Notice

**When It's Working:**
- You can start working immediately without setup time
- Physical comfort maintains itself throughout long sessions
- The space feels calm and supports your thinking
- Tools appear exactly where you need them
- Your environment enhances rather than fights your work flow

**When It's Not:**
- Constant adjustments to lighting, seating, or temperature
- Physical discomfort that builds up and breaks concentration  
- Visual or sound distractions that pull your attention away
- Time wasted looking for tools or dealing with environmental problems
- Feeling restless or unsettled in your workspace

## Build This Skill

**Audit Your Environment**
Spend a week tracking every time your workspace interrupts your focus. Notice patterns in what breaks your concentration.

**Optimize Step by Step**
Make one improvement at a time and test it during real work sessions. Don't redesign everything at once—evolve your space gradually.

**Fine-Tune Your Senses**
Experiment with different lighting, sound, and temperature conditions. Find your personal optimal settings for different types of work.

**Map Your Workflow**
Notice how you move and what tools you reach for during typical work. Arrange everything to minimize disruption to your flow.

## Related Keys
Focused Body needs ergonomic support from your space design. Tuned Emotions benefits when your environment supports the right emotional states. Optimized Tools requires intentional space to organize your productivity systems effectively.`,
    tags: ['workspace', 'environment', 'focus-design', 'productivity-setup'],
    type: 'learn',
    dimension: 'space',
    key: 'intentional-space',
    isPinned: true,
    pinOrder: 4,
    difficulty: 'Beginner',
    readTime: 2,
    createdDate: '2024-12-19'
  },

  // Flow Key 5: Optimized Tools
  {
    id: 'optimized-tools-essential',
    title: 'Optimized Tools',
    description: 'The right tools configured right - extending your capabilities without getting in your way',
    content: `The best tools disappear while you work.

Think about a master craftsman with a well-worn hammer—they're not thinking about the tool, they're thinking about the work. The hammer becomes an extension of their intention. That's what optimized tools do: they amplify your capability while staying invisible.

## Tools That Get Out of Your Way

Most people collect tools like trophies, then spend more time managing their tools than doing their actual work. They have seventeen apps that do similar things and wonder why everything feels complicated.

The goal isn't to have the most tools or the fanciest tools. The goal is to have the right tools, configured perfectly for how you actually work, that let you focus entirely on what you're creating.

## How It Works

Your brain has limited working memory—roughly seven pieces of information at once. Every time you have to figure out which button to press, remember a keyboard shortcut, or wait for something to load, you're using precious mental resources that should go to your real work.

Well-chosen tools handle the routine stuff automatically so your brain can focus on the creative, strategic, and analytical work that only you can do. They become transparent extensions of your thinking.

## What You'll Do

**Match Tools to Tasks**
Choose tools built specifically for your type of work. A notes app designed for writers works differently than one designed for project managers. Use the right tool for each job.

**Automate the Repetitive**
Identify any task you do more than five times and look for ways to automate or template it. If you write similar emails, create templates. If you follow the same process, build a checklist or workflow.

**Customize Your Interface**
Hide features you don't use and highlight ones you do. Create shortcuts for your most common actions. Make your tools work the way your brain works.

**Make Tools Talk to Each Other**
Set up your tools so information flows between them without manual copying and pasting. Output from one tool becomes input for the next automatically.

## What You'll Notice

**When It's Working:**
- Tools respond instantly and predictably
- You spend minimal time learning or configuring things
- Routine tasks happen automatically in the background
- Moving between tools feels seamless
- Your tools enhance rather than limit your creativity

**When It's Not:**
- Constant troubleshooting and fighting with tools
- More time spent setting up tools than using them productively
- Manual work that should be automatic
- Friction when switching between tools
- Tools that constrain what you can create or accomplish

## Build This Skill

**Audit Your Tool Stack**
List every tool you use and rate how well it serves your primary work. Eliminate redundancies and identify gaps or friction points.

**Map Your Workflow**
Document your ideal work process from start to finish. Notice where current tools help or hurt the natural flow.

**Optimize Gradually**
Make one improvement at a time. Test changes during real work to make sure they actually help instead of just looking good in theory.

**Invest in Learning**
Spend time getting genuinely good with your essential tools. Learn the advanced features that provide the highest leverage for your specific work.

## Related Keys
Intentional Space provides the physical organization that supports your optimized tool setup. Feedback Systems often integrate with tools to give you performance data. Focused Body benefits from ergonomically designed tools that don't create physical strain.`,
    tags: ['productivity-tools', 'workflow-optimization', 'automation', 'systems'],
    type: 'learn',
    dimension: 'space',
    key: 'optimized-tools',
    isPinned: true,
    pinOrder: 5,
    difficulty: 'Beginner',
    readTime: 2,
    createdDate: '2024-12-19'
  },

  // Flow Key 6: Feedback Systems
  {
    id: 'feedback-systems-essential',
    title: 'Feedback Systems',
    description: 'Real-time signals that tell you if you\'re winning - keeping you engaged and on track',
    content: `Without feedback, you're flying blind.

Imagine playing a video game where the score never updates and you can't tell if you're winning or losing. You'd lose interest fast. Yet most people work in exactly this situation—no clear signals about progress, quality, or direction.

## Your Progress Dashboard

Your brain is wired to seek feedback like a plant seeks sunlight. When you can see progress happening, your motivation system kicks into high gear and generates the energy to keep going. When progress is invisible, your brain assumes nothing is working and starts looking for something else to do.

The key is creating feedback loops that are immediate, relevant, and motivating. Not overwhelming data dumps, but clear signals that tell you "yes, you're on the right track" or "time to adjust."

## How It Works

Your brain's reward system runs on something called prediction error—the difference between what you expect and what actually happens. When you get feedback that shows progress, your brain releases dopamine, which creates the feeling of "I want to keep doing this."

Without feedback, there's no prediction error, no dopamine, and no sustained motivation. That's why people can lose steam on important projects that don't give clear progress signals.

## What You'll Do

**Make Progress Visible**
Create ways to see advancement in real-time. Completion bars, checklists, visual progress indicators, or simple tallies. If you can't see it moving, you'll assume it's not working.

**Track Quality, Not Just Quantity**
Measure what actually matters. Words written might matter less than ideas clarified. Hours spent might matter less than problems solved. Focus on outcomes, not just activity.

**Create Early Warning Systems**
Set up signals that tell you when you're drifting off course before you've wasted too much time. Energy dropping? Attention wandering? Quality declining? Catch it early.

**Celebrate Wins**
Build in recognition for meaningful milestones. Your brain needs periodic confirmation that the effort is paying off. Small celebrations maintain momentum through difficult phases.

## What You'll Notice

**When It's Working:**
- Clear sense of progress and direction during work
- Quick awareness when quality or focus changes
- Natural motivation to continue toward visible goals
- Easy identification of what's working vs. what needs adjustment
- Sustained engagement even during challenging parts

**When It's Not:**
- Uncertainty about whether your approach is effective
- Motivation fades without visible progress
- Hard to maintain focus without clear objectives
- Late recognition of performance problems or improvements
- Feeling disconnected from meaningful results

## Build This Skill

**Design Your Metrics**
Identify 2-3 key indicators that actually correlate with success in your work. Focus on things you can measure frequently and act on quickly.

**Speed Up Your Feedback**
The faster you get feedback, the better. Immediate is ideal, daily is good, weekly is the minimum for maintaining flow.

**Calibrate Your Signals**
Some people need frequent small confirmations. Others prefer less frequent but more significant milestones. Find what motivates you.

**Automate When Possible**
Build feedback collection into your existing tools and workflows. The less extra effort required to get feedback, the more likely you'll use it.

## Related Keys
Tuned Emotions uses your feelings as internal feedback about performance. Optimized Tools can provide automated feedback collection and display. Visualized Vision creates the meaning framework that makes feedback feel rewarding.`,
    tags: ['feedback', 'progress-tracking', 'performance-measurement', 'motivation'],
    type: 'learn',
    dimension: 'space',
    key: 'feedback-systems',
    isPinned: true,
    pinOrder: 6,
    difficulty: 'Beginner',
    readTime: 2,
    createdDate: '2024-12-19'
  },

  // Flow Key 7: Grounding Values
  {
    id: 'grounding-values-essential',
    title: 'Grounding Values',
    description: 'Your inner compass - the core principles that keep you steady and motivated when everything else shifts',
    content: `Your values are like a mountain in a storm—everything else might shift, but they remain steady.

Most people know what they're supposed to value (success, family, health), but they've never actually identified what they genuinely care about deep down. When work gets hard or goals feel distant, they have nothing solid to stand on.

## Your Inner North Star

Values aren't just nice-to-have ideals you put on your wall. They're the internal guidance system that tells you which opportunities to say yes to, which sacrifices are worth making, and why you should keep going when motivation runs dry.

When your actions align with your real values, work feels energizing instead of draining. When they don't align, everything feels like pushing a boulder uphill.

## How It Works

Your brain has two motivation systems: external (rewards and punishments) and internal (meaning and purpose). External motivation works for a while, but it always runs out. Internal motivation—the kind that comes from living your values—is renewable and sustainable.

Research shows that people working on values-aligned activities show higher engagement, lower stress, and better performance. Your values literally change your brain chemistry, making difficult work feel more doable.

## What You'll Do

**Identify Your Real Values**
Ignore what you think you should care about and dig into what actually energizes you. Think about times when you felt most alive and engaged—what values were you honoring?

**Test for Alignment**
Look at your current activities and goals. Which ones align with your core values and which ones conflict? The misaligned ones are probably draining your energy.

**Use Values as Your Filter**
When facing decisions, big or small, ask: "Which choice better honors my core values?" Let your principles guide your priorities.

**Connect Daily Work to Deep Purpose**
Find explicit links between routine tasks and your underlying values. Even mundane work can feel meaningful when you can see the connection.

## What You'll Notice

**When It's Working:**
- Natural motivation for activities that align with your principles
- Clear decision-making criteria when facing uncertainty
- Sustained energy for challenging work when purpose is clear
- Feeling authentic and integrated in your daily actions
- Resilience during setbacks because your "why" remains strong

**When It's Not:**
- Hard to maintain motivation without external pressure
- Decision paralysis when facing multiple options
- Feeling disconnected from meaning in daily work
- Internal conflict between what you do and what you believe
- Easy to abandon goals when obstacles appear

## Build This Skill

**Do the Values Work**
Complete exercises to identify your authentic core values, not the ones you inherited or think you should have. What genuinely matters to you?

**Audit Your Life**
Review your current commitments, activities, and goals for values alignment. Where are the biggest matches and mismatches?

**Practice Integration**
Consciously connect daily tasks to underlying values. Create explicit bridges between routine work and meaningful outcomes.

**Build Your Decision Framework**
Develop a clear process for using values in choices. When uncertain, let your principles be your guide.

## Related Keys
Worthy Mission provides specific expression of your values through purposeful action. Ignited Curiosity often emerges when exploring things aligned with your values. Visualized Vision translates abstract values into concrete future outcomes.`,
    tags: ['values', 'principles', 'meaning', 'inner-compass', 'foundation'],
    type: 'learn',
    dimension: 'spirit',
    key: 'grounding-values',
    isPinned: true,
    pinOrder: 7,
    difficulty: 'Beginner',
    readTime: 2,
    createdDate: '2024-12-19'
  },

  // Flow Key 8: Ignited Curiosity
  {
    id: 'ignited-curiosity-essential',
    title: 'Ignited Curiosity',
    description: 'The fuel that turns learning from a chore into an adventure - keeping you engaged and growing',
    content: `Curiosity is the difference between feeling drained and feeling energized by your work.

When you're genuinely curious about something, time disappears. You dig deeper not because you have to, but because you want to know what you'll find. But when curiosity dies, even simple tasks feel like pushing through mud.

## Your Learning Engine

Curiosity isn't just a nice personality trait—it's your brain's learning engine. When something sparks your interest, your brain releases dopamine, the same chemical that makes flow states feel so good. This creates a self-reinforcing cycle: curiosity leads to engagement, which leads to discovery, which feeds more curiosity.

Most people's curiosity gets crushed by years of "just do what you're told" training. But it can be reignited, and when it is, work transforms from obligation into exploration.

## How It Works

Your brain has an information-seeking system that's as powerful as your hunger for food. When you encounter something mysterious or incomplete, this system activates and won't rest until it finds answers. This is why you can spend hours researching something that fascinates you without feeling tired.

Research shows that curious people learn faster, perform better, and show more resilience when facing challenges. Curiosity literally rewires your brain to be better at everything.

## What You'll Do

**Ask Better Questions**
Instead of accepting surface explanations, dig deeper. Instead of "How do I do this?" ask "Why does this work this way?" and "What would happen if I tried something different?"

**Experiment Like a Scientist**
Treat your work like a research project. Try new approaches. Test different methods. See failures as data, not setbacks. What can you learn from what didn't work?

**Follow the Thread**
When something captures your interest, don't immediately move to the next task. Follow your curiosity deeper. The most interesting discoveries happen when you pursue tangents.

**Connect the Dots**
Look for unexpected connections between different ideas, fields, or approaches. Some of the biggest breakthroughs come from combining things that weren't meant to go together.

## What You'll Notice

**When It's Working:**
- Natural drive to understand the "how" and "why" behind things
- Excitement about learning new skills or exploring new ideas
- Willingness to spend extra time investigating interesting problems
- Energy increases when encountering novel challenges
- Questions emerge spontaneously during work

**When It's Not:**
- Learning feels like obligation rather than opportunity
- Tendency to accept surface explanations without investigation
- Avoidance of unfamiliar challenges or approaches
- Motivation depends on external pressure rather than internal interest
- Work becomes repetitive without seeking improvement

## Build This Skill

**Question Everything**
Set aside time each day to formulate genuine questions about your current work. What would you investigate if you had unlimited time?

**Try New Things**
Regularly experiment with new approaches, tools, or methods. Treat your work as ongoing research rather than routine execution.

**Cross-Pollinate Ideas**
Expose yourself to ideas from fields outside your expertise. Read broadly. Talk to people who think differently. Look for unexpected connections.

**Document Your Discoveries**
Keep track of interesting questions, observations, and insights. Create a system that captures curious thoughts for future exploration.

## Related Keys
Open Mind provides the mental flexibility that supports curious exploration. Grounding Values helps identify what's genuinely worth being curious about. Feedback Systems can reveal interesting patterns that spark further investigation.`,
    tags: ['curiosity', 'learning', 'motivation', 'growth', 'discovery'],
    type: 'learn',
    dimension: 'spirit',
    key: 'ignited-curiosity',
    isPinned: true,
    pinOrder: 8,
    difficulty: 'Beginner',
    readTime: 2,
    createdDate: '2024-12-19'
  },

  // Flow Key 9: Visualized Vision
  {
    id: 'visualized-vision-essential',
    title: 'Visualized Vision',
    description: 'Clear pictures of your future that pull you forward and guide daily decisions',
    content: `Without a clear vision of where you're going, any road will get you there.

Most people know they want "success" or "happiness," but they can't paint a picture of what those words actually mean to them. When your vision is fuzzy, your motivation is fuzzy too. But when you can see exactly where you're headed, every decision becomes easier.

## Your Future GPS

A visualized vision isn't just daydreaming—it's like having GPS for your life. When you can clearly see your destination, you naturally notice opportunities that move you toward it and obstacles that don't serve you. Your brain starts working as your personal assistant, filtering information and ideas through the lens of "does this get me closer?"

The key is making your vision specific, vivid, and emotionally compelling. Not just "I want to be successful," but "I can see myself giving a presentation to 200 people who are leaning forward, engaged, asking thoughtful questions."

## How It Works

Your brain has a powerful pattern-recognition system called the reticular activating system (RAS). Once you program it with a clear vision, it starts noticing relevant opportunities, people, and resources that were always there but invisible before.

Research shows that people who visualize their goals in detail are significantly more likely to achieve them. When you can see your future clearly, your brain treats it as a real destination and starts mapping routes to get there.

## What You'll Do

**Paint the Picture**
Don't just think about your goals—visualize them in rich detail. What will you see, hear, feel when you achieve them? Who will be there? What will your typical day look like?

**Make It Emotionally Real**
Connect with why this vision matters to you. How will achieving it make you feel? What will it mean for the people you care about? Feel the emotions, don't just think about them.

**Review and Refine**
Regularly revisit your vision. As you grow and learn, your vision may evolve. Keep it current and compelling.

**Use It for Decision-Making**
When facing choices, ask: "Which option moves me closer to my vision?" Let your future self guide your current choices.

## What You'll Notice

**When It's Working:**
- Clear sense of direction and purpose in daily activities
- Natural motivation that doesn't depend on external pressure
- Easy decision-making when options compete for your attention
- Opportunities seem to appear more frequently
- Patience with short-term sacrifices for long-term gains

**When It's Not:**
- Feeling scattered or unsure about priorities
- Motivation that comes and goes without clear pattern
- Difficulty choosing between different opportunities
- Feeling like you're drifting without clear direction
- Impatience with anything that doesn't provide immediate rewards

## Build This Skill

**Vision Sessions**
Set aside time weekly to visualize your future in detail. Use all your senses and emotions, not just logical thinking.

**Write It Down**
Create written descriptions of your vision. Include specific details about what success looks like in different areas of your life.

**Vision Boarding**
Create visual representations—images, words, symbols—that remind you of your desired future. Place them where you'll see them regularly.

**Future Self Conversations**
Regularly ask yourself: "What would my future self do in this situation?" Use your vision as a decision-making filter.

## Related Keys
Grounding Values provides the foundation that makes your vision authentic and sustainable. Worthy Mission translates your vision into specific actions and goals. Ignited Curiosity helps you explore possibilities for your future.`,
    tags: ['vision', 'future-focus', 'motivation', 'goal-setting', 'clarity'],
    type: 'learn',
    dimension: 'spirit',
    key: 'visualized-vision',
    isPinned: true,
    pinOrder: 9,
    difficulty: 'Beginner',
    readTime: 2,
    createdDate: '2024-12-19'
  },

  // Flow Key 10: Empowered Role
  {
    id: 'empowered-role-essential',
    title: 'Empowered Role',
    description: 'Taking ownership of your part in the bigger story - acting from choice rather than obligation',
    content: `The difference between feeling powerful and feeling powerless is the story you tell yourself about your role.

Some people see themselves as victims of circumstance, waiting for permission or rescue. Others see themselves as the main character of their own story, responsible for their choices and capable of changing their situation. The second group gets better results and feels more engaged with their work.

## Your Character Arc

Every story needs a protagonist who takes action, makes choices, and drives the plot forward. In your life story, that protagonist is you—but only if you choose to play that role.

When you operate from an empowered role, you ask "How can I influence this?" instead of "Why is this happening to me?" You focus on your response rather than other people's actions. You see obstacles as plot points, not dead ends.

## How It Works

Your brain is constantly running a narrative about who you are and what's possible for you. When that narrative casts you as powerless—a victim, a passenger, someone waiting for external change—you literally see fewer options and take less action.

But when your story casts you as empowered—an agent, a driver, someone who creates change—your brain starts scanning for opportunities and generating solutions. The same situation looks completely different depending on the role you assign yourself.

## What You'll Do

**Own Your Choices**
Instead of saying "I have to," start saying "I choose to." Even when options are limited, you still get to decide how to respond. That choice is your power.

**Focus on Your Sphere of Influence**
Identify what you can actually control or influence, then put your energy there. Stop wasting time on things outside your control.

**Rewrite Victim Stories**
When you catch yourself thinking "This always happens to me" or "I can't because..." challenge that story. Look for evidence of your agency and capability.

**Take the Next Right Action**
Instead of waiting for permission or perfect conditions, ask: "What's one thing I can do right now to move this forward?" Then do it.

## What You'll Notice

**When It's Working:**
- Natural focus on solutions rather than problems
- Confidence in your ability to influence outcomes
- Taking initiative without waiting for permission
- Resilience when facing setbacks or obstacles
- Sense of ownership and investment in your work

**When It's Not:**
- Feeling like a victim of circumstances beyond your control
- Waiting for others to solve problems or create opportunities
- Blaming external factors for lack of progress
- Feeling helpless or stuck in unchangeable situations
- Low energy and engagement because "nothing you do matters"

## Build This Skill

**Daily Choice Awareness**
Notice how many times you say "I have to" versus "I choose to." Practice reframing obligations as choices.

**Influence Mapping**
For any challenge you face, draw three circles: what you control, what you influence, and what you can't affect. Focus your energy on the first two.

**Agency Journaling**
Write about situations where you've successfully influenced outcomes or overcome obstacles. Build evidence of your capability.

**Action Bias**
When facing problems, always ask "What's one thing I can do about this?" Take that action, however small, before planning or analyzing further.

## Related Keys
Grounding Values gives you the foundation to act from principle rather than pressure. Worthy Mission provides direction for your empowered actions. Generative Story helps you see how your role fits into the bigger narrative.`,
    tags: ['agency', 'ownership', 'responsibility', 'empowerment', 'choice'],
    type: 'learn',
    dimension: 'story',
    key: 'empowered-role',
    isPinned: true,
    pinOrder: 10,
    difficulty: 'Beginner',
    readTime: 2,
    createdDate: '2024-12-19'
  },

  // Flow Key 11: Generative Story
  {
    id: 'generative-story-essential',
    title: 'Generative Story',
    description: 'The narrative that creates possibility instead of limitation - turning setbacks into setups',
    content: `The story you tell yourself about your life is the most important story you'll ever tell.

Some people have stories that limit them: "I'm not creative," "Things never work out for me," "I always struggle with this." Others have stories that empower them: "I'm learning to get better at this," "This setback is teaching me something important," "I haven't figured it out yet."

The difference between these two groups isn't their circumstances—it's their narrative.

## Your Internal Narrator

Your brain is constantly telling stories about what happens to you and what it means. This isn't optional—humans are meaning-making machines. The question is whether your stories create possibility or shut it down.

A generative story looks for growth, learning, and opportunity in every experience. Instead of "I failed," it's "I got data." Instead of "I'm bad at this," it's "I'm getting better at this." Instead of "Why me?" it's "What can I learn from this?"

## How It Works

The stories you tell literally reshape your brain. When you consistently interpret experiences as evidence of growth and possibility, you strengthen neural pathways associated with resilience and optimism. When you interpret them as evidence of limitation, you strengthen different pathways.

Research shows that people who tell "redemptive narratives"—stories that find meaning and growth in difficulty—are more resilient, more motivated, and more likely to achieve their goals. They don't experience fewer problems; they just have better stories about them.

## What You'll Do

**Catch Limiting Stories**
Notice when you tell yourself stories that emphasize what's wrong with you or what's impossible. These usually include words like "always," "never," "can't," or "am."

**Reframe as Learning**
Instead of "I'm terrible at presentations," try "I'm learning to be better at presentations." Instead of "This project is a disaster," try "This project is teaching me what doesn't work."

**Look for the Growth**
In every setback or challenge, ask: "What is this experience teaching me?" "How might this make me stronger or smarter?" "What opportunity might be hidden here?"

**Write Your Hero's Journey**
Think of yourself as the protagonist in an ongoing story of growth and discovery. What would the hero of your story do next?

## What You'll Notice

**When It's Working:**
- Challenges feel like plot developments rather than endings
- Natural resilience and bounce-back from setbacks
- Sense of authorship over your life direction
- Stories about the past emphasize growth and learning
- Future narratives feel possible and exciting

**When It's Not:**
- Stories focus on limitations, obstacles, or external constraints
- Past experiences feel like permanent damage or evidence of inability
- Future seems predetermined or beyond your influence
- Narrative emphasizes victimhood or powerlessness
- Stories create resignation rather than motivation

## Build This Skill

**Story Editing**
Regularly examine the stories you tell about yourself and your experiences. Rewrite limiting stories to emphasize growth and possibility.

**Growth Documentation**
Keep a record of how you've learned, developed, and improved over time. Use this evidence to support generative narratives.

**Hero Questions**
When facing challenges, ask: "What would the hero of my story do in this situation?" Let that perspective guide your response.

**Redemption Practice**
For any difficult experience, practice finding the redemptive elements—the growth, learning, or opportunity that came from it.

## Related Keys
Empowered Role gives you agency to act on your generative stories. Worthy Mission provides direction for your story's next chapter. Grounding Values ensures your stories align with what truly matters to you.`,
    tags: ['narrative', 'mindset', 'resilience', 'growth', 'possibility'],
    type: 'learn',
    dimension: 'story',
    key: 'generative-story',
    isPinned: true,
    pinOrder: 11,
    difficulty: 'Beginner',
    readTime: 2,
    createdDate: '2024-12-19'
  },

  // Flow Key 12: Worthy Mission
  {
    id: 'worthy-mission-essential',
    title: 'Worthy Mission',
    description: 'A purpose bigger than yourself that makes the hard work worth it and gives meaning to the struggle',
    content: `When your work serves something bigger than yourself, you tap into an endless source of motivation.

Most people burn out because they're running on willpower alone. They're working for external rewards—money, status, approval—that never quite satisfy. But when you have a worthy mission, something you genuinely care about improving or serving, the work itself becomes the reward.

## Your North Star Purpose

A worthy mission isn't about being a saint or saving the world (though it could be). It's about connecting your daily work to something that matters beyond your own benefit. Maybe it's helping people solve problems. Maybe it's creating beauty. Maybe it's advancing knowledge or building something lasting.

The key is that it feels worthy to you—not because someone told you it should, but because it resonates with your values and speaks to what you want your life to contribute.

## How It Works

When psychologists study what motivates people long-term, they find that meaning beats money every time. People will work harder, longer, and with more creativity when they believe their work serves a larger purpose.

Your brain's reward systems light up differently when you're working for something meaningful. Instead of the quick hits and crashes of external motivation, you get sustained energy from knowing your effort matters. This isn't just feel-good psychology—it's measurable in brain scans and performance data.

## What You'll Do

**Identify Your Service**
Think about how your unique skills and interests could address real problems or needs. What would you work on even if no one paid you? What breaks your heart that you might help fix?

**Connect Daily Work to Mission**
Find explicit links between routine tasks and your larger purpose. Even mundane work feels different when you can see how it serves something meaningful.

**Measure Mission Impact**
Track how your work creates positive outcomes for others. Make the connection between effort and service visible and tangible.

**Choose Mission-Aligned Opportunities**
When facing decisions about projects or commitments, ask: "Which option better serves my mission?" Let purpose guide your priorities.

## What You'll Notice

**When It's Working:**
- Work feels inherently meaningful beyond personal rewards
- Natural willingness to invest sustained effort in challenging projects
- Resilience during difficult periods because the mission matters
- Clear criteria for evaluating opportunities and commitments
- Energy increases when connecting work to larger purpose

**When It's Not:**
- Motivation depends primarily on external rewards or recognition
- Difficulty sustaining effort during challenging or lengthy projects
- Unclear about why specific work matters beyond personal benefit
- Decision-making based primarily on personal advantage
- Energy depletes when work feels disconnected from larger meaning

## Build This Skill

**Purpose Exploration**
Examine how your work and capabilities could serve meaningful purposes. Look for connections between personal skills and real needs in the world.

**Impact Documentation**
Track and celebrate the positive outcomes your work creates for others. Make mission impact visible through stories and data.

**Mission Evolution**
Allow your understanding of purpose to evolve as you grow and learn. Your mission can deepen and expand over time.

**Service Integration**
Look for ways to increase the positive impact of your work on others. How can you serve more effectively through what you're already doing?

## Related Keys
Grounding Values provides the foundation for identifying missions that truly matter to you. Visualized Vision helps you imagine what mission fulfillment would look like. Empowered Role gives you the agency to act toward mission objectives.`,
    tags: ['mission', 'purpose', 'service', 'meaning', 'contribution'],
    type: 'learn',
    dimension: 'story',
    key: 'worthy-mission',
    isPinned: true,
    pinOrder: 12,
    difficulty: 'Beginner',
    readTime: 2,
    createdDate: '2024-12-19'
  }
];

async function importAllArticles() {
  console.log('🚀 Starting import of all Flow Key articles...');
  
  try {
    console.log(`📊 Importing ${ALL_FLOW_KEYS.length} articles...`);
    
    for (const article of ALL_FLOW_KEYS) {
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
    console.log(`📊 Imported ${ALL_FLOW_KEYS.length + 1} total articles (including Tuned Emotions)`);
    console.log('🔄 Refresh your Sanity Studio to see all 12 Flow Key articles');
    console.log('🌐 Visit your site to see them live!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

importAllArticles();