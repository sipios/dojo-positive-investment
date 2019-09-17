import './Chat.css';
import 'chat-bubble/component/styles/input.css';
import 'chat-bubble/component/styles/reply.css';
import 'chat-bubble/component/styles/says.css';
import 'chat-bubble/component/styles/setup.css';
import 'chat-bubble/component/styles/typing.css';

import { Bubbles, prepHTML } from 'chat-bubble/component/Bubbles.js';
import React from 'react';

import { CONVERSATION } from '../../constant/conversation';

interface ChatDocument extends Document {
  chatWindow?: typeof Bubbles
}

prepHTML({ relative_path: "../node_modules/chat-bubble/" })

export class Chat extends React.Component {
  componentDidMount() {
    const chatDocument: ChatDocument = document
    const chatWindow = new Bubbles(
      document.getElementById('chat'), // ...passing HTML container element...
      "chatWindow", // ...and name of the function as a parameter
    );
    chatDocument.chatWindow = chatWindow;

    chatWindow.talk(CONVERSATION);
  }

  render() {
    return <div id="chat" className="Chat"></div>
  }
}

