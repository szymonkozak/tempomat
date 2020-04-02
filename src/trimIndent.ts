export function trimIndent(message: string) {
    return message.replace(/^ {2,}/gm, '')
}
