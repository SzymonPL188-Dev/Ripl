import "./Message.css";

import { useState, useEffect } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { auth } from "./App";

export interface MessageData {
  content: string;
  sender: string;
  senderImage: string;
  timestamp: number;
  bot: boolean;
}

function formatNumber(num: number) {
  if(num < 10)
    return `0${num}`;
  return `${num}`;
}

interface MessageProps extends MessageData {
  showTop: boolean;
  system: boolean;
}

export default function Message(props: MessageProps) {
  let [ userIcon, setUserIcon ] = useState("https://ripl-filestorage.szymonpl188.repl.co/default");
  let [ mentioned, setMentioned ] = useState(false);
  
  let date: Date = new Date(props.timestamp);

  let hour = formatNumber(date.getHours());
  let minute = formatNumber(date.getMinutes());
  let formattedTime = `${hour}:${minute}`;
  
  let day = formatNumber(date.getDate());
  let month = formatNumber(date.getMonth() + 1);
  let year = formatNumber(date.getFullYear()).slice(-2);
  let formattedDate = `${day}/${month}/${year}`;

  let formattedTimestamp = `${formattedTime} ${formattedDate}`;

  
  
  useEffect(() => {
    if(props.senderImage) {
      setUserIcon(props.senderImage);
    }
  }, []);

  if(props.timestamp + 2000 > Date.now() && !mentioned) {
    setMentioned(true);
    if(!auth) return document.getElementById("message").play();
    if(props.content.includes("@"+auth!.name)) {
      document!.getElementById("mention")!.play();
    } else {
      document!.getElementById("message")!.play();
    }
  }

  let tagged = `message`;
  
  if(!auth.name) {
    tagged = `message${props.content.includes("@"+auth!.name)?" tagged":""}`;
  }
  
  return (
    <div className={tagged}>
      {
        props.showTop?(
          <div className="messageTop">
            <p className="messageSender"><img src={userIcon} />@{props.sender} {props.system?<code className="system">System</code>:null} {props.bot?<code className="bot">Bot</code>:null}</p>
            <p className="messageTimestamp">{formattedTimestamp}</p>
          </div>
          ):(null)
      }
      <ReactMarkdown skipHtml={true} 
        remarkPlugins={[remarkGfm]} 
        className="messageContent">
        {props.content}
      </ReactMarkdown>
    </div>
  )
}

export function FakeMessage(props: MessageProps) {
  let [ userIcon, setUserIcon ] = useState("https://ripl-filestorage.szymonpl188.repl.co/default");
  
  let date: Date = new Date(props.timestamp);

  let hour = formatNumber(date.getHours());
  let minute = formatNumber(date.getMinutes());
  let formattedTime = `${hour}:${minute}`;
  
  let day = formatNumber(date.getDate());
  let month = formatNumber(date.getMonth() + 1);
  let year = formatNumber(date.getFullYear()).slice(-2);
  let formattedDate = `${day}/${month}/${year}`;

  let formattedTimestamp = `${formattedTime} ${formattedDate}`;
  
  useEffect(() => {
    if(props.senderImage) {
      setUserIcon(props.senderImage);
    }
  }, []);

  
  return (
    <div className={"message bottom"}>
      {
        props.showTop?(
          <div className="messageTop">
            <p className="messageSender"><img src={userIcon} />@{props.sender} {props.system?<code className="system">System</code>:null} {props.bot?<code className="bot">Bot</code>:null}</p>
            <p className="messageTimestamp">{formattedTimestamp}</p>
          </div>
          ):(null)
      }
      <ReactMarkdown skipHtml={true} 
        remarkPlugins={[remarkGfm]} 
        className="messageContent">
        {props.content}
      </ReactMarkdown>
    </div>
  )
}