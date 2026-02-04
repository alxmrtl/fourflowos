// Brand colors (Space pillar accent)
export const SAGE = '#6BA292';
export const CORAL = '#FF6F61';
export const STEEL = '#5B84B1';
export const AMETHYST = '#7A4DA4';

export const FOUR_PILLAR_GRADIENT = `linear-gradient(90deg, ${CORAL}, ${SAGE}, ${STEEL}, ${AMETHYST})`;

// Default training settings
export const DEFAULT_WPM = 250;
export const MIN_WPM = 100;
export const MAX_WPM = 800;
export const WPM_STEP = 10;

export const DEFAULT_FONT_SIZE = 16;
export const MIN_FONT_SIZE = 12;
export const MAX_FONT_SIZE = 24;

// Sample texts for speed tests and training
export const SAMPLE_TEXTS = [
  {
    id: 'sample-0',
    title: 'The Science of Speed Reading',
    content: `Speed reading is more than just moving your eyes faster across a page—it's a fundamental rewiring of how your brain processes text. Traditional reading habits, developed in childhood, often become obstacles to efficient comprehension as adults.

The first barrier to overcome is subvocalization, the inner voice that "speaks" every word as you read. While helpful for learning, this mental speech limits your reading speed to the pace of spoken language—roughly 200-250 words per minute. Advanced readers train themselves to process text directly through visual recognition, bypassing this auditory bottleneck entirely.

Eye movement patterns reveal another opportunity for improvement. Untrained readers make frequent regressions, unconsciously re-reading words and phrases they've already processed. This habit, born from uncertainty and poor focus, can reduce reading efficiency by 30-40%. Speed reading training teaches deliberate forward momentum, trusting your brain's remarkable ability to fill in gaps and maintain comprehension.

Peripheral vision expansion allows readers to capture multiple words—even entire phrases—in a single fixation. Instead of the typical word-by-word progression, skilled readers develop chunk reading abilities, processing 3-5 words simultaneously. This technique dramatically increases throughput while reducing eye strain and mental fatigue.

Perhaps most importantly, speed reading is adaptive. Different materials demand different approaches: emails require rapid scanning, technical documents need careful analysis, and fiction benefits from immersive pacing. The goal isn't maximum speed—it's optimal speed for your purpose, maintaining comprehension while eliminating inefficiencies that slow you down unnecessarily.`,
    wordCount: 245,
  },
  {
    id: 'sample-1',
    title: 'Reading and Flow States',
    content: `The concept of flow—that state of effortless concentration where time seems to disappear—applies powerfully to reading. When readers achieve flow, comprehension increases while mental effort decreases, creating an optimal learning experience that feels both engaging and sustainable.

Flow occurs when challenge and skill levels align perfectly. If text is too easy, boredom sets in; too difficult, and anxiety disrupts focus. Speed reading training creates this balance by gradually increasing your processing capacity while providing appropriately challenging material. As your skills develop, you can tackle more complex texts while maintaining that sweet spot of engaged concentration.

The flow state requires clear goals and immediate feedback—exactly what structured reading practice provides. Unlike passive reading, speed training gives you measurable targets: words per minute, comprehension scores, and completion times. This constant feedback loop keeps your mind fully engaged, preventing the wandering attention that disrupts flow.

Eliminating distractions is crucial for achieving reading flow. This means more than just silencing notifications—it involves training your internal focus. Advanced readers develop what psychologists call "selective attention," the ability to maintain concentration despite environmental interruptions. Regular practice builds this mental muscle, making deep focus a skill rather than an accident.

The neurological benefits of reading flow extend beyond the session itself. When your brain operates in this optimal state, it forms stronger memory connections and processes information more efficiently. The result is not just faster reading, but better retention and deeper understanding—the compound effect that makes speed reading training so powerful.`,
    wordCount: 238,
  },
  {
    id: 'sample-2',
    title: 'Breaking Mental Speed Limits',
    content: `The human brain processes visual information at extraordinary speeds—up to 13 milliseconds for basic recognition. Yet most people read at a fraction of their potential, trapped by mental barriers that have nothing to do with biological limitations. Breaking these psychological speed limits requires understanding the difference between what you can process and what you allow yourself to process.

Fear of missing information creates the biggest obstacle to faster reading. This anxiety manifests as regression—constantly looking back to "check" that you understood. But research shows that comprehension actually improves when you trust forward momentum. Your brain's parallel processing capabilities fill in gaps automatically, creating understanding from context and patterns rather than word-by-word analysis.

Traditional education creates artificial speed limits by emphasizing perfection over progress. Students learn to read every word carefully, treating text like a legal document requiring forensic analysis. This hypercautious approach becomes deeply ingrained, making adult readers feel guilty about "skipping" words, even when those words add no meaningful content.

The flow state dissolves these mental barriers entirely. When challenge matches skill level perfectly, self-consciousness disappears and performance skyrockets. Speed reading training creates this optimal zone by gradually increasing demands while building confidence. Each successful session proves that faster doesn't mean worse—it often means better, as increased engagement improves focus and retention.

Mental speed limits exist only in your head. Professional speed readers routinely achieve 1000+ words per minute with excellent comprehension, not because they have superhuman brains, but because they've eliminated the psychological obstacles that constrain most readers. The question isn't whether you can read faster—it's whether you'll give yourself permission to break through the artificial limits holding you back.`,
    wordCount: 252,
  },
];

// Storage keys
export const STORAGE_KEYS = {
  savedTexts: 'flowread-saved-texts',
  settings: 'flowread-settings',
  textInput: 'flowread-text-input',
};
