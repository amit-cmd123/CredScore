import React, { useState, useRef, useEffect } from 'react';
import UserLayout from '../components/UserLayout';
import { MessageSquare, PhoneCall, Mail, ChevronDown, ChevronUp, X, Send, Bot, User, CheckCircle2 } from 'lucide-react';
import { createNotification } from '../utils/dataStore';

const FAQs = [
  {
    q: "How long does the loan approval process take?",
    a: "Typically, our AI-driven initial underwriting takes seconds. However, if manual review is required, our human underwriters will process your application within 1-2 business days."
  },
  {
    q: "Will applying for a loan affect my credit score?",
    a: "Checking your rates via our pre-qualification tool uses a 'soft pull' and does not affect your score. Only a final formal application triggers a 'hard pull', which may temporarily lower your score by a few points."
  },
  {
    q: "How do I update my income or employment information?",
    a: "You can update your personal details in the 'Settings' > 'Profile' tab. However, active loan applications will require you to raise a support ticket to modify the submitted data."
  },
  {
    q: "Can I pay off my loan early without penalties?",
    a: "Yes! CredScore has a strict zero prepayment penalty policy. You can pay off your principal amount at any time without incurring any additional interest or fees."
  },
  {
    q: "What factors determine my interest rate?",
    a: "Your interest rate is dynamically calculated by our AI based on your credit score, debt-to-income (DTI) ratio, employment history, and the requested loan purpose."
  },
  {
    q: "Is my personal data secure?",
    a: "Absolutely. We use bank-level AES-256 encryption for all data storage, and strict role-based access control. Check out the Settings tab to enable Two-Factor Authentication (2FA)."
  },
  {
    q: "How do I download my monthly statements?",
    a: "Navigate to the 'Reports' page in your dashboard, where you can generate and download comprehensive PDF statements for your active accounts."
  }
];

const QUICK_REPLIES = [
  "Check Loan Status",
  "How to apply?",
  "Speak to human"
];

