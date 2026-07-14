export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Kamu bisa tambahkan navbar atau footer khusus untuk landing page di sini nanti */}
      {children}
    </section>
  );
}
