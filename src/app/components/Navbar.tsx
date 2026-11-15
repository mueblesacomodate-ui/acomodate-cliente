'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface CategoriaNav {
  id: string;
  nombre: string;
  slug: string;
  orden?: number;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categorias, setCategorias] = useState<CategoriaNav[]>([]);
  const { cart } = useCart();

  const totalItems = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const toggleMenu = () => setIsOpen(!isOpen);

  // Cargar categorías dinámicamente desde Firestore
  useEffect(() => {
    async function cargarCategoriasNavbar() {
      try {
        const q = query(collection(db, 'configuracion_categorias'), orderBy('orden', 'asc'));
        const querySnapshot = await getDocs(q);
        const lista: CategoriaNav[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          lista.push({
            id: doc.id,
            nombre: data.nombre || doc.id,
            slug: data.slug || doc.id,
          });
        });
        setCategorias(lista);
      } catch (error) {
        console.error('Error al cargar categorías en el Navbar:', error);
      }
    }
    cargarCategoriasNavbar();
  }, []);

  return (
    <header className="w-full bg-[#F5EFE7]/95 border-b border-[#D8C7B4]/40 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* LOGOTIPO */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0 mr-6 lg:mr-10">
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center">
            <img
              src="/assents/logo.svg" 
              alt="Acomódate Muebles Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.25em] font-semibold text-[#1F1F1F]">
              ACOMÓDATE
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.3em] text-[#A1887F] uppercase">
              Muebles
            </span>
          </div>
        </Link>

        {/* Menú de Escritorio Dinámico */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-[11px] xl:text-xs tracking-wider uppercase font-medium text-[#1F1F1F]/80">
          {categorias.map((cat) => (
            <Link key={cat.id} href={`/categoria/${cat.slug}`} className="hover:text-[#5A3E2B] transition-colors">
              {cat.nombre}
            </Link>
          ))}
          <Link href="/a-medida" className="hover:text-[#5A3E2B] transition-colors text-[#5A3E2B] font-semibold">A Medida</Link>
          <Link href="/proyectos" className="hover:text-[#5A3E2B] transition-colors">Proyectos</Link>
          <Link href="/nosotros" className="hover:text-[#5A3E2B] transition-colors">Nosotros</Link>
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link
            href="/carrito"
            className="relative flex items-center gap-2 bg-[#1F1F1F] text-[#F5EFE7] px-3.5 sm:px-4 py-2.5 rounded-full text-xs font-sans tracking-wider uppercase hover:bg-[#5A3E2B] transition-all duration-300 shadow-sm"
          >
            <span className="text-sm">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#5A3E2B] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-[#F5EFE7] shadow-xs animate-scale-in">
                {totalItems}
              </span>
            )}
          </Link>

          <a 
            href="https://wa.me/message/D6QREGANQXL3O1" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:inline-flex border border-[#1F1F1F] text-[#1F1F1F] px-4 xl:px-5 py-2.5 rounded-full text-[11px] xl:text-xs font-sans tracking-wider uppercase hover:bg-[#1F1F1F] hover:text-[#F5EFE7] transition-all duration-300 shadow-sm"
          >
            Cotiza tu mueble
          </a>

          <button 
            onClick={toggleMenu}
            className="lg:hidden text-[#1F1F1F] focus:outline-none p-2 rounded-lg hover:bg-[#D8C7B4]/20 transition-colors"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* Menú Móvil Dinámico */}
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-[#F5EFE7] border-b border-[#D8C7B4]/40 shadow-xl py-6 px-8 flex flex-col gap-4 transition-all">
          {categorias.map((cat) => (
            <Link 
              key={cat.id}
              href={`/categoria/${cat.slug}`} 
              onClick={() => setIsOpen(false)}
              className="text-sm tracking-widest uppercase font-medium text-[#1F1F1F]/80 hover:text-[#5A3E2B]"
            >
              {cat.nombre}
            </Link>
          ))}
          <Link 
            href="/a-medida" 
            onClick={() => setIsOpen(false)}
            className="text-sm tracking-widest uppercase font-semibold text-[#5A3E2B]"
          >
            A Medida
          </Link>
          <Link 
            href="/proyectos" 
            onClick={() => setIsOpen(false)}
            className="text-sm tracking-widest uppercase font-medium text-[#1F1F1F]/80 hover:text-[#5A3E2B]"
          >
            Proyectos
          </Link>
          <Link 
            href="/nosotros" 
            onClick={() => setIsOpen(false)}
            className="text-sm tracking-widest uppercase font-medium text-[#1F1F1F]/80 hover:text-[#5A3E2B]"
          >
            Nosotros
          </Link>

          <div className="pt-4 border-t border-[#D8C7B4]/60 space-y-3">
            <Link
              href="/carrito"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between w-full bg-[#1F1F1F] text-[#F5EFE7] px-5 py-3 rounded-full text-xs font-sans tracking-wider uppercase hover:bg-[#5A3E2B] transition-all shadow-sm"
            >
              <span>Ver Carrito de Compras</span>
              <span className="font-bold">🛒 {totalItems > 0 && `(${totalItems})`}</span>
            </Link>

            <a 
              href="https://wa.me/message/D6QREGANQXL3O1" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full text-center border border-[#1F1F1F] text-[#1F1F1F] px-5 py-3 rounded-full text-xs font-sans tracking-wider uppercase hover:bg-[#1F1F1F] hover:text-[#F5EFE7] transition-all shadow-sm"
            >
              Cotiza tu mueble por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}