import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Send, User, Check, CheckCheck, Paperclip, X, Edit2, Trash2, Image as ImageIcon, File } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
  edited_at: string | null;
  order_id: string | null;
  attachments: string[] | null;
  profiles?: {
    username: string;
    avatar_url: string | null;
  };
}

interface MessageListProps {
  orderId: string | null;
  otherUserId: string;
}

export const MessageList = ({ orderId, otherUserId }: MessageListProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [editContent, setEditContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to real-time messages
    const channelName = orderId ? `messages:${orderId}` : `messages:${user?.id}-${otherUserId}`;
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as Message;
          // Only add message if it's relevant to this conversation
          const isRelevant = orderId 
            ? newMessage.order_id === orderId
            : newMessage.order_id === null && 
              ((newMessage.sender_id === user?.id && newMessage.receiver_id === otherUserId) ||
               (newMessage.sender_id === otherUserId && newMessage.receiver_id === user?.id));
          
          if (isRelevant) {
            setMessages(prev => [...prev, newMessage]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const updatedMessage = payload.new as Message;
          setMessages(prev => 
            prev.map(msg => msg.id === updatedMessage.id ? updatedMessage : msg)
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const deletedId = payload.old.id;
          setMessages(prev => prev.filter(msg => msg.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, otherUserId, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      markMessagesAsRead();
    }
  }, [messages, user]);

  const markMessagesAsRead = async () => {
    if (!user) return;
    
    try {
      const unreadMessages = messages.filter(
        msg => msg.receiver_id === user.id && !msg.read_at
      );
      
      if (unreadMessages.length === 0) return;
      
      const { error } = await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .in('id', unreadMessages.map(m => m.id));
        
      if (error) throw error;
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const fetchMessages = async () => {
    if (!user) return;
    
    try {
      let query = supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (orderId) {
        query = query.eq('order_id', orderId);
      } else {
        // For pre-order chat, get messages between current user and other user
        query = query
          .is('order_id', null)
          .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setMessages(data || []);
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + selectedFiles.length > 5) {
      toast.error('Maximum 5 files allowed');
      return;
    }
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];
    
    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user!.id}/${Date.now()}-${Math.random()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('message-attachments')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('message-attachments')
          .getPublicUrl(fileName);

        uploadedUrls.push(publicUrl);
        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }
    } catch (error: any) {
      toast.error('Failed to upload files');
      throw error;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }

    return uploadedUrls;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && selectedFiles.length === 0) || !user) return;

    setSending(true);

    try {
      const attachmentUrls = await uploadFiles();

      const { error } = await supabase
        .from('messages')
        .insert({
          order_id: orderId,
          sender_id: user.id,
          receiver_id: otherUserId,
          content: newMessage.trim() || '📎 Attachment',
          attachments: attachmentUrls.length > 0 ? attachmentUrls : null,
        });

      if (error) throw error;

      setNewMessage('');
      setSelectedFiles([]);
    } catch (error: any) {
      toast.error('Failed to send message');
      console.error(error);
    } finally {
      setSending(false);
    }
  };

  const handleEditMessage = async () => {
    if (!editingMessage || !editContent.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({
          content: editContent.trim(),
          edited_at: new Date().toISOString(),
        })
        .eq('id', editingMessage.id);

      if (error) throw error;

      toast.success('Message updated');
      setEditingMessage(null);
      setEditContent('');
      fetchMessages();
    } catch (error: any) {
      toast.error('Failed to update message');
      console.error(error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      toast.success('Message deleted');
      fetchMessages();
    } catch (error: any) {
      toast.error('Failed to delete message');
      console.error(error);
    }
  };

  const isImageUrl = (url: string) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-3 md:p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((message) => {
              const isOwn = message.sender_id === user?.id;
              return (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 group ${isOwn ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={message.profiles?.avatar_url || undefined} />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
                    <div className="relative">
                      <div
                        className={`rounded-lg px-3 md:px-4 py-2 ${
                          isOwn
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm break-words">{message.content}</p>
                        
                        {/* Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {message.attachments.map((url, idx) => (
                              <div key={idx}>
                                {isImageUrl(url) ? (
                                  <a href={url} target="_blank" rel="noopener noreferrer">
                                    <img
                                      src={url}
                                      alt="Attachment"
                                      className="max-w-[200px] rounded cursor-pointer hover:opacity-80"
                                    />
                                  </a>
                                ) : (
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-2 rounded bg-background/10 hover:bg-background/20"
                                  >
                                    <File className="h-4 w-4" />
                                    <span className="text-xs truncate">Attachment {idx + 1}</span>
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      {/* Edit/Delete buttons for own messages */}
                      {isOwn && (
                        <div className="absolute top-0 right-0 -mr-16 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => {
                              setEditingMessage(message);
                              setEditContent(message.content);
                            }}
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => handleDeleteMessage(message.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className={`flex items-center gap-1 text-xs text-muted-foreground mt-1`}>
                      <span>
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {message.edited_at && (
                        <span className="italic">(edited)</span>
                      )}
                      {isOwn && (
                        <>
                          {message.read_at ? (
                            <CheckCheck className="h-3 w-3 text-primary" aria-label="Read" />
                          ) : (
                            <Check className="h-3 w-3" aria-label="Sent" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="border-t p-3 md:p-4">
        {/* File previews */}
        {selectedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="relative group">
                {file.type.startsWith('image/') ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="h-20 w-20 object-cover rounded"
                  />
                ) : (
                  <div className="h-20 w-20 bg-muted rounded flex items-center justify-center">
                    <File className="h-8 w-8" />
                  </div>
                )}
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 opacity-0 group-hover:opacity-100"
                  onClick={() => removeSelectedFile(idx)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Upload progress */}
        {uploading && (
          <div className="mb-2">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,application/pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={sending || uploading}
            className="min-w-[44px] min-h-[44px] flex-shrink-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={sending || uploading}
            className="min-h-[44px]"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={sending || uploading || (!newMessage.trim() && selectedFiles.length === 0)}
            className="min-w-[44px] min-h-[44px] flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>

      {/* Edit Dialog */}
      <Dialog open={!!editingMessage} onOpenChange={(open) => !open && setEditingMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Edit your message..."
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingMessage(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditMessage}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
