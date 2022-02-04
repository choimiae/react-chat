import * as StompJs from '@stomp/stompjs';
import React, {useEffect, useState, useRef} from "react";
import {useNavigate, useLocation} from 'react-router-dom';
import axios from "axios";
import {user} from "./user";

function ChatView() {
    const location = useLocation();
    const [enter, setEnter] = useState("");
    const [roomId, setRoomId] = useState(location.pathname.split("/")[2]);
    const [roomName, setRoomName] = useState("");
    const [msg, setMsg] = useState("");
    const inputRef =  useRef({});
    const client = useRef({});
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        user();
        axios({
            method: "get",
            url: "/chat/room/"+roomId,
        }).then(response => {
            setRoomName(response.data.name);
        });
        connect();

        return () => disconnect();
    }, [1]);

    // 채팅 업데이트에 맞게 스크롤 맨밑으로 이동
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "auto" });
    }, [enter])

    // 소켓 연결
    const connect = () => {
        client.current = new StompJs.Client({
            //brokerURL: 'ws://125.179.146.62:8080/jdh-stomp',
            //brokerURL: 'ws://192.168.50.59:8080/jdh-stomp',
            brokerURL: 'ws://localhost:8080/jdh-stomp',
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            connectHeaders: {
                Authorization : user().token
            },
            onConnect: (frame) => {
                publish("ENTER", "");
                subscribe();
            },
            onStompError: (frame) => {
                console.error(frame);
            }
        });
        client.current.activate();
    };

    // 소켓 연결 끊기
    const disconnect = () => {
        console.log(21211)
        client.current.deactivate();
    };

    const subscribe = () => {
        client.current.subscribe("/sub/chat/room/"+roomId, (data) => {
            setEnter((prevEnter) => [...prevEnter, JSON.parse(data.body)]);
        });
    };

    const publish = (type, msg) => {
        if (!client.current.connected) return;
        client.current.publish({
            destination: "/pub/chat/message",
            body: JSON.stringify({
                "roomId": roomId,
                "type": type,
                "message": msg
            }),
            headers: {
                Authorization : user().token
            }
        });
    };

    // 메세지 저장
    const saveMsg = (e) => {
        setMsg(e.target.value);
    }

    // 메시지 보내기
    const submit = (e => {
        e.preventDefault();
        if(msg === "" || msg == null) {
            inputRef.current["msg"].focus();
            return;
        }

        publish("TALK", msg);

        // value 초기화
        setMsg("");
        inputRef.current["msg"].focus();
    });

    // 목록으로 돌아가기
    const goList = () => {
        disconnect();
        navigate("/list");
    }

    return (
        <section className="container">
            <header className="header flex-box flex-ver-c">
                <button type="button" onClick={()=>{goList()}} className="button mr-15"><i className="fas fa-arrow-circle-left"></i></button>
                <h1 className="title">{roomName}</h1>
            </header>
            <section className="chat-view">
                {
                    enter && enter.map((item, index) => {
                        return (
                            <div className={item.type !== "TALK" ? "chat-item view-enter" : "chat-item view-talk"} key={index} ref={scrollRef}>
                                {
                                    item.type !== "TALK" ? "" : <div className="icon"><i className="fab fa-jenkins" aria-hidden="true"></i></div>
                                }
                                <div className="item-box">
                                    {item.type !== "TALK" ? "" : <div className="title">{item.sender}</div>}
                                    <div className="talk">{item.message}</div>
                                    {item.type !== "TALK" ? "" : <div className="date">{item.regDt.substr(0,16)}</div>}
                                </div>
                            </div>
                        )
                    })
                }
            </section>
            <div className="send-box">
                <input type="text" className="form-control message" onChange={e => saveMsg(e)} onKeyUp={e=> {if(e.keyCode === 13) submit(e)}} value={msg} placeholder="메세지를 입력하세요." ref={el => inputRef.current["msg"] = el} />
                <button type="submit" onClick={e => submit(e)} title="메세지 보내기" className="button">
                    <i className="fas fa-paper-plane"></i>
                </button>
            </div>
        </section>
    )
}

export default ChatView