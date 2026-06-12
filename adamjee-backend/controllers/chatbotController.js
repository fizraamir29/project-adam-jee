import OpenAI from 'openai';
import mongoose from 'mongoose';
import ChatSession from '../models/ChatSession.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
// A simple unique ID generator replacing the 'uuid' package
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Initialized dynamically to prevent ESM hoisting issues
let openaiClient;
const getOpenAI = () => {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    const isOpenRouter = apiKey && apiKey.startsWith('sk-or-');
    openaiClient = new OpenAI({
      apiKey,
      ...(isOpenRouter && { baseURL: 'https://openrouter.ai/api/v1' }),
      defaultHeaders: {
        'HTTP-Referer': 'https://adamjeecomputers.com',
        'X-Title': 'Adamjee Computers',
      }
    });
  }
  return openaiClient;
};

// Build system prompt with live product & policy context
const buildSystemPrompt = async () => {
  let productList = '';
  if (mongoose.connection.readyState === 1) {
    try {
      const products = await Product.find({ isPublished: true }).select('name price category stock tag').limit(20);
      productList = products.map(p => `- ${p.name} | $${p.price} | ${p.category} | ${p.stock > 0 ? 'In Stock' : 'Out of Stock'}`).join('\n');
    } catch (err) {
      console.error('Error fetching live products:', err.message);
    }
  }

  if (!productList) {
    productList = `- Gaming PC Extreme | $1500 | Desktops | In Stock
- Ryzen 5 Pro Setup | $800 | Desktops | In Stock
- Razer DeathAdder Mouse | $60 | Peripherals | In Stock
- Corsair Mechanical Keyboard | $120 | Peripherals | In Stock
- ASUS ROG Swift Monitor | $450 | Monitors | In Stock`;
  }

  return `You are AdamBot, the AI-powered customer support assistant for Adamjee Computers — a premium tech and gaming hardware store in Pakistan.

PERSONALITY: Friendly, knowledgeable, professional. Respond in the same language the customer uses (English or Urdu).

STORE POLICIES:
- Warranty: 1 year on all products
- Returns: 7-day return window from delivery date
- Payments: Credit/Debit Card, Bank Transfer, Cash on Delivery (COD)
- Delivery: 3-5 business days nationwide
- Support: Mon-Sat 9am-6pm | WhatsApp: +92 300 0000000

CURRENT PRODUCT CATALOGUE:
${productList}

INSTRUCTIONS:
1. Always be helpful and concise (3-4 sentences max per response)
2. For product recommendations, suggest from the catalogue above
3. For order tracking, ask for order ID (format: ORD-XXXX)
4. If you cannot resolve an issue, offer to escalate to a human agent via WhatsApp or email
5. Never make up information not in this prompt
6. Format prices in USD unless customer asks for PKR (1 USD = 278 PKR)`;
};

// @desc    Send message to AI chatbot
// @route   POST /api/chatbot/message
// @access  Public
export const sendMessage = async (req, res) => {
  try {
    const { message, sessionId: providedSessionId } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const sessionId = providedSessionId || uuidv4();

    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database disconnected. Returning mock chatbot completion.');
      const systemPrompt = await buildSystemPrompt();
      const recentMessages = [{ role: 'user', content: message }];
      
      const apiKey = process.env.OPENAI_API_KEY;
      const isOpenRouter = apiKey && apiKey.startsWith('sk-or-');
      const modelToUse = isOpenRouter ? 'openrouter/free' : 'gpt-4o-mini';

      const completion = await getOpenAI().chat.completions.create({
        model: modelToUse,
        messages: [
          { role: 'system', content: systemPrompt },
          ...recentMessages,
        ],
        max_tokens: 300,
        temperature: 0.7,
      });

      const botReply = completion.choices[0].message.content;
      return res.json({ success: true, message: botReply, sessionId, escalated: false });
    }

    // Find or create session
    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      session = await ChatSession.create({
        sessionId,
        user: req.user?.id || null,
        messages: [],
      });
    }

    // Add user message to session
    session.messages.push({ role: 'user', content: message });

    // Check for order status query
    const orderMatch = message.match(/ORD-\d+/i);
    if (orderMatch) {
      const order = await Order.findOne({ orderId: orderMatch[0].toUpperCase() });
      if (order) {
        const botReply = `I found your order **${order.orderId}**! Here's the status:\n\n📦 Status: **${order.orderStatus.toUpperCase()}**\n💰 Total: $${order.total}\n${order.trackingNumber ? `🚚 Tracking: ${order.trackingNumber}` : ''}`;
        session.messages.push({ role: 'assistant', content: botReply });
        await session.save();
        return res.json({ success: true, message: botReply, sessionId });
      }
    }

    // Build OpenAI conversation context (last 10 messages for context window)
    const systemPrompt = await buildSystemPrompt();
    const recentMessages = session.messages.slice(-10).map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));

    const apiKey = process.env.OPENAI_API_KEY;
    const isOpenRouter = apiKey && apiKey.startsWith('sk-or-');
    const modelToUse = isOpenRouter ? 'openrouter/free' : 'gpt-4o-mini';

    const completion = await getOpenAI().chat.completions.create({
      model: modelToUse,
      messages: [
        { role: 'system', content: systemPrompt },
        ...recentMessages,
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const botReply = completion.choices[0].message.content;

    // Detect escalation need
    const escalationKeywords = ['human', 'agent', 'whatsapp', 'call', 'speak to someone', 'talk to person'];
    const needsEscalation = escalationKeywords.some(k => message.toLowerCase().includes(k));
    if (needsEscalation) {
      session.escalatedToHuman = true;
      session.escalationReason = message;
    }

    session.messages.push({ role: 'assistant', content: botReply });
    await session.save();

    res.json({ success: true, message: botReply, sessionId, escalated: needsEscalation });
  } catch (err) {
    console.error('Chatbot error:', err.message);

    // Graceful fallback if OpenAI fails
    const fallback = "I'm having a little trouble connecting right now. Please reach us directly:\n📱 WhatsApp: +92 300 0000000\n📧 Email: support@adamjeecomputers.com";
    res.json({ success: true, message: fallback, sessionId: req.body.sessionId });
  }
};

// @desc    Get chat analytics (Admin)
// @route   GET /api/chatbot/analytics
// @access  Admin
export const getChatAnalytics = async (req, res) => {
  try {
    const [totalSessions, resolvedSessions, escalatedSessions, recentSessions] = await Promise.all([
      ChatSession.countDocuments(),
      ChatSession.countDocuments({ resolved: true }),
      ChatSession.countDocuments({ escalatedToHuman: true }),
      ChatSession.find().sort({ createdAt: -1 }).limit(10).select('sessionId messages escalatedToHuman createdAt'),
    ]);

    res.json({
      success: true,
      analytics: {
        totalSessions,
        resolvedSessions,
        escalatedSessions,
        resolutionRate: totalSessions > 0 ? ((resolvedSessions / totalSessions) * 100).toFixed(1) : 0,
        recentSessions,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
