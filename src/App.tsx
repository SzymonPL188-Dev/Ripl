import './App.css';
import Chat from "./Chat";
import Auth from "./Auth";
import { useState, useEffect } from 'react';
import { getUserInfo, ReplitUserData } from './Replit';
import Popup, { PopupProps } from './popup/Popup';
import Settings from "./Settings";

export let auth: ReplitUserData | null = null;

export let setPopup: (popup: PopupProps | null) => void = (popup: PopupProps | null) => {}

export let showLoader: (show: boolean) => void = () => {}

export default function App() {
  let [ authData, setAuth ] = useState<ReplitUserData | null>(null);
  let [ loading, setLoading ] = useState<boolean>(true);
  let [ loader, setLoader ] = useState<boolean>(true);
  let [ popup, updatePopup ] = useState<PopupProps | null>(null);

  let [ settingsOpen, setSettingsOpen ] = useState<boolean>(false);
  
  useEffect(() => {
    (async () => {
      let resp = await getUserInfo();
      
      setAuth(resp);
      
      auth = resp;

      setLoading(false);
    })();

    setPopup = (popup: PopupProps | null) => {
      if(popup) {
        document.getElementById("popup")!.play();
      }
     updatePopup(popup); 
    }

    showLoader = setLoader;
  }, []);
  
  return (
    <main>
      { loader?(<div id="loader"></div>):null }
      {
        loading?null:(authData?<Chat authData={authData} />:<Auth />)
      }
      {
        popup?(<div className="popupBG"><Popup message={popup!.message} title={popup!.title} /></div>):null
      }
      { settingsOpen?<Settings />:null }
    </main>
    // <img src="/settings.png" id="settings" onClick={() => setSettingsOpen(!settingsOpen)} />
  )
}