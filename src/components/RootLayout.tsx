import { createSignalObject } from 'solid-signal-object'

export function RootLayout() {
  const inn = createSignalObject('ho<b>hello</b>ge')
  const initialHtml = inn.value
  function onChangeInnerHtml(html: string) {
    console.log(document.getSelection())
    inn.set(html)
  }
  return (
    <div style={{ display: 'grid', 'place-items': 'center', height: '100vh' }}>
      <div
        contenteditable="plaintext-only"
        innerHTML={initialHtml}
        onInput={(e) => e.isComposing || onChangeInnerHtml(e.target.innerHTML)}
        onCompositionEnd={(e) => onChangeInnerHtml(e.target.innerHTML)}
      />
      <div style={{ 'white-space': 'pre-wrap' }}>{inn.value}</div>
      <div>{JSON.stringify(inn.value)}</div>
    </div>
  )
}
