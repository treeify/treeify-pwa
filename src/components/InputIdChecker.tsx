import { createSignalObject } from 'solid-signal-object'

/**
 * 開発中にInputIdをさくっと調べるためのコンポーネント。
 */
export function InputIdChecker() {
  const lastKey = createSignalObject<string | undefined>()
  return (
    <div>
      <label style={{ display: 'flex', gap: '1em' }}>
        InputId
        <input
          onKeyDown={(e) => {
            lastKey.value = e.code
          }}
        />
      </label>
      <output>{lastKey.value}</output>
    </div>
  )
}
