export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/628123456789"
      target="_blank"
      rel="noopener noreferrer"
      // animate-bounce memberikan efek naik-turun yang elegan dan simpel
      className="fixed bottom-6 right-6 z-[9999] bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 animate-bounce hover:animate-none hover:scale-110 flex items-center justify-center"
    >
      <i className="fa-brands fa-whatsapp text-3xl"></i>
    </a>
  );
}
