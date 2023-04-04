import { assertNeverType, bindAllButFirst, join, map, pipe } from 'base-up'
import type { integer } from '../integer'

/**
 * DOM要素っぽいオブジェクトの型。
 * contenteditableな要素のinnerHTMLを安全に扱うために導入した。
 */
export type DomishObject = DomishObject.Element | DomishObject.TextNode

export namespace DomishObject {
  export type MarkupElement = BElement | UElement | IElement | SElement
  export type Element = MarkupElement | BRElement

  export type BElement = {
    type: 'b'
    children: readonly DomishObject[]
  }
  export type UElement = {
    type: 'u'
    children: readonly DomishObject[]
  }
  export type IElement = {
    type: 'i'
    children: readonly DomishObject[]
  }
  export type SElement = {
    type: 's'
    children: readonly DomishObject[]
  }

  export type BRElement = {
    type: 'br'
  }

  export type TextNode = {
    type: 'text'
    textContent: string
  }

  // いわゆる「&nbsp;」
  const nbsp = String.fromCharCode(160)

  /** DomishObjectをHTML文字列に変換する */
  export function toHtml(value: DomishObject | readonly DomishObject[]): string {
    if (value instanceof Array) {
      return value.map(toHtml).join('')
    } else {
      const domishObject = value
      switch (domishObject.type) {
        case 'b':
          return `<b>${toHtml(domishObject.children)}</b>`
        case 'u':
          return `<u>${toHtml(domishObject.children)}</u>`
        case 'i':
          return `<i>${toHtml(domishObject.children)}</i>`
        case 's':
          return `<strike>${toHtml(domishObject.children)}</strike>`
        case 'br':
          return `<br>`
        case 'text':
          return escape(domishObject.textContent)
        default:
          assertNeverType(domishObject)
      }
    }
  }

  /** HTML文字列をDomishObjectに変換する */
  export function fromHtml(html: string): readonly DomishObject[] {
    const templateElement = document.createElement('template')
    templateElement.innerHTML = html
    return DomishObject.fromChildren(templateElement.content)
  }

  /** 与えられたNodeをDomishObjectのリストに変換する */
  export function fromChildren(node: Node): readonly DomishObject[] {
    return [...node.childNodes].flatMap(from)
  }

  /**
   * 与えられたNodeをDomishObjectのリストに変換する。
   * DomishObjectがサポートしていない要素は透過的に無視される。
   * 例えば<div><b>text</b></div> は <b>text</b>であるかのように扱う。
   */
  export function from(node: Node): readonly DomishObject[] {
    if (node instanceof HTMLBRElement) {
      return [{ type: 'br' }]
    }
    if (node.nodeType === Node.TEXT_NODE) {
      // 通常の半角スペースをいわゆる「&nbsp;」に変換してからテキストノード化する
      const textContent = node.textContent ?? ''
      return [{ type: 'text', textContent: textContent.replaceAll(' ', nbsp) }]
    }

    const children = [...node.childNodes].flatMap(from)
    if (node instanceof HTMLElement) {
      switch (node.tagName.toLowerCase()) {
        case 'b':
        case 'strong':
          return [{ type: 'b', children }]
        case 'u':
        case 'ins':
          return [{ type: 'u', children }]
        case 'i':
        case 'em':
          return [{ type: 'i', children }]
        case 'strike':
        case 's':
        case 'del':
          return [{ type: 's', children }]
      }
    }
    return children
  }

  /** 文字列の長さ（文字数ではなくlength） + 改行（br要素）の数を返す */
  export function getTextLength(value: DomishObject | readonly DomishObject[]): integer {
    return toPlainText(value).length
  }

  /**
   * プレーンテキストに変換する。
   * br要素は改行コードに変換する。
   * nbspは半角スペースに変換する。
   * ただし末尾の無駄な（すなわちHTMLへの描画時に改行として扱われない）br要素は除去するので要注意。
   */
  export function toPlainText(value: DomishObject | readonly DomishObject[]): string {
    const plainText = _toPlainText(value)
    return plainText.replace(/\r?\n$/, '')
  }

