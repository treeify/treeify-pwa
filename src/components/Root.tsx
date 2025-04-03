import { onCleanup, onMount } from 'solid-js'
import { toggleBold } from '~/commands'
import { InputIdChecker } from '~/components/InputIdChecker'
import { MainAreaTextItemContent } from '~/components/MainAreaTextItemContent'

export function Root() {
  // TODO: 別の場所にする
  const onSelectionChange = () => {
    console.log('selectionchange', document.getSelection())
    console.log('range', document.getSelection()?.getRangeAt(0))
  }
  onMount(() => document.addEventListener('selectionchange', onSelectionChange))
  onCleanup(() => document.removeEventListener('selectionchange', onSelectionChange))

  // TODO: 別の場所にする。MainAreaコンポーネント内かな？
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.isComposing) return

    // TODO: command mapを使う
    if (e.code === 'KeyB' && e.ctrlKey) {
      e.preventDefault()
      toggleBold()
    }
  }

  return (
    // TODO: CSSを別ファイルにする
    <div style={{ display: 'grid', 'place-items': 'center', height: '100vh' }} onKeyDown={onKeyDown}>
      <MainAreaTextItemContent />
      <InputIdChecker />
    </div>
  )
}
