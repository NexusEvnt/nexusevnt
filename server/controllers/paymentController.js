import stripePackage from 'stripe';
import mongoose from 'mongoose';
import Event from '../models/eventsModel.js';
import Ticket from '../models/ticketsModel.js';

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

export const createPaymentSession = async (req, res) => {
  const { ticket_id } = req.body;

   // console.log('Received ticket_id:', ticket_id, 'Type:', typeof ticket_id);

  try {
    const ticket = await Ticket.findById(ticket_id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

     // console.log('Ticket Data:', ticket);
     // console.log('Event ID:', ticket.event_id, 'Type:', typeof ticket.event_id);

    const event = await Event.findById(ticket.event_id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Find the selected ticket tier 
    const tier_type = ticket.tier_type;
    const quantity = ticket.quantity;
    const selectedTier = event.ticket_tiers.find(
      (tier) => tier.tier_type === tier_type
    );
    if (!selectedTier) {
      return res.status(400).json({ message: 'Invalid ticket tier selected' });
    }

    // Check availability
    if (selectedTier.available_tickets < quantity) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }

    if (!ticket.event_id || !ticket.tier_type || !ticket.quantity) {
      return res.status(400).json({ message: 'Invalid ticket metadata' });
    }    

    // Calculate total price (NOT NEEDED)
    const total = selectedTier.tier_price * quantity; // Convert to cents
    console.log("Total Amount For Strpe Checkout", total)
    const taxRate = 0.07; // 7% tax
    const tax = Math.round(total * taxRate); // Calculate tax in cents
    const total_calculated_plus_tax = total + tax;

     console.log("Amount To Pay + Tax", total_calculated_plus_tax);     
     
    // console.log('CREATING STRIPE CHECKOUT SESSION...');
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${event.event_name} - ${tier_type} Ticket`,
              description: `${event.event_description}`,
            },
            unit_amount: selectedTier.tier_price * 100, // Price in cents
          },
          quantity: quantity,
        },
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Tax',
            },
            unit_amount: tax * 100, // Price in cents
          },
          quantity: 1,
        },
      ],
      // automatic_tax: { enabled: true },
      mode: 'payment',
      // success_url: `http://localhost:3000/success`,
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      // cancel_url: `http://localhost:3000/cancel`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        event_id: ticket.event_id,
        ticket_id: ticket_id,
        tier_type: tier_type,
        quantity: quantity,
      }, // Include metadata for post-payment processing
    });

    res.status(200).json({ session });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating payment session',
      error: error.message,
    });
  }
};

export const handlePaymentSuccess = async (session) => {
   //console.log(`HANDLE PAYMENT SUCCESSS CALLED`);

  const sessionDetails = session.metadata; // Retrieve metadata passed during session creation
  const { event_id, ticket_id, tier_type, quantity } = sessionDetails; // Extract metadata values

  // Start Mongoose transaction
  const sessionDb = await mongoose.startSession();
  sessionDb.startTransaction();

  try {
    // Fetch the event with the session
    const event = await Event.findById(event_id).session(sessionDb);
    if (!event) throw new Error('Event not found');

    const ticket = await Ticket.findById(ticket_id).session(sessionDb);
    if (!ticket) throw new Error('Ticket not found');

    // Find the ticket tier
    const tierIndex = event.ticket_tiers.findIndex(
      (tier) => tier.tier_type === tier_type
    );
    if (tierIndex === -1) throw new Error('Ticket tier not found');

    // Validate ticket availability
    if (event.ticket_tiers[tierIndex].available_tickets < quantity) {
      throw new Error('Not enough tickets available');
    }

    // Deduct tickets atomically
    event.ticket_tiers[tierIndex].available_tickets -= quantity;
    ticket.payment_status = 'Paid';

    // Save the updated event within the transaction
    await event.save({ session: sessionDb });

    // Save the updated ticket within the transaction
    await ticket.save({ session: sessionDb });

    // Commit the transaction
    await sessionDb.commitTransaction();
    sessionDb.endSession();

//     console.log('PAYMENT PROCESSED SUCCESSFULLY. (TICKET AND EVENT UPDATED)');
  } catch (error) {
    // Rollback transaction in case of error
    await sessionDb.abortTransaction();
    sessionDb.endSession();
    console.error('Error processing payment:', error.message);
  }
};

export const handlePaymentFailure = async (session) => {
  console.log(`HANDLE PAYMENT FAILURE CALLED`);

  const sessionDetails = session.metadata; // Metadata from PaymentIntent
  const { ticket_id } = sessionDetails; // Extract metadata values

  // Start a Mongoose transaction
  const sessionDb = await mongoose.startSession();
  sessionDb.startTransaction();

  try {
    // Fetch the Ticket
    const ticket = await Ticket.findById(ticket_id).session(sessionDb);
    if (!ticket) throw new Error('Ticket not found');

    if (ticket.payment_status !== 'Pending') {
      throw new Error('Ticket is not in a pending state');
    }

    // Update ticket status to failed
    ticket.payment_status = 'Failed';

    // Save the updated ticket within the transaction
    await ticket.save({ session: sessionDb });

    // Commit the transaction
    await sessionDb.commitTransaction();
    sessionDb.endSession();

    console.log('Payment failure handled: tickets marked as failed.');
  } catch (error) {
    // Rollback transaction in case of error
    await sessionDb.abortTransaction();
    sessionDb.endSession();

    console.error('Error handling payment failure:', error.message);
  }
};

export const getPaymentStatus = async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      return res.status(200).json({ status: 'Paid', session: session });
    } else {
      return res.status(200).json({ status: session.payment_status }); // 'unpaid', 'pending'
    }
  } catch (error) {
    console.error('Error fetching payment status:', error.message);
    return res.status(500).json({
      message: 'Failed to fetch payment status',
      error: error.message,
    });
  }
};
