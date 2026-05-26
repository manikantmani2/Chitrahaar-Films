import React from 'react';
import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData =
  | { success: boolean; message: string }
  | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { clientName, email, phone, serviceType, projectDetails, budget, timeline } = req.body;

    // Validate required fields
    if (!clientName || !email || !phone || !serviceType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Store booking data (you can save to database or email)
    const bookingData = {
      clientName,
      email,
      phone,
      serviceType,
      projectDetails,
      budget,
      timeline,
      timestamp: new Date(),
    };

    // Log for demonstration (replace with actual storage)
    console.log('New Booking:', bookingData);

    // Send confirmation email or save to database here

    res.status(200).json({ success: true, message: 'Booking request submitted successfully' });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to process booking' });
  }
}
