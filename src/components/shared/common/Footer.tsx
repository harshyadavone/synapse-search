import Link from "next/link";

export default function Footer({ onCustomize }: { onCustomize: () => void }) {
  return (
    <footer className="w-full mt-16 mb-4 text-center text-sm text-muted-foreground">
      <p>© 2024 Synapse. All rights reserved.</p>
      <div className="mt-4 flex justify-center flex-wrap gap-4">
        <Link
          href="/privacy"
          className="hover:text-primary transition-colors duration-300"
        >
          Privacy
        </Link>
        <Link
          href="/terms"
          className="hover:text-primary transition-colors duration-300"
        >
          Terms
        </Link>
        <Link
          href="/about"
          className="hover:text-primary transition-colors duration-300"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="hover:text-primary transition-colors duration-300"
        >
          Contact
        </Link>
        <button
          onClick={onCustomize}
          className="hover:text-primary transition-colors duration-300"
        >
          Customize Homepage
        </button>
      </div>
    </footer>
  );
}