  function _toPlainText(value: DomishObject | readonly DomishObject[]): string {
    if (value instanceof Array) {
      return value.map(_toPlainText).join('')
    } else {
      const domishObject = value
      switch (domishObject.type) {
        case 'b':
        case 'u':
        case 'i':
        case 's':
          return _toPlainText(domishObject.children)
        case 'br':
          return '\n'
        case 'text':
          return domishObject.textContent.replaceAll(nbsp, ' ')
        default:
          assertNeverType(domishObject)
      }
    }
  }

  export function fromPlainText(text: string): readonly DomishObject[] {
    return pipe(
      text.split(/\r?\n/),
      bindAllButFirst(map, (line: string) => {
        // 通常の半角スペースをいわゆる「&nbsp;」に変換してからテキストノード化する
        return [{ type: 'text', textContent: line.replaceAll(' ', nbsp) }] satisfies [TextNode]
      }),
      bindAllButFirst(join, { type: 'br' } satisfies BRElement)
    )
  }

  /**
   * Markdown形式のテキストを生成する。
   * テキスト項目内の改行は空白スペース2つ+改行に変換する。
   */
  export function toMultiLineMarkdownText(value: DomishObject | readonly DomishObject[]): string {
    if (value instanceof Array) {
      return value.map(toMultiLineMarkdownText).join('')
    } else {
      switch (value.type) {
        case 'b':
          return `**${toMultiLineMarkdownText(value.children)}**`
        case 'u':
          return `<ins>${toMultiLineMarkdownText(value.children)}</ins>`
        case 'i':
          return `*${toMultiLineMarkdownText(value.children)}*`
        case 's':
          return `~~${toMultiLineMarkdownText(value.children)}~~`
        case 'br':
          return '  \n'
        case 'text':
          return value.textContent.replaceAll(nbsp, ' ')
        default:
          assertNeverType(value)
      }
    }
  }

  /**
   * Markdown形式のテキストを生成する。
   * テキスト項目内の改行は半角スペース1つに置換する。
   */
  export function toSingleLineMarkdownText(value: DomishObject | readonly DomishObject[]): string {
    if (value instanceof Array) {
      return value.map(toSingleLineMarkdownText).join('')
    } else {
      switch (value.type) {
        case 'b':
          return `**${toSingleLineMarkdownText(value.children)}**`
        case 'u':
          return `<ins>${toSingleLineMarkdownText(value.children)}</ins>`
        case 'i':
          return `*${toSingleLineMarkdownText(value.children)}*`
        case 's':
          return `~~${toSingleLineMarkdownText(value.children)}~~`
        case 'br':
          return ' '
        case 'text':
          return value.textContent.replaceAll(nbsp, ' ')
        default:
          assertNeverType(value)
      }
    }
  }

  /**
   * プレーンテキストかどうかを判定する。
   * 改行はプレーンテキストとして扱う。
   */
  export function isPlainText(domishObjects: readonly DomishObject[]): boolean {
    return domishObjects.every((domishObject) => {
      switch (domishObject.type) {
        case 'b':
        case 'u':
        case 'i':
        case 's':
          return false
        case 'br':
        case 'text':
          return true
        default:
          assertNeverType(domishObject)
      }
    })
  }

  function escape(plainText: string): string {
    const divElement = document.createElement('div')
    divElement.innerText = plainText
    return divElement.innerHTML
  }

  export function replace(domishObject: DomishObject, beforeReplace: string, afterReplace: string): DomishObject {
    switch (domishObject.type) {
      case 'br':
        return domishObject
      case 'b':
      case 'u':
      case 'i':
      case 's':
        return {
          type: domishObject.type,
          children: domishObject.children.map((child) => replace(child, beforeReplace, afterReplace)),
        }
      case 'text':
        return {
          type: 'text',
          textContent: domishObject.textContent.replaceAll(beforeReplace, afterReplace),
        }
    }
  }
}
