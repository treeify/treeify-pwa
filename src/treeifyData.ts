import { createMutable } from 'solid-js/store'

export const treeifyData = createMutable({
  items: {
    '0': {
      innerHtml: 'Hel<u>lo <b>wo</b>rld</u>',
      children: ['1'],
    },
    '1': {
      innerHtml: 'plain text',
      children: [],
    },
  },
})

export function getItem(id: string) {
  const item = treeifyData.items[id]
  return item
}
