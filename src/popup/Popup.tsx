import "./Popup.css";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { setPopup } from "../App"

export interface PopupProps {
  title: string;
  message: string;
}

export default function Popup(props: PopupProps) {
  return(
    <div className="popup">
      <h1 className="popupTitle">{props.title}</h1>
      <ReactMarkdown skipHtml={true} 
        remarkPlugins={[remarkGfm]} 
        className="popupMessage">
        {props.message}
      </ReactMarkdown>
      <button className="popupButton" onClick={() => setPopup(null)}>Ok!</button>
    </div>
  )
}