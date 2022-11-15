import Message, { MessageData } from "./Message";
import { useState, useEffect, createRef } from 'react';
import ChatBox from './ChatBox';
import { ReplitUserData } from "./Replit";
import Connection from './socket/connection';

export interface ChatProps {
  authData: ReplitUserData
}

export let addMessage: (data: MessageData) => void = (data: MessageData) => {};
export let setMessage: (data: MessageData[]) => void = (data: MessageData[]) => {};

export default function Chat(props: ChatProps) {
  const [ messages, setMessages ] = useState<MessageData[]>([]);
  const [ connection, setConnection ] = useState<Connection|null>(null);

  let messageContainerRef = createRef<HTMLDivElement>();
  
  useEffect(() => {
    messageContainerRef.current!.scrollTo(0, messageContainerRef.current!.scrollHeight);
    addMessage = (data: MessageData) => {
      let messagesClone = [...messages];
            
      messagesClone.push(data);

      if(messagesClone.length > 200) {
        messagesClone.splice(0, 25);
      }
      
      setMessages(messagesClone);
    }
    setMessage = setMessages;
  }, [ messages ]);

  useEffect(() => {
    setConnection(new Connection());
  }, []);
  
  return (
    <div>
      <div id="messageContainer" ref={messageContainerRef}>
        <p id="top">This is the top. The previous messages got deleted</p>
        {
          messages.map((message, index, array) => {
            let showTop = true;
            if(index !== 0) {
              if(array[index - 1].sender === message.sender && array[index - 1].timestamp < message.timestamp + 60000)
                showTop = false;
            }
            let system = false;
            if(message.sender === "Ripl") system = true;
            return (
              <Message 
                sender={message.sender} 
                content={message.content} 
                timestamp={message.timestamp} 
                senderImage={message.senderImage}
                system={system}
                bot={message.bot}
                showTop={showTop}/>
            )
          })
        }
        <br />
        <br />
        <br />
        <br />
      </div>
      <ChatBox authData={props.authData} />
    </div>
  )
}