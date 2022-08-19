import {TextField, Container, Box, Grid, Paper, Button, CircularProgress} from '@mui/material';
import axios from 'axios';
import React, {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from 'react';
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
    let [auth, setAuth] = useState<boolean>(false);
    let [loading, setLoading] = useState<boolean>(false);
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
    }, [auth,loading])

    const keyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {
            socket!.send(message)
            setMessage('')
        }
    }
    const textareaHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setMessage(event.currentTarget.value);
    }
    const sendHandler = () => {
        socket && socket.send(message);
        setMessage('')
    }

    const instance = axios.create({
        baseURL: 'https://social-network.samuraijs.com/api/1.0/',
        withCredentials: true,
        headers: {
            'API-KEY': '2676877b-be72-48e3-92f4-61113ae50143', // myTestAccount
        },
    })

    const loginAppHandler = () => {
        instance.post('auth/login', {
            email: 'web.refaq@gmail.com',
            password: 'password',
            rememberMe: true,
            captcha: null
        })
            .finally(()=>setLoading(true))
            .then((response) => response.data.resultCode === 0 ? setAuth(true) : '',
                (e) => console.log(e)
            )
            .finally(()=>setLoading(false))
    }

    return (
        <Container maxWidth="md" sx={{padding: 5}}>
            <Paper elevation={3}>
                <Box sx={{textAlign: 'center', padding: 2}}>
                    <h2>A simple Chat based on RCA using WebSocket</h2>
                    <p>
                        To join the chat you should get registered <a href="https://social-network.samuraijs.com/"
                                                                      rel="noreferrer" target="_blank"> here</a> (it's
                        important to be
                        sing in social-network.samuraijs.com) <br/>or use common test
                        account credentials: Email: web.refaq@gmail.com | Password: password<br/>
                        {!auth && <>or just click Authorize button</>}
                    </p>
                    {!auth &&  <div><Button onClick={loginAppHandler} color="warning" variant="contained">Authorize</Button></div>}
                    {loading &&  <CircularProgress />}
                </Box>
                <Grid container spacing={2}
                      sx={{padding: 4, justifyContent: 'center', wordBreak: 'break-word'}}>
                    <Paper elevation={0} sx={{padding: 3}}>
                        <Box sx={{paddingTop: 1, alignItems: 'center',}}>
                            <Box sx={{marginBottom: 2}}>
                                <TextField
                                    fullWidth
                                    id="outlined-textarea"
                                    label="Message"
                                    placeholder="Type your message"
                                    onChange={textareaHandler} onKeyPress={keyPressHandler}
                                    value={message}
                                />
                            </Box>
                            <Box sx={{marginBottom: 2, display: 'flex', justifyContent: 'end', alignItems: 'center', gap: 1}}>
                                <div>press Enter or</div>
                                <Button onClick={sendHandler} size="large" variant="contained">
                                    Send message
                                </Button>
                            </Box>
                        </Box>
                        <Box ref={boxRef}
                             sx={{height: 350, overflowY: 'scroll', marginTop: 2, justifyContent: 'center',}}>
                            {messages &&
                                messages.map((msg, index) => (
                                    <Box key={index} sx={{
                                        display: 'flex',  margin: '10px 0'
                                    }}>
                                        <Box sx={{marginRight: 2}}>
                                            <img alt="" style={{width: '30px'}}
                                                 src={msg.photo ? msg.photo : noPhoto}/>
                                        </Box>
                                        <Box>
                                            <Box sx={{fontSize: 9}}>{msg.userName}</Box>
                                            <Box>{msg.message}</Box>
                                        </Box>
                                    </Box>
                                ))}
                            {!auth &&
                                <>
                                    <Box sx={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
                                        <Box sx={{color: 'red', textAlign: 'center', padding: '2rem'}}>You are not
                                            authorize.</Box>
                                    </Box>
                                </>
                            }
                            {loading &&  <CircularProgress />}
                        </Box>
                    </Paper>
                </Grid>
            </Paper>
        </Container>
    );
}

export default App;
