// types/emoji-dictionary.d.ts
declare module "emoji-dictionary" {
  export function getName(emoji: string): string | undefined
  export function getUnicode(name: string): string | undefined
  export function getAliases(emoji: string): string[] | undefined
  export function getEmojiList(): string[]
}
