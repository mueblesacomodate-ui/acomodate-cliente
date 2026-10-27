import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { cart, totalCarrito } = await request.json();

    // Aquí haces el llamado fetch a la API de Bold usando tu Secret Key
    const response =キュリティ = await fetch('https://api.bold.co/v1/payment-link', {
      method: 'POST',
      headers: {
        'Authorization:': `Bearer ${process.env.BOLD_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: totalCarrito,
        currency: 'COP',
        description: 'Compra en Acomódate Muebles',
        // otros parámetros que exija la documentación actual de Bold
      }),
    });

    const data = await response.json();

    return NextResponse.json({ url: data.payment_link });
  } catch (error) {
    return NextResponse.json({ error: 'Error al conectar con Bold' }, { status: 500 });
  }
}