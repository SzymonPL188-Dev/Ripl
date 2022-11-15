import { LoginWithReplit } from "./Replit";
import { showLoader } from "./App";
import { FakeMessage } from "./Message";

import "./Auth.css";

export default function Auth() {
  showLoader(false);
  return (
    <div id="auth">
      <FakeMessage 
        sender={"Ripl"} 
        content={"# Welcome to Ripl"} 
        timestamp={Date.now()} 
        senderImage={"https://ripl-filestorage.szymonpl188.repl.co/logo"}
        system={true}
        bot={false}
        showTop={true}/>
      <div id="authButton">
        <p>Authenticate with Replit to continue</p>
        <button onClick={() => LoginWithReplit()}> Login </button>
      </div>
    </div>
  )
}