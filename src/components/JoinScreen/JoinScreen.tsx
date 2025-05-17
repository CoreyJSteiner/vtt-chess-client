import './JoinScreen.css'
import { useState, KeyboardEvent } from 'react'

type JoinScreenProps = {
    joinHandler: (username: string, roomanme: string) => void
}

const JoinScreen: React.FC<JoinScreenProps> = ({ joinHandler }) => {
    const [inputUsername, setInputUsername] = useState<string>('')
    const [inputRoomname, setInputRoomname] = useState<string>('')

    const handleEnterKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            joinHandler(inputUsername, inputRoomname)
        }
    }

    return (
        <div id='join-screen'>
            <input
                id='input-username'
                type='text'
                onChange={(e) => setInputUsername(e.target.value)}
                value={inputUsername}
                onKeyDown={handleEnterKeyDown} />
            <input
                id='input-roomname'
                type='text'
                onChange={(e) => setInputRoomname(e.target.value)}
                value={inputRoomname}
                onKeyDown={handleEnterKeyDown} />
            <button id='join-button' onClick={() => joinHandler(inputUsername, inputRoomname)}>
                Join
            </button>
        </div>
    )
}

export default JoinScreen