const UserSupport = () => {
  const [openFAQ, setOpenFAQ] = useState(0);
  
  const getCurrentTime = () => new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! I am the CredScore AI assistant. How can I help you today?', time: getCurrentTime() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  
  // Ticket State
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [isTicketSubmitting, setIsTicketSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('credscore_current_user') || '{}');
  const chatEndRef = useRef(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? -1 : index);
  };
  
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping, isChatOpen]);

  const processUserMessage = (messageText) => {
    const newMsg = { sender: 'user', text: messageText, time: getCurrentTime() };
    setChatMessages(prev => [...prev, newMsg]);
    setIsTyping(true);
    setShowQuickReplies(false);
    
    // Simulate AI response
    setTimeout(() => {
      let botResponse = "I'm sorry, I didn't quite catch that. Could you rephrase your question?";
      const lowerInput = messageText.toLowerCase();
      
      if (lowerInput.includes('loan') || lowerInput.includes('apply')) {
        botResponse = "You can apply for a new loan by navigating to the 'Loan Application' tab on the left sidebar. Our AI will give you an instant decision!";
      } else if (lowerInput.includes('score') || lowerInput.includes('credit')) {
        botResponse = "Your credit score is calculated deterministically based on your active loans and payment history. You can view your detailed breakdown in the 'Credit Score' tab.";
      } else if (lowerInput.includes('password') || lowerInput.includes('settings')) {
        botResponse = "You can change your password and update your profile details by going to 'Settings'.";
      } else if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        botResponse = "Hello there! How can I assist you with your CredScore account today?";
      } else if (lowerInput.includes('human') || lowerInput.includes('agent')) {
        botResponse = "I am an AI assistant. If you need to speak to a human, please call our support line at 1-800-CRED-SCORE or raise an email ticket.";
      } else if (lowerInput.includes('status')) {
        botResponse = "You can view the real-time status of your active loans in the 'Decision Center' tab.";
      }
      
      setChatMessages(prev => [...prev, { sender: 'bot', text: botResponse, time: getCurrentTime() }]);
      setIsTyping(false);
      
      // Optionally show quick replies again after a response
      setTimeout(() => setShowQuickReplies(true), 2000);
    }, 1500);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const currentInput = chatInput;
    setChatInput('');
    processUserMessage(currentInput);
  };

  const handleQuickReply = (reply) => {
    processUserMessage(reply);
  };

  const handleRaiseTicket = (e) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) return;
    
    setIsTicketSubmitting(true);
    
    setTimeout(async () => {
      try {
        await createNotification('Admin', 'ALL', `New Support Ticket: ${ticketSubject}`, `${currentUser.name} raised a ticket: ${ticketDesc.substring(0, 50)}...`, 'warning');
        await createNotification('User', currentUser.id, 'Support Ticket Received', `Your ticket "${ticketSubject}" has been received. Our team will contact you shortly.`, 'success');
      } catch (err) {
        console.error(err);
      }
      
      setIsTicketSubmitting(false);
      setTicketSuccess(true);
      
      setTimeout(() => {
        setIsTicketModalOpen(false);
        setTicketSuccess(false);
        setTicketSubject('');
        setTicketDesc('');
      }, 2000);
    }, 1000);
  };

  return (
    <UserLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#FFFFFF] mb-2 tracking-tight">Help & Support</h1>
        <p className="text-[#94A3B8]">We are here to help. Reach out or browse our common FAQs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div onClick={() => setIsChatOpen(true)} className="bg-[#101B57] p-8 rounded-2xl border border-[#1E2A68] flex flex-col items-center text-center hover:border-[#3B82F6]/50 transition-colors group cursor-pointer">
          <div className="w-16 h-16 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center text-[#3B82F6] mb-4 group-hover:bg-[#3B82F6] group-hover:text-[#FFFFFF] transition-colors">
            <MessageSquare size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#FFFFFF] mb-2">Live Chat</h3>
          <p className="text-[#94A3B8] text-sm mb-4">Chat with our AI customer support team in real-time.</p>
          <button className="mt-auto px-6 py-2 bg-[#050B2D] border border-[#1E2A68] text-[#FFFFFF] font-medium rounded-xl group-hover:bg-[#3B82F6] group-hover:border-[#3B82F6] transition-colors">
            Start Chat
          </button>
        </div>

        <div className="bg-[#101B57] p-8 rounded-2xl border border-[#1E2A68] flex flex-col items-center text-center hover:border-[#10B981]/50 transition-colors group cursor-pointer">
          <div className="w-16 h-16 rounded-2xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981] mb-4 group-hover:bg-[#10B981] group-hover:text-[#FFFFFF] transition-colors">
            <PhoneCall size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#FFFFFF] mb-2">Phone Support</h3>
          <p className="text-[#94A3B8] text-sm mb-4">Call us directly. Available Mon-Fri, 9am - 6pm EST.</p>
          <button className="mt-auto px-6 py-2 bg-[#050B2D] border border-[#1E2A68] text-[#FFFFFF] font-medium rounded-xl group-hover:bg-[#10B981] group-hover:border-[#10B981] transition-colors">
            1-800-CRED-SCORE
          </button>
        </div>

        <div onClick={() => setIsTicketModalOpen(true)} className="bg-[#101B57] p-8 rounded-2xl border border-[#1E2A68] flex flex-col items-center text-center hover:border-[#FACC15]/50 transition-colors group cursor-pointer">
          <div className="w-16 h-16 rounded-2xl bg-[#FACC15]/10 flex items-center justify-center text-[#FACC15] mb-4 group-hover:bg-[#FACC15] group-hover:text-[#050B2D] transition-colors">
            <Mail size={32} />
          </div>
          <h3 className="text-lg font-bold text-[#FFFFFF] mb-2">Email Ticket</h3>
          <p className="text-[#94A3B8] text-sm mb-4">Raise a support ticket and we will respond within 24 hours.</p>
          <button className="mt-auto px-6 py-2 bg-[#050B2D] border border-[#1E2A68] text-[#FFFFFF] font-medium rounded-xl group-hover:bg-[#FACC15] group-hover:text-[#050B2D] group-hover:border-[#FACC15] transition-colors">
            Raise Ticket
          </button>
        </div>
      </div>

      <div className="bg-[#101B57] rounded-2xl p-8 border border-[#1E2A68]">
        <h2 className="text-xl font-bold text-[#FFFFFF] mb-6 border-b border-[#1E2A68] pb-4">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {FAQs.map((faq, index) => (
            <div 
              key={index} 
              onClick={() => toggleFAQ(index)}
              className={`bg-[#050B2D] border rounded-xl p-5 cursor-pointer transition-colors ${openFAQ === index ? 'border-[#3B82F6]/50' : 'border-[#1E2A68] hover:border-[#1E2A68]/80'}`}
            >
              <div className="flex justify-between items-center">
                <h4 className={`font-medium transition-colors ${openFAQ === index ? 'text-[#3B82F6]' : 'text-[#FFFFFF]'}`}>{faq.q}</h4>
                {openFAQ === index ? <ChevronUp className="text-[#3B82F6]" size={20} /> : <ChevronDown className="text-[#94A3B8]" size={20} />}
              </div>
              {openFAQ === index && (
                <p className="text-[#94A3B8] text-sm mt-3 leading-relaxed animate-fade-in-up">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* AI Chat Modal */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[550px] bg-[#050B2D] border border-[#1E2A68] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex flex-col z-50 animate-fade-in-up overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#101B57] to-[#1E2A68] p-4 border-b border-[#1E2A68] flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FFFFFF] rounded-full flex items-center justify-center text-[#3B82F6] shadow-inner relative">
                <Bot size={20} />
                <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-[#101B57] rounded-full bg-[#10B981]"></span>
              </div>
              <div>
                <h3 className="text-[#FFFFFF] font-bold text-sm tracking-tight">CredScore Support AI</h3>
                <p className="text-[#10B981] text-xs font-medium">Online & Ready</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 rounded-full bg-[#050B2D]/50 flex items-center justify-center text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-[#050B2D] transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-[#050B2D]">
            {chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-[#3B82F6] text-[#FFFFFF]' : 'bg-[#1E2A68] text-[#FFFFFF]'}`}>
                    {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className={`p-3.5 text-[0.9rem] leading-relaxed ${msg.sender === 'user' ? 'bg-[#3B82F6] text-[#FFFFFF] rounded-2xl rounded-tr-sm shadow-[0_4px_15px_rgba(59,130,246,0.3)]' : 'bg-[#101B57] text-[#E2E8F0] border border-[#1E2A68] rounded-2xl rounded-tl-sm shadow-sm'}`}>
                      {msg.text}
                    </div>
                    {msg.time && (
                      <span className={`text-[0.65rem] text-[#94A3B8] ${msg.sender === 'user' ? 'text-right pr-1' : 'text-left pl-1'}`}>
                        {msg.time}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start animate-fade-in-up">
                <div className="flex gap-3 max-w-[80%] flex-row">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#1E2A68] text-[#FFFFFF] shadow-sm">
                    <Bot size={14} />
                  </div>
                  <div className="p-4 rounded-2xl bg-[#101B57] border border-[#1E2A68] rounded-tl-sm flex items-center gap-1.5 shadow-sm h-11">
                    <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            {!isTyping && showQuickReplies && (
              <div className="flex flex-wrap gap-2 justify-end pt-2 animate-fade-in-up">
                {QUICK_REPLIES.map((reply, index) => (
                  <button 
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="text-xs px-3 py-1.5 bg-[#101B57] border border-[#3B82F6]/30 hover:border-[#3B82F6] hover:bg-[#3B82F6]/10 text-[#3B82F6] rounded-full transition-colors font-medium"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-[#101B57] border-t border-[#1E2A68] shrink-0">
            <form onSubmit={handleSendMessage} className="relative">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask me anything..." 
                className="w-full bg-[#050B2D] border border-[#1E2A68] rounded-full pl-5 pr-14 py-3.5 text-sm text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none shadow-inner placeholder:text-[#94A3B8]"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10">
                <button 
                  type="submit" 
                  disabled={!chatInput.trim() || isTyping}
                  className="w-9 h-9 bg-[#3B82F6] rounded-full flex items-center justify-center text-[#FFFFFF] hover:bg-[#2563EB] transition-colors disabled:opacity-40 shadow-sm"
                >
                  <Send size={15} className="-ml-0.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Raise Ticket Modal */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 bg-[#050B2D]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101B57] p-8 rounded-2xl border border-[#1E2A68] max-w-lg w-full animate-fade-in-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-[#FFFFFF]">Submit a Support Ticket</h3>
              <button onClick={() => !isTicketSubmitting && setIsTicketModalOpen(false)} className="text-[#94A3B8] hover:text-[#FFFFFF] transition-colors">
                <X size={24} />
              </button>
            </div>
            
            {ticketSuccess ? (
              <div className="py-8 flex flex-col items-center text-center">
                <CheckCircle2 size={64} className="text-[#10B981] mb-4" />
                <h4 className="text-xl font-bold text-[#FFFFFF] mb-2">Ticket Submitted Successfully</h4>
                <p className="text-[#94A3B8]">Our support team has received your request and will contact you via email within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleRaiseTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    placeholder="Briefly describe your issue" 
                    className="w-full bg-[#09133E] border border-[#1E2A68] rounded-xl px-4 py-3 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#94A3B8] mb-2">Description</label>
                  <textarea 
                    required
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                    className="w-full h-32 bg-[#09133E] border border-[#1E2A68] rounded-xl p-4 text-[#FFFFFF] focus:ring-1 focus:ring-[#3B82F6] outline-none resize-none"
                    placeholder="Please provide as much detail as possible..."
                  ></textarea>
                </div>
                
                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => setIsTicketModalOpen(false)} className="flex-1 py-3 bg-transparent text-[#94A3B8] hover:text-[#FFFFFF] transition-colors font-medium rounded-xl border border-[#1E2A68]">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isTicketSubmitting}
                    className="flex-1 py-3 bg-[#3B82F6] text-[#FFFFFF] rounded-xl font-bold hover:bg-[#2563EB] transition-colors shadow-lg shadow-[#3B82F6]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isTicketSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#FFFFFF]/30 border-t-[#FFFFFF] rounded-full animate-spin"></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Ticket'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </UserLayout>
  );
};

export default UserSupport;
