import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#1A1A1A] text-[#FDFBF7] py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        
        {/* Columna de Marca */}
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-3 mb-4">
            <span className="font-serif text-2xl font-bold tracking-widest text-[#FDFBF7]">A</span>
            <div className="flex flex-col">
              <span className="font-serif text-sm tracking-[0.25em] font-semibold text-[#FDFBF7]">ACOMÓDATE</span>
              <span className="text-[9px] tracking-[0.3em] text-[#A1887F] uppercase">Muebles</span>
            </div>
          </Link>
          <p className="text-xs text-gray-400 font-light leading-relaxed">
            Diseñamos y fabricamos muebles personalizados para tu manera de vivir. Hecho para acomodarse a ti.
          </p>
        </div>

        {/* Enlaces Rápidos */}
        <div>
          <h4 className="font-serif text-sm tracking-wider uppercase mb-4 text-[#FDFBF7]">Categorías</h4>
          <ul className="space-y-2 text-xs text-gray-400 font-light">
            <li><Link href="/categoria/salas" className="hover:text-white transition-colors">Salas</Link></li>
            <li><Link href="/categoria/comedores" className="hover:text-white transition-colors">Comedores</Link></li>
            <li><Link href="/categoria/dormitorios" className="hover:text-white transition-colors">Dormitorios</Link></li>
            <li><Link href="/categoria/sillas" className="hover:text-white transition-colors">Sillas y Poltronas</Link></li>
          </ul>
        </div>

        {/* Enlaces de Secciones */}
        <div>
          <h4 className="font-serif text-sm tracking-wider uppercase mb-4 text-[#FDFBF7]">Navegación</h4>
          <ul className="space-y-2 text-xs text-gray-400 font-light">
            <li><Link href="/a-medida" className="hover:text-white transition-colors">A Medida</Link></li>
            <li><Link href="/proyectos" className="hover:text-white transition-colors">Proyectos</Link></li>
            <li><Link href="https://wa.me/message/D6QREGANQXL3O1" className="hover:text-white transition-colors">Contacto</Link></li>
          </ul>
        </div>

        {/* Redes o Contacto */}
        <div>
          <h4 className="font-serif text-sm tracking-wider uppercase mb-4 text-[#FDFBF7]">Atención</h4>
          <p className="text-xs text-gray-400 font-light mb-2">Lunes a Sábados</p>
          <p className="text-xs text-gray-400 font-light mb-4">Atención personalizada vía WhatsApp</p>
          <a 
            href="https://wa.me/message/D6QREGANQXL3O1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-medium text-white underline hover:text-[#A1887F]"
          >
            Abrir chat de soporte
          </a>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800 text-center text-[11px] text-gray-500 font-light">
        © {new Date().getFullYear()} Acomódate Muebles. Todos los derechos reservados.
      </div>
    </footer>
  );
}