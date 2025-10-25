
import { GoogleGenAI } from "@google/genai";
import type { Invoice, Customer } from '../types';

// Assume process.env.API_KEY is configured in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateWhatsAppReminder = async (invoice: Invoice, customer: Customer, businessName: string): Promise<string> => {
  if (!API_KEY) {
    // Return a default message if API key is not available
    return `Hello ${customer.name}, your invoice #${invoice.invoice_number} of ₹${invoice.totalAmount.toFixed(2)} is due on ${invoice.dueDate.toLocaleDateString()}. Kindly clear the payment. - ${businessName}`;
  }

  const prompt = `
    Generate a polite and professional WhatsApp payment reminder message.
    The message should follow this exact format:
    "Hello {{customer_name}}, your invoice #{{invoice_number}} of ₹{{amount}} is due on {{due_date}}. Kindly clear the payment. - {{business_name}}"

    Here is the information:
    - Customer Name: "${customer.name}"
    - Invoice Number: "${invoice.invoice_number}"
    - Amount: "${invoice.totalAmount.toFixed(2)}"
    - Due Date: "${invoice.dueDate.toLocaleDateString('en-GB')}"
    - Business Name: "${businessName}"
    
    Do not add any extra text or explanation. Only output the final message.
  `;
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error generating reminder with Gemini:", error);
    // Fallback to template on API error
    return `Hello ${customer.name}, your invoice #${invoice.invoice_number} of ₹${invoice.totalAmount.toFixed(2)} is due on ${invoice.dueDate.toLocaleDateString()}. Kindly clear the payment. - ${businessName}`;
  }
};
