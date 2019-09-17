import './Chat.css';
import 'chat-bubble/component/styles/input.css';
import 'chat-bubble/component/styles/reply.css';
import 'chat-bubble/component/styles/says.css';
import 'chat-bubble/component/styles/setup.css';
import 'chat-bubble/component/styles/typing.css';

import { Bubbles, prepHTML } from 'chat-bubble/component/Bubbles.js';
import React from 'react';

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

    chatWindow.talk(
      // pass your JSON/JavaScript object to `.talk()` function where
      // you define how the conversation between the bot and user will go
      {
        // "ice" (as in "breaking the ice") is a required conversation object
        // that maps the first thing the bot will say to the user
        "ice": {

          // "says" defines an array of sequential bubbles
          // that the bot will produce
          "says": ["Hey!", "Can I have a banana?"],

          // "reply" is an array of possible options the user can pick from
          // as a reply
          "reply": [
            {
              "question": "🍌",  // label for the reply option
              "answer": "banana",  // key for the next conversation object
            }
          ]
        }, // end required "ice" conversation object

        // another conversation object that can be queued from within
        // any other conversation object, including itself
        "banana": {
          "says": ["Thank you!", "Can I have another banana?"],
          "reply": [
            {
              "question": "🍌🍌",
              "answer": "banana"
            }
          ]
        } // end conversation object
      } // end conversation object
    );
  }

  render() {
    return <div id="chat" className="Chat"></div>
  }
}

