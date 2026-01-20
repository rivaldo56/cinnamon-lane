import React, { useState, useEffect, useRef } from 'react';
import { createChefChat, GroqChatSession } from '../services/groqService';
import { Product } from '../types';

interface ChatBotProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatBot: React.FC<ChatBotProps> = ({ products, onAddToCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Bon jour! I am Chef Amara. The ovens are warm and the cinnamon is fragrant today. How may I assist you with your selection?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<GroqChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Chat Session
  useEffect(() => {
    if (products.length > 0 && !chatSessionRef.current) {
      chatSessionRef.current = createChefChat(products);
    }
  }, [products]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      let response = await chatSessionRef.current.sendMessage({ message: userMsg });
      
      // Handle Function Calls (The loop handles multiple tool calls if needed, though usually one per turn)
      while (response.functionCalls && response.functionCalls.length > 0) {
        const functionCalls = response.functionCalls;
        const functionResponses = [];

        for (const call of functionCalls) {
          if (call.name === 'addToCart') {
            const args = call.args as any;
            const productName = args.productName;
            const quantity = args.quantity || 1;

            // Find product
            const product = products.find(p => p.name.toLowerCase().includes(productName.toLowerCase()));

            if (product) {
               // Execute Action
               onAddToCart(product, quantity);
               functionResponses.push({
                 id: call.id,
                 name: call.name,
                 response: { result: `Successfully added ${quantity} ${product.name}(s) to the cart.` }
               });
            } else {
               functionResponses.push({
                 id: call.id,
                 name: call.name,
                 response: { result: `Error: Could not find product named ${productName}.` }
               });
            }
          }
        }

        // Send function response back to model to get the final text response
        if (functionResponses.length > 0) {
           response = await chatSessionRef.current.sendToolResponse({
             functionResponses: functionResponses
           });
        }
      }

      // Add Model Response
      if (response.text) {
        setMessages(prev => [...prev, { role: 'model', text: response.text }]);
      }

    } catch (error: any) {
      console.error("Chat Error", error);
      
      let errorText = "My apologies, the kitchen is quite loud right now. Could you repeat that?";
      
      // Handle Quota Limits specifically
      if (
        error?.status === 429 || 
        error?.code === 429 || 
        error?.message?.includes('429') || 
        error?.message?.includes('quota') ||
        error?.status === 'RESOURCE_EXHAUSTED'
      ) {
         errorText = "I am currently assisting too many customers. Please allow me a moment (Rate Limit Reached).";
      }

      setMessages(prev => [...prev, { role: 'model', text: errorText }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${isOpen ? 'rotate-90 bg-stone-800 text-white' : 'bg-cinnamon text-white'}`}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] md:w-96 h-[500px] bg-cream rounded-2xl shadow-2xl z-50 flex flex-col border border-stone-200 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-coffee p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <span className="text-xl">👩‍🍳</span>
            </div>
            <div>
              <h3 className="text-white font-serif font-bold text-lg leading-none">Chef Amara</h3>
              <p className="text-white/60 text-xs uppercase tracking-widest mt-1">Cinnamon Lane</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-cinnamon text-white rounded-br-none' 
                      : 'bg-white text-coffee border border-stone-100 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-stone-100 p-3 rounded-2xl rounded-bl-none shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-stone-300 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-stone-100">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask for recommendations..."
                rows={1}
                className="w-full pr-10 pl-4 py-3 bg-stone-100 border-none rounded-xl focus:ring-2 focus:ring-cinnamon/20 focus:bg-white transition-all text-coffee placeholder-stone-400 resize-none overflow-hidden"
                style={{ minHeight: '44px' }}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cinnamon hover:text-coffee disabled:opacity-30 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      )}
    </>
  );
};

export default ChatBot;