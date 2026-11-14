import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { totalCarrito, orderId, customerEmail } = await request.json();

    if (!totalCarrito || totalCarrito <= 0) {
      return NextResponse.json({ error: 'El monto no es válido' }, { status: 400 });
    }

    // 1. Datos para la orden
    const reference = orderId || `ORD-${Date.now()}`;
    const amount = Number(totalCarrito); // Asegurar que sea número
    const currency = 'COP';
    const secretKey = process.env.BOLD_INTEGRITY_SECRET || '';

    // 2. Generar el hash de integridad SHA-256
    // El orden estándar en Bold es: reference + amount + currency + secretKey
    const stringToHash = `${reference}${amount}${currency}${secretKey}`;
    const integritySignature = crypto
      .createHash('sha256')
      .update(stringToHash)
      .digest('hex');

    // 3. Petición a la API de Bold para generar el link de pago
    const response = await fetch('https://integrations.api.bold.co/online/link/v1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.BOLD_API_KEY || '',
      },
      body: JSON.stringify({
        amount_type: 'CLOSE', // Indicamos que es un monto fijo/cerrado
        description: 'Compra en Acomódate Muebles',
        reference: reference,
        amount: amount,
        currency: currency,
        integrity_signature: integritySignature,
        callback_url: 'https://acomodate-cliente--acomodate-muebles.us-east4.hosted.app/checkout/respuesta', // URL de retorno tras el pago
        payer_email: customerEmail || 'cliente@acomodatemuebles.com',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error de Bold API:', data);
      return NextResponse.json(
        { error: data.message || 'Error al conectar con la pasarela de pagos Bold' },
        { status: response.status }
      );
    }

    // 4. Extraer la URL de pago de la respuesta de Bold (puede venir en payload.url o payload.payment_link)
    const paymentUrl = data.payload?.url || data.payload?.payment_link;

    if (!paymentUrl) {
      console.error('La respuesta de Bold no contenía una URL válida:', data);
      return NextResponse.json({ error: 'No se pudo generar el enlace de pago' }, { status: 500 });
    }

    // Retornamos la URL generada hacia el cliente
    return NextResponse.json({ url: paymentUrl });
  } catch (error) {
    console.error('Error interno en checkout de Bold:', error);
    return NextResponse.json({ error: 'Error procesando la solicitud de pago' }, { status: 500 });
  }
}