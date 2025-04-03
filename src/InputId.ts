/**
 * TODO: コメント
 */
export type InputId = `${0 | 1}${0 | 1}${0 | 1}${0 | 1}${string}`

export function deriveInputId(e: KeyboardEvent): InputId {
  // TODO: Mac用の修飾キーの判定
  return `${e.ctrlKey ? 1 : 0}${e.shiftKey ? 1 : 0}${e.altKey ? 1 : 0}${e.metaKey ? 1 : 0}${e.code}`
}
