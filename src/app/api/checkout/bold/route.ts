import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { totalCarrito, orderId } = await request.json();

    if (!totalCarrito || totalCarrito <= 0) {
      return NextResponse.json({ error: 'El monto no es válido' }, { status: 400 });
    }

    // 1. Datos para la orden
    const reference = orderId || `ORD-${Date.now()}`;
    const amount = totalCarrito;
    const currency = 'COP';
    const secretKey = process.env.BOLD_INTEGRITY_SECRET || '';

    // 2. Generar el hash de integridad si tu integración en Bold lo requiere (SHA-256)
    // Cadena estándar: reference + amount + currency + secretKey
    const stringToHash = `${reference}${amount}${currency}${secretKey}`;
    const integritySignature = crypto
      .createHash('sha256')
      .update(stringToHash)
      .digest('hex');

    // 3. Petición a la API de Bold para generar la orden/checkout
    const response = await fetch('https://integrations.api.bold.co/online/link/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.BOLD_API_KEY || '',
      },
      body: JSON.stringify({
        description: 'Compra en Acomódate Muebles',
        reference: reference,
        amount: amount,
        currency: currency,
        integrity_signature: integritySignature,
        redirection_url: 'https://acomodate-cliente--acomodate-muebles.us-east4.hosted.app/', // Ajusta tu URL de retorno
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error de Bold API:', data);
      return NextResponse.json({ error: data.message || 'Error al conectar con Bold' }, { status: response.status });
    }

    // Retornamos la URL de pago generada
    return NextResponse.json({ url: data.payload.url || data.url });
  } catch (error) {
    console.error('Error interno en checkout:', error);
    return NextResponse.json({ error: 'Error procesando la solicitud' }, { status: 500 });
  }
}