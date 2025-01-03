import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
  {
    order_id: {
      type: Number,
      required: [true, 'Order ID is required'],
      trim: true,
    },
    attendee_id: {
      type: String,
      required: [true, 'Attendee ID is required'],
      trim: true,
    },
    attendee_full_name: {
      type: String,
      required: [true, 'Attendee Full Name is required'],
      trim: true,
    },
    event_id: {
      type: String,
      required: [true, 'Attendee ID is required'],
      trim: true,
    },
    event_name: {
      type: String,
      required: [true, 'Event Name is required'],
      trim: true,
    },
    event_date: {
      type: Date,
      required: [true, 'Event Date is required'],
      trim: true,
    },
    event_location: {
      type: String,
      required: [true, 'Event Location is required'],
      trim: true,
    },
    event_start_time: {
      type: Number,
      required: [true, 'Event Start Time is required'],
      trim: true,
    },
    event_price: {
      type: Number,
      required: [true, 'Event Price is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model('Ticket', ticketSchema);
export default Ticket;
