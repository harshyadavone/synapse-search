import Link from "next/link";

export default function Footer({ onCustomize }: { onCustomize: () => void }) {
  return (
    <footer className="w-full mb-2 mt-16 text-center text-sm text-muted-foreground">
      <div className="mt-4 flex flex-row items-center justify-center gap-3 mb-2">
        <Link
          href="https://github.com/harshyadavone/synapse-search"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-muted-foreground/80 transition-colors hover:underline"
        >
          GitHub
        </Link>
        <Link
          href="https://twitter.com/harshyadavone"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-muted-foreground/80 transition-colors hover:underline"
        >
          Twitter
        </Link>
        <Link
          href="https://www.linkedin.com/in/harshdana"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-muted-foreground/80 transition-colors hover:underline"
        >
          LinkedIn
        </Link>
      </div>
      <p>© 2024 Synapse. All rights reserved.</p>
    </footer>
  );
}
