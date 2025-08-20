import {defineField, defineType} from 'sanity'

export const contentItem = defineType({
  name: 'contentItem',
  title: 'Content Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'}
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'}
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url'
                  }
                ]
              }
            ]
          }
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          {title: 'Learn', value: 'learn'},
          {title: 'Practice', value: 'practice'}
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'dimension',
      title: 'Dimension',
      type: 'string',
      options: {
        list: [
          {title: 'Self', value: 'self'},
          {title: 'Space', value: 'space'},
          {title: 'Story', value: 'story'},
          {title: 'Spirit', value: 'spirit'}
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'key',
      title: 'Flow Key',
      type: 'string',
      options: {
        list: [
          // Self keys
          {title: 'Tuned Emotions', value: 'tuned-emotions'},
          {title: 'Open Mind', value: 'open-mind'},
          {title: 'Focused Body', value: 'focused-body'},
          // Space keys
          {title: 'Intentional Space', value: 'intentional-space'},
          {title: 'Optimized Tools', value: 'optimized-tools'},
          {title: 'Feedback Systems', value: 'feedback-systems'},
          // Story keys
          {title: 'Generative Story', value: 'generative-story'},
          {title: 'Worthy Mission', value: 'worthy-mission'},
          {title: 'Empowered Role', value: 'empowered-role'},
          // Spirit keys
          {title: 'Grounding Values', value: 'grounding-values'},
          {title: 'Visualized Vision', value: 'visualized-vision'},
          {title: 'Ignited Curiosity', value: 'ignited-curiosity'}
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'shortTitle',
      title: 'Short Title',
      type: 'string'
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text'
    }),
    defineField({
      name: 'difficulty',
      title: 'Difficulty',
      type: 'string',
      options: {
        list: [
          {title: 'Beginner', value: 'Beginner'},
          {title: 'Intermediate', value: 'Intermediate'},
          {title: 'Advanced', value: 'Advanced'}
        ]
      }
    }),
    defineField({
      name: 'estimatedDuration',
      title: 'Estimated Duration (minutes)',
      type: 'number'
    }),
    defineField({
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number'
    }),
    defineField({
      name: 'materialsNeeded',
      title: 'Materials Needed',
      type: 'array',
      of: [{type: 'string'}]
    }),
    defineField({
      name: 'scientificBacking',
      title: 'Scientific Backing',
      type: 'boolean'
    }),
    defineField({
      name: 'flowTriggers',
      title: 'Flow Triggers',
      type: 'array',
      of: [{type: 'string'}]
    }),
    defineField({
      name: 'targetOutcomes',
      title: 'Target Outcomes',
      type: 'array',
      of: [{type: 'string'}]
    }),
    defineField({
      name: 'createdDate',
      title: 'Created Date',
      type: 'date'
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text'
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{type: 'string'}]
    }),
    defineField({
      name: 'isPinned',
      title: 'Is Pinned',
      type: 'boolean'
    }),
    defineField({
      name: 'pinOrder',
      title: 'Pin Order',
      type: 'number'
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'dimension',
      description: 'description'
    }
  }
})