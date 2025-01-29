import { useState, useEffect } from 'react';
import { MessageSquare, Send, Home, Phone, Calendar, Users, HelpCircle, Search, MapPin, Building2, Heart, Settings, Menu, X, ChevronUp, KeyRound, Train, CalendarDays, FileQuestion, ClipboardList } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendMessage } from '@/lib/chat';
import { config, debugConfig } from '@/lib/config';

function App() {
  const [messages, setMessages] = useState<Array<{type: 'user' | 'ai' | 'system', content: string}>>([]);
  const [input, setInput] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [helpPanelOpen, setHelpPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');

  useEffect(() => {
    const isConfigValid = config.openai.apiKey?.startsWith('sk-') && Boolean(config.openai.assistantId);
    setApiConfigured(isConfigValid);
    debugConfig();
    
    setMessages([{
      type: 'system',
      content: isConfigValid 
        ? 'Hello! I\'m your MHA Digital Assistant. How can I help you today?'
        : 'Demo Mode: The AI assistant is not configured. The interface is functional but responses are simulated. To enable AI features, please configure your OpenAI API key and Assistant ID.'
    }]);
  }, []);

  const handleMessageUpdate = (content: string) => {
    setCurrentResponse(content);
    setMessages(prev => {
      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];
      
      if (lastMessage && lastMessage.type === 'ai') {
        lastMessage.content = content;
      } else {
        newMessages.push({ type: 'ai', content });
      }
      
      return newMessages;
    });
  };

  const commonQuestions = [
    {
      icon: <KeyRound className="h-5 w-5 mr-2 flex-shrink-0 text-[#1C6280]" />,
      text: "How do I reset my password?"
    },
    {
      icon: <Train className="h-5 w-5 mr-2 flex-shrink-0 text-[#1C6280]" />,
      text: "What is the travel expenses policy?"
    },
    {
      icon: <FileQuestion className="h-5 w-5 mr-2 flex-shrink-0 text-[#1C6280]" />,
      text: "How do I submit a support ticket?"
    },
    {
      icon: <ClipboardList className="h-5 w-5 mr-2 flex-shrink-0 text-[#1C6280]" />,
      text: "Where can I find the latest HR policies?"
    }
  ];

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const userMessage = input.trim();
      setInput('');
      setIsLoading(true);
      setCurrentResponse('');
      setMessages(prev => [...prev, {type: 'user', content: userMessage}]);

      try {
        if (apiConfigured) {
          await sendMessage(userMessage, handleMessageUpdate);
        } else {
          // Demo mode response
          await new Promise(resolve => setTimeout(resolve, 1000));
          handleMessageUpdate('This is a demo response. To enable real AI responses, please configure your OpenAI API key and Assistant ID.');
        }
      } catch (error) {
        handleMessageUpdate('I apologize, but I encountered an error. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen h-screen bg-[#f5f5f5] flex overflow-hidden">
      {/* Mobile Menu Toggle */}
      <Button
        variant="ghost"
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-[#C6007E] hover:bg-[#a30068]"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div className={`
        fixed md:sticky top-0 left-0 h-full bg-[#C6007E] text-white p-6 md:w-72 flex flex-col
        transform transition-transform duration-300 ease-in-out z-40
        ${menuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 mb-8 bg-white p-4 rounded-lg mt-12 md:mt-0">
          <div className="flex items-center gap-2">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 bg-[#C6007E] rounded-r-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full ml-3"></div>
              </div>
            </div>
            <span className="text-[#1C6280] font-bold text-3xl">mha</span>
          </div>
          <span className="text-[#1C6280] font-bold text-lg text-center">iSPoC Digital Assistant</span>
        </div>
        
        <nav className="space-y-2 flex-1 overflow-y-auto">
          <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-[#a30068]">
            <Home className="mr-3 h-5 w-5" />
            <span>Dashboard</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-[#a30068]">
            <MessageSquare className="mr-3 h-5 w-5" />
            <span>Messages</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-[#a30068]">
            <MapPin className="mr-3 h-5 w-5" />
            <span>Find Services</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-[#a30068]">
            <Building2 className="mr-3 h-5 w-5" />
            <span>Care Homes</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-[#a30068]">
            <Users className="mr-3 h-5 w-5" />
            <span>Community Support</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-[#a30068]">
            <Heart className="mr-3 h-5 w-5" />
            <span>Wellbeing Services</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-[#a30068]">
            <Phone className="mr-3 h-5 w-5" />
            <span>Contact</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-[#a30068]">
            <Calendar className="mr-3 h-5 w-5" />
            <span>Appointments</span>
          </Button>
        </nav>
        
        <div className="pt-4 mt-4 border-t border-[#a30068]">
          <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-[#a30068]">
            <Search className="mr-3 h-5 w-5" />
            <span>Search</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-[#a30068]">
            <HelpCircle className="mr-3 h-5 w-5" />
            <span>Help & Support</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:text-white hover:bg-[#a30068]">
            <Settings className="mr-3 h-5 w-5" />
            <span>Settings</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col h-full overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-6 h-full relative">
          {/* Chat Area */}
          <Card className="flex-1 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden mt-12 md:mt-0">
            {/* Chat Header */}
            <div className="bg-[#1C6280] text-white p-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-[#C6007E] rounded-r-full flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-white rounded-full ml-2"></div>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">iSPoC Digital Assistant</h2>
                  <p className="text-sm opacity-80">Available 24/7 to assist you</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-[#C6007E] text-white'
                          : 'bg-[#E5F0F8] text-gray-800'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bg-[#E5F0F8] text-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="flex-1"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSend} 
                  className="bg-[#C6007E] hover:bg-[#a30068]"
                  disabled={isLoading}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </Card>

          {/* Desktop Help Panel */}
          <div className="hidden lg:flex lg:w-80 flex-col gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-[#1C6280] mb-4">Common Questions</h3>
              <div className="space-y-1">
                {commonQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto normal-case font-normal hover:bg-[#E5F0F8] text-gray-700 px-3 py-2"
                    onClick={() => setInput(question.text)}
                    disabled={isLoading}
                  >
                    {question.icon}
                    <span className="flex-1">{question.text}</span>
                  </Button>
                ))}
              </div>
            </Card>
            
            <Card className="p-4 bg-[#E5F0F8] text-sm text-gray-600">
              <p className="leading-relaxed">
                This AI assistant is designed to provide general information and guidance. While we strive for accuracy, please verify critical information through official channels. For urgent matters, contact your supervisor or HR directly.
              </p>
            </Card>
          </div>

          {/* Mobile Help Panel */}
          <div 
            className={`
              fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-xl 
              transform transition-transform duration-300 ease-in-out
              lg:hidden z-30
              ${helpPanelOpen ? 'translate-y-0' : 'translate-y-[calc(100%-2.5rem)]'}
            `}
          >
            <Button
              variant="ghost"
              className="w-full h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-t-xl"
              onClick={() => setHelpPanelOpen(!helpPanelOpen)}
            >
              <ChevronUp className={`h-5 w-5 transform transition-transform ${helpPanelOpen ? 'rotate-180' : ''}`} />
            </Button>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              <h3 className="text-lg font-semibold text-[#1C6280] mb-4">Common Questions</h3>
              <div className="space-y-1 mb-4">
                {commonQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto normal-case font-normal hover:bg-[#E5F0F8] text-gray-700 px-3 py-2"
                    onClick={() => {
                      setInput(question.text);
                      setHelpPanelOpen(false);
                    }}
                    disabled={isLoading}
                  >
                    {question.icon}
                    <span className="flex-1">{question.text}</span>
                  </Button>
                ))}
              </div>
              <div className="p-4 bg-[#E5F0F8] rounded-lg text-sm text-gray-600">
                <p className="leading-relaxed">
                  This AI assistant is designed to provide general information and guidance. While we strive for accuracy, please verify critical information through official channels. For urgent matters, contact your supervisor or HR directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;