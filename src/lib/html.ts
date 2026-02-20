import { marked } from "marked";
import TurndownService from "turndown";

const turndown = new TurndownService({
	headingStyle: "atx",
	bulletListMarker: "-",
	codeBlockStyle: "fenced",
});

/**
 * Convert Apple Notes HTML body to Markdown.
 */
export function htmlToMarkdown(html: string): string {
	return turndown.turndown(html);
}

/**
 * Convert Markdown to HTML suitable for Apple Notes.
 * Inserts <br> between block elements since Apple Notes
 * doesn't render CSS margins between blocks.
 */
export function markdownToHtml(md: string): string {
	const html = marked.parse(md, { async: false }) as string;
	// Add spacing between block elements, but not before lists
	// since Apple Notes already spaces paragraph-to-list transitions.
	return html.replace(
		/(<\/(h[1-6]|p|ul|ol|blockquote|pre|hr|table)>)\s*(<(?!ul|ol|li))/gi,
		"$1<br>$3",
	);
}
