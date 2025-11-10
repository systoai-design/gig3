import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { MessageSquare, Search, Mail, MailOpen } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageList } from '@/components/MessageList';
import { motion, AnimatePresence } from 'framer-motion';

interface Conversation {
  id: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string | null;
  orderId: string | null;
  gigTitle: string | null;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isUnread: boolean;
}

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchConversations();
      
      // Subscribe to new messages
      const channel = supabase
        .channel('messages-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `receiver_id=eq.${user.id}`,
          },
          () => {
            fetchConversations();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id (id, username, name, avatar_url),
          receiver:receiver_id (id, username, name, avatar_url),
          order:order_id (id, gigs:gig_id (title))
        `)
        .or(`sender_id.eq.${user?.id},receiver_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation
      const conversationMap = new Map<string, Conversation>();
      
      messages?.forEach((msg: any) => {
        const isReceiver = msg.receiver_id === user?.id;
        const otherUser = isReceiver ? msg.sender : msg.receiver;
        const conversationKey = [msg.sender_id, msg.receiver_id].sort().join('-');
        
        if (!conversationMap.has(conversationKey)) {
          conversationMap.set(conversationKey, {
            id: conversationKey,
            otherUserId: otherUser.id,
            otherUserName: otherUser.name || otherUser.username,
            otherUserAvatar: otherUser.avatar_url,
            orderId: msg.order_id,
            gigTitle: msg.order?.gigs?.title || null,
            lastMessage: msg.content,
            lastMessageTime: msg.created_at,
            unreadCount: 0,
            isUnread: isReceiver && !msg.read_at,
          });
        }
        
        // Count unread messages
        const conv = conversationMap.get(conversationKey)!;
        if (isReceiver && !msg.read_at) {
          conv.unreadCount++;
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error: any) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const openConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowDialog(true);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.gigTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = conversations.filter(c => c.unreadCount > 0).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-navbar pt-16 pb-12">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Skeleton className="h-24 w-full" />
              </motion.div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-navbar pt-16 pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Messages</h1>
            {unreadCount > 0 && (
              <p className="text-muted-foreground mt-2">
                You have {unreadCount} unread conversation{unreadCount > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Search */}
        <Card className="border-2 border-border mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Conversations List */}
        {filteredConversations.length === 0 ? (
          <Card className="border-2 border-border">
            <CardContent className="py-12">
              <div className="text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'No conversations found' : 'No messages yet'}
                </p>
                {!searchQuery && (
                  <Button onClick={() => navigate('/explore')}>
                    Browse Services
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredConversations.map((conversation, index) => (
                <motion.div
                  key={conversation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card 
                    className={`border-2 transition-all cursor-pointer ${
                      conversation.unreadCount > 0 
                        ? 'border-primary/40 bg-primary/5 hover:border-primary/60' 
                        : 'border-border hover:border-primary/30'
                    }`}
                    onClick={() => openConversation(conversation)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={conversation.otherUserAvatar || undefined} />
                          <AvatarFallback>
                            {conversation.otherUserName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">
                              {conversation.otherUserName}
                            </h3>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="default" className="h-5 min-w-5 px-1.5">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          
                          {conversation.gigTitle && (
                            <p className="text-xs text-muted-foreground mb-1 truncate">
                              Re: {conversation.gigTitle}
                            </p>
                          )}
                          
                          <p className="text-sm text-muted-foreground truncate">
                            {conversation.lastMessage}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(conversation.lastMessageTime).toLocaleDateString()}
                          </span>
                          {conversation.unreadCount > 0 ? (
                            <Mail className="h-4 w-4 text-primary" />
                          ) : (
                            <MailOpen className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
      <Footer />

      {/* Message Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedConversation?.otherUserAvatar || undefined} />
                <AvatarFallback>
                  {selectedConversation?.otherUserName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div>{selectedConversation?.otherUserName}</div>
                {selectedConversation?.gigTitle && (
                  <div className="text-sm text-muted-foreground font-normal">
                    Re: {selectedConversation.gigTitle}
                  </div>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedConversation && (
            <MessageList
              orderId={selectedConversation.orderId || undefined}
              otherUserId={selectedConversation.otherUserId}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
