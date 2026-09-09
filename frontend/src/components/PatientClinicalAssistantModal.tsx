import React, { useState, useRef, useEffect } from 'react';
import { AiChatMessage } from '../types';
import { api } from '../services/api';

interface PatientClinicalAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: string, id?: string) => void;
  onOpenMultiDrug?: () => void;
}

export const PatientClinicalAssistantModal: React.FC<PatientClinicalAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenMultiDrug
}) => {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome_msg',
      sender: 'assistant',
      text: `Hello! I'm your **genericMed 24/7 Clinical Assistant**.\n\nI can help you:\n• Find FDA AB-rated generic equivalents and calculate direct cash savings\n• Explain dosage guidelines & food administration instructions\n• Check for multi-drug interactions\n• Connect you with our cleanroom pharmacist network\n\nHow can I help you today?`,
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'Compare Lipitor vs Atorvastatin', actionType: 'VIEW_DRUG', payload: 'med-1' },
        { label: 'Check Drug Interactions', actionType: 'CHECK_INTERACTION' },
        { label: 'How much can I save on Generics?', actionType: 'NAVIGATE', payload: 'customer-search' }
      ],
      fdaDisclaimerIncluded: true
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isSending) return;

    const userMsg: AiChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSending(true);

    try {
      const reply = await api.sendPatientChatMessage(
        text,
        messages.map((m) => ({ sender: m.sender, text: m.text }))
      );
      setMessages((prev) => [...prev, reply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: `I apologize, but I encountered a temporary connection issue. You can safely explore generic medicines in our catalog or speak directly with an on-call dispensing pharmacist.`,
          timestamp: 'Just now',
          suggestedActions: [
            { label: 'Search Generic Medicines', actionType: 'NAVIGATE', payload: 'customer-search' },
            { label: 'Call On-Call Pharmacist', actionType: 'CALL_PHARMACIST' }
          ],
          fdaDisclaimerIncluded: true
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleActionClick = (action: NonNullable<AiChatMessage['suggestedActions']>[0]) => {
    if (action.actionType === 'CHECK_INTERACTION') {
      onClose();
      if (onOpenMultiDrug) onOpenMultiDrug();
    } else if (action.actionType === 'VIEW_DRUG' && action.payload) {
      onClose();
      if (onNavigate) onNavigate('customer-drug-detail', action.payload);
    } else if (action.actionType === 'NAVIGATE' && action.payload) {
      onClose();
      if (onNavigate) onNavigate(action.payload);
    } else if (action.actionType === 'CALL_PHARMACIST') {
      alert('Connecting to 24/7 Verified Pharmacist Hotline: 1-800-555-GMED (Toll-Free)');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-surface border-l sm:border border-outline-variant/30 sm:rounded-2xl w-full max-w-lg h-full sm:h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-outline-variant/20 bg-surface-container/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/15 text-primary flex items-center justify-center border border-primary/20">
                <span className="material-symbols-outlined text-xl">smart_toy</span>
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-surface"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-on-surface">Rx Clinical Assistant</h3>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-primary/10 text-primary border border-primary/20">
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 24/7 FDA Bioequivalence & Safety Support
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setMessages([messages[0]]);
              }}
              title="Clear Conversation"
              className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-lg">restart_alt</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-container-lowest">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-sm">smart_toy</span>
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isUser
                        ? 'bg-primary text-on-primary rounded-tr-xs shadow-xs'
                        : 'bg-surface border border-outline-variant/30 text-on-surface rounded-tl-xs shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line prose-xs">
                      {msg.text}
                    </div>

                    <div
                      className={`text-[10px] mt-1.5 flex items-center justify-end ${
                        isUser ? 'text-on-primary/70' : 'text-on-surface-variant'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* Suggested Quick Actions */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedActions.map((act, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(act)}
                          className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface border border-primary/30 text-primary hover:bg-primary/10 transition-colors shadow-2xs flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">arrow_forward</span>
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-surface border border-outline-variant/30 rounded-tl-xs text-xs flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-sm animate-spin text-primary">progress_activity</span>
                Consulting clinical bioequivalence database...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-outline-variant/20 bg-surface">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about generic equivalents, interactions, or dosage..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-on-surface-variant/60"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSending}
              className="w-9 h-9 rounded-xl bg-primary text-on-primary hover:bg-primary-hover transition-colors flex items-center justify-center disabled:opacity-40 shrink-0 shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">send</span>
            </button>
          </form>
          <p className="text-[10px] text-center text-on-surface-variant/70 mt-2">
            AI medical guidance is informational. For emergencies, contact 911 or your primary care physician.
          </p>
        </div>
      </div>
    </div>
  );
};
