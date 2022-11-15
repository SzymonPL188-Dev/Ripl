import io from "socket.io-client";
import { auth, setPopup } from "../App";
import { MessageData } from "../Message";
import { addMessage, setMessage } from "../Chat";
import { PopupProps } from "../popup/Popup";
import { setMuted } from "../ChatBox";
import { showLoader } from "../App";

export let CONNECTION_INSTANCE: Connection | undefined;

let queue: MessageData[] = [];

setInterval(() => {
  if(queue.length > 0) {
    let data = queue.shift() as MessageData;
    addMessage(data);
  }
}, 10);

export default class Connection {
  socket: any;
  constructor() {
    if(CONNECTION_INSTANCE) return;
    CONNECTION_INSTANCE = this;

    showLoader(true);
    
    this.socket = io("https://Ripl-API.szymonpl188.repl.co/", 
                     {
                       query: {
                         auth: JSON.stringify(auth)
                       }
                     });
    
    this.socket.on('connect', async () => {
      console.log('Connected!');
    });

    this.socket.on('message', async (data: MessageData) => {
      queue.push(data);
    });
    
    this.socket.on("messages", (messages: MessageData[]) => {
      setMessage(messages);
      showLoader(false);
    });

    this.socket.on("mute", async (mute: boolean) => {
      setMuted(mute)
    });

    this.socket.on("alert", (data: PopupProps) => {
      setPopup(data);
    });
  }
}