import {TextField, Container, Box, Grid, Paper, Button} from '@mui/material';
import React, {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from 'react';
import './App.css';
import noPhoto from './nophoto.png'


type Message = {
    userName: string
    photo: string
    userId: number
    message: string
}

function App() {
    let [message, setMessage] = useState('')
    let [messages, setMessages] = useState<Array<Message>>([])
    let [socket, setSocket] = useState<WebSocket | null>(null)
    const boxRef = useRef<HTMLElement>(null)


    useEffect(() => {
        const socket = new WebSocket(`wss://social-network.samuraijs.com/handlers/ChatHandler.ashx`);
        setSocket(socket);
        socket.onmessage = (event: MessageEvent) => {
            // debugger
            let newMessages = JSON.parse(event.data).reverse()
            setMessages((actualMessages) => [...newMessages, ...actualMessages])
        }
        return () => {
            socket.close()
        }
    }, [])

    const keyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.ctrlKey && e.charCode === 13) {
            socket!.send(e.target.value)
            setMessage('')
        }
    }
    const textareaHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    }
    const sendHandler = () => {
        socket && socket.send(message);
        setMessage('')
    }


    return (
        <Container maxWidth="md" sx={{padding: 2}}>
            <Paper elevation={3}>
                <Box sx={{textAlign: 'center', padding: 2}}>
                    <h2>A simple Chat based on RCA using WebSocket</h2>
                    <p>
                        To join the chat you should get registered <a href="https://social-network.samuraijs.com/"
                                                                      target="_blank"> here</a> (it's important to be
                        sing in social-network.samuraijs.com) <br/>or use common test
                        account credentials: Email: free@samuraijs.com | Password: free
                    </p>
                </Box>
                <main>
                    <Grid container spacing={2}
                          sx={{marginTop: 2, justifyContent: 'center',}}>
                        <Paper elevation={3} sx={{padding: 3}}>
                            <Box sx={{paddingTop: 1, alignItems: 'center',}}>
                                <Box sx={{marginBottom: 2}}>
                                    <TextField
                                        fullWidth
                                        id="outlined-textarea"
                                        label="Message"
                                        placeholder="Type your message"
                                        multiline
                                        onChange={textareaHandler} onKeyPress={keyPressHandler}
                                        value={message}
                                    />
                                </Box>
                                <Box sx={{marginBottom: 2, display: 'flex', justifyContent: 'end'}}>
                                    <Button onClick={sendHandler} size="large" variant="contained">
                                        Send message
                                    </Button>
                                </Box>
                            </Box>
                            <Box ref={boxRef}
                                 sx={{height: 500, overflowY: 'scroll', marginTop: 2, justifyContent: 'center',}}>
                                {messages &&
                                    messages.map((msg, index) => (
                                        <Box key={index} sx={{
                                            display: 'flex', width: 500, margin: '10px 0'
                                        }}>
                                            <Box sx={{marginRight: 2}}>
                                                <img style={{width: '30px'}} src={msg.photo ? msg.photo : noPhoto}/>
                                            </Box>
                                            <Box>
                                                <Box sx={{fontSize: 9}}>{msg.userName}</Box>
                                                <Box>{msg.message}</Box>
                                            </Box>
                                        </Box>
                                    ))}
                                {messages.length === 0 &&
                                    <span style={{color: 'red'}}>You are not authorize. Please sing in social-network.samuraijs.com</span>}
                            </Box>
                        </Paper>
                    </Grid>
                </main>
            </Paper>
        </Container>
    );
}

export default App;
