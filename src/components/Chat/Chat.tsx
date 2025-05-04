import './Chat.css'
import { KeyboardEvent, useState } from 'react'

type ChatProps = {
    messages: Array<string>,
    submitMsgHandler: (input: string) => void
}

const Chat: React.FC<ChatProps> = ({messages, submitMsgHandler}) => {
    const [input, setInput] = useState<string>('')

    const sendInput = () => {
        setInput('')
        submitMsgHandler(input)
    }

    const handleEnterKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter'){
            sendInput()
        } 
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
                <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleEnterKeyDown}/>
                <button onClick={sendInput}>Send</button>
            </div>
        </div>
    )
}

export default Chat