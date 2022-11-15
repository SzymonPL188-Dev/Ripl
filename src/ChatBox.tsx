import "./ChatBox.css";
import { MessageData } from "./Message";
import { useState, useEffect } from "react";
import { ReplitUserData } from "./Replit";
import { auth, setPopup } from "./App";
import { CONNECTION_INSTANCE } from "./socket/connection";
import { addMessage } from "./Chat";
import Filter from "bad-words";

const filter = new Filter({ placeHolder: '@'});

export let setMuted: (set: boolean) => void = (set: boolean) => {}

interface ChatBoxProps {
  authData: ReplitUserData
}

function isMessageValid(message: string) {
  let valid = true;

  let formatted = message.replaceAll(" " , "").toLowerCase();

  if(message.length > 300) {
    setPopup({
      title: "Message too long",
      message: `Your message is too long. Please shorten it. (${message.length}/300 characters)`
    });
  }
  
  if (formatted.length < 1 || message.length > 300) {
    valid = false;
  }
  
  return valid;
}

function emojify(text: string) {
  text = text.replaceAll(":)", "😀");
  text = text.replaceAll(":(", "🙁");
  text = text.replaceAll(":-)", "😀");
  text = text.replaceAll(":-(", "🙁");
  text = text.replaceAll(":smile:", "😀");
  text = text.replaceAll(":frown:", "🙁");
  text = text.replaceAll(":happy:", "😀");
  text = text.replaceAll(":sad:", "🙁");
  text = text.replaceAll(":nerd:", "🤓");
  text = text.replaceAll(":ice:", "🥶");
  return text;
}

// const toBase64 = (file: File) => new Promise((resolve, reject) => {
//   try {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = error => reject(error);
//   } catch(e) {
//     setPopup({
//       title: "Error",  
//       message: "There was an error while uploading the image."
//     });
//   }
// });

// function importData() {
//   let input = document.createElement('input');
//   input.type = 'file';
//   input.accept = "image/jpg";
//   input.onchange = async () => {
//     try {
//       let file = Array.from(input.files as ArrayLike<File>)[0];
//       if (file) {
//         let base64 = await toBase64(file);
//         CONNECTION_INSTANCE!.socket.emit("image", base64);
//       }
//     } catch(e) {
//       setPopup({
//         title: "Error",  
//         message: "There was an error while uploading the image."
//       });
//     }
//   };
//   input.click();
// }

export default function ChatBox(props: ChatBoxProps) {
  const [ muted, updateMuted ] = useState(false);

  useEffect(() => {
    setMuted = updateMuted;
  }, [ muted ]);
  
  return (
    <div>
      <input placeholder="Say Something!" className="chatbox"
        disabled={muted}
        onKeyPress={(e) => {
            if (e.key === "Enter") {
              if(!isMessageValid(e.target.value)) return;

              let val = e.target.value;

              e.target.value = "";
              
              addMessage({
                sender: props.authData.name,
                content: filter.clean(emojify(val)),
                timestamp: Date.now(),
                senderImage: String(auth?.profileImage),
                bot: false
              });
  
              CONNECTION_INSTANCE!.socket.emit("message", emojify(val));
            }
        }} />
      </div>
  )
}