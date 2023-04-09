/**
 * 整数を表す型。
 * 実体は単なるnumber型なので整数であることを保証できないが、ドキュメント用途として使う。
 * 例えば関数の引数がinteger型の場合は、非整数が渡されるケースを考慮しなくていい（整数化は利用者の責務ということ）。
 * 逆に関数の戻り値がinteger型の場合は、その関数が整数化する責務を負う。
 */
export type integer = number