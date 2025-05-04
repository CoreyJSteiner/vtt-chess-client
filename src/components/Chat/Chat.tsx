import './Chat.css'
import { useState } from 'react'

type ChatProps = {
    messages: Array<string>,
    submitMsgHandler: (input: string) => void
}

const Chat: React.FC<ChatProps> = ({messages, submitMsgHandler}) => {
    const [input, setInput] = useState<string>('')

    const handleClick = () => {
        submitMsgHandler(input)
    }

    return(
        <div id='chat'>
            <ul>
                {
                messages.map((message: string, index: number) =>
                    <li key={ index }>{ message }</li>
                )
                }
            </ul>
            <div id='chat-input-container'>
                <textarea value={input} onChange={(e) => setInput(e.target.value)}/>
                <button onClick={handleClick}>Send</button>
            </div>
        </div>
    )
}

export default Chat