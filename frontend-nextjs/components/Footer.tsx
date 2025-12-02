// Server Component - 无需 "use client"
interface FooterProps {
  conversationId: string;
}

export default function Footer({ conversationId }: FooterProps) {
  return (
    <footer className="page-footer">
      <p>Conversation ID: {conversationId}</p>
    </footer>
  );
}

