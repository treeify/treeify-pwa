import { createSignalObject } from 'solid-signal-object'
import type { ItemId } from '~/ItemId'
import { treeifyData } from '~/treeifyData'

type Props = {
  itemId: ItemId
}

export function MainAreaTextItemContent(props: Props) {
  treeifyData.items[props.itemId].content

  // TODO: Stateと接続
  const inn = createSignalObject('ho<b>ge<u>hello</u>hug</b>a')
  const initialHtml = inn.value
  function onChangeInnerHtml(html: string) {
    inn.value = html
  }
  return (
    <div>
      <div
        contenteditable="plaintext-only"
        innerHTML={initialHtml}
        onInput={(e) => e.isComposing || onChangeInnerHtml(e.target.innerHTML)}
        onCompositionEnd={(e) => onChangeInnerHtml(e.target.innerHTML)}
      />
      {/*<div style={{ 'white-space': 'pre-wrap' }}>{inn.value}</div>*/}
      <output style={{ 'margin-top': '0.25em' }}>{JSON.stringify(inn.value)}</output>
    </div>
  )
}
