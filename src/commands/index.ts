import { assert, isNotNullish } from 'base-up'

export const COMMANDS = { toggleBold }

export function toggleBold() {
  const selection = document.getSelection()
  assert(selection, isNotNullish)
  const range = selection.getRangeAt(0)

  if (!(range.commonAncestorContainer instanceof Element)) return

  const closest = range.commonAncestorContainer.closest('b')
  if (closest) {
    // 選択範囲が既にb要素で囲まれている場合
    // const textNode = document.createTextNode(range.toString())
    range.deleteContents()
    range.setStart(closest, 0)

    // range.insertNode(textNode)
  } else {
    // 選択範囲がb要素で囲まれていない場合
    const newNode = document.createElement('b')
    newNode.appendChild(range.extractContents())
    range.insertNode(newNode)
  }
}
