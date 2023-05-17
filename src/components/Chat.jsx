import React, { useEffect, useState } from 'react'
import { db, auth } from '../firebase-config'
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore'
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom"

const Chat = () => {

    const { roomName } = useParams();
    const [text, setText] = useState("");
    const [displayMessages, setDisplayMessages] = useState([]);
    const navigate = useNavigate();

    const messageRef = collection(db, "messages");

    useEffect(() => {
        const queryMessages = query(messageRef, where("roomName", "==", roomName), orderBy("createdAt"))

        const unsuscribe = onSnapshot(queryMessages, (snapshot) => {
            let messages = [];
            snapshot.forEach((doc) => {
                messages.push({ ...doc.data(), id: doc.id });
            });
            setDisplayMessages(messages);
        });

        return () => unsuscribe();
    }, [roomName])

    const sendMessage = async (event) => {
        event.preventDefault();
        if (text === "") return;

        await addDoc(messageRef, {
            text,
            createdAt: serverTimestamp(),
            user: auth.currentUser.displayName,
            roomName: roomName,
            email: auth.currentUser.email,
            pic: auth.currentUser.photoURL,

        })

        setText("");
    }

    return (


        <div className='container'>
            <div className='chat'>
                <div>
                    <button className='homeButton' onClick={() => navigate(-1)}>Go Back Home</button>
                </div>

                <h2 className='roomName'>room name: {roomName}</h2>

                <div>
                    {displayMessages.map((msg) => {
                        return <div className='eachMessage' key={msg.id}>
                            <img src={msg.pic} alt="" className='profilePic' />
                            <h4 className='userName'>{msg.user}</h4 >
                            <p className='userMessage'> {msg.text}</p>
                        </div>
                    })}
                </div>

                <div>
                    <form onSubmit={sendMessage}>
                        <input
                            type="text"
                            name="message"
                            className='message-input'
                            id="message"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder='Type your message'
                        />
                        <button type="submit" className='message-send'> 🚀 Send</button>
                    </form>
                </div>

            </div>
        </div>
    )
}

export default Chat;
