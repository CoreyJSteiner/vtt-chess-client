import './Chat.css'
import { KeyboardEvent, useState, useRef, useEffect } from 'react'

type ChatProps = {
    messages: Array<string>,
    submitMsgHandler: (input: string) => void
}

const Chat: React.FC<ChatProps> = ({ messages, submitMsgHandler }) => {
    const [input, setInput] = useState<string>('')
    const messageEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const sendInput = () => {
        setInput('')
        submitMsgHandler(input)
    }

    const handleEnterKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            sendInput()
        }
    }

    return (
        <div id='chat'>
            <ul id="chat-list">
                {
                    messages.map((message: string, index: number) =>
                        <li key={index}>{message}</li>
                    )
                }
                <div ref={messageEndRef} />
            </ul>
            <div id='chat-input-container'>
                <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleEnterKeyDown} />
                <button onClick={sendInput}>Send</button>
            </div>
        </div>
    )
}

export default Chat