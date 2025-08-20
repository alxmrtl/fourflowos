import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'

import {schemaTypes} from './sanity/schemaTypes'

export default defineConfig({
  name: 'fourflowos-studio',
  title: 'FourFlowOS Content Studio',

  projectId: 'pz22ntol',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Flow Keys by Dimension')
              .child(
                S.list()
                  .title('Dimensions')
                  .items([
                    S.listItem()
                      .title('Self')
                      .child(
                        S.documentList()
                          .title('Self - Flow Keys')
                          .filter('_type == "contentItem" && dimension == "self"')
                      ),
                    S.listItem()
                      .title('Space')
                      .child(
                        S.documentList()
                          .title('Space - Flow Keys')
                          .filter('_type == "contentItem" && dimension == "space"')
                      ),
                    S.listItem()
                      .title('Story')
                      .child(
                        S.documentList()
                          .title('Story - Flow Keys')
                          .filter('_type == "contentItem" && dimension == "story"')
                      ),
                    S.listItem()
                      .title('Spirit')
                      .child(
                        S.documentList()
                          .title('Spirit - Flow Keys')
                          .filter('_type == "contentItem" && dimension == "spirit"')
                      ),
                  ])
              ),
            S.listItem()
              .title('All Content')
              .child(
                S.documentList()
                  .title('All Content Items')
                  .filter('_type == "contentItem"')
              ),
            S.listItem()
              .title('Pinned Essential Articles')
              .child(
                S.documentList()
                  .title('Pinned Articles')
                  .filter('_type == "contentItem" && isPinned == true')
                  .defaultOrdering([{field: 'pinOrder', direction: 'asc'}])
              ),
          ])
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },
})