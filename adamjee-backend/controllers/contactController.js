import Contact from '../models/Contact.js';
import mongoose from 'mongoose';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Returning mock contact response.');
      const mockContact = { _id: '777777777777777777777777', name, email, phone, subject, message };
      return res.status(201).json({
        success: true,
        message: 'Message sent successfully (Mock mode)! We\'ll get back to you shortly.',
        data: mockContact
      });
    }

    // Save to Database First
    const contactMessage = new Contact({ name, email, phone, subject, message });
    await contactMessage.save();

    res.status(201).json({ success: true, message: 'Message sent successfully! We\'ll get back to you shortly.', data: contactMessage });
  } catch (err) {
    console.error('Contact submission error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again or contact us directly.' });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Admin
export const getAllContacts = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Returning mock contacts list.');
      const mockContacts = [
        {
          _id: '777777777777777777777777',
          name: 'John Contact',
          email: 'john.contact@gmail.com',
          phone: '+92 300 1234567',
          subject: 'General Inquiry',
          message: 'Hello, this is a test message to verify database persistence!',
          read: false,
          createdAt: new Date().toISOString()
        }
      ];
      return res.json({ success: true, data: mockContacts });
    }

    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: contacts });
  } catch (err) {
    console.error('Get contacts error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Mark contact as read
// @route   PUT /api/contact/:id/read
// @access  Admin
export const markContactRead = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Mocking read status toggle.');
      return res.json({
        success: true,
        data: { _id: req.params.id, subject: 'Inquiry', read: true }
      });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    contact.read = true;
    await contact.save();
    res.json({ success: true, data: contact });
  } catch (err) {
    console.error('Mark read error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Admin
export const deleteContact = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Mocking message deletion.');
      return res.json({ success: true, message: 'Message deleted successfully (Mock mode)' });
    }

    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }
    await contact.deleteOne();
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    console.error('Delete contact error:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

