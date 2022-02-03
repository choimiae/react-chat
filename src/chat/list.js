import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {user} from "./user";


/*"proxy": "http://192.168.50.59:8080"*/
/*"proxy": "http://125.179.146.62:8080*/

function ChatList() {
    const [chatList, setChatList] = useState([]);
    const [roomName, setRoomName] = useState("");
    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    // 채팅방 목록 조회
    useEffect( () => {
        user();

        axios({
            method: "get",
            url: "/chat/rooms"
        }).then(response => {
            setChatList(response.data);
        });

    }, [1]);

    // 채팅방 열기
    const handleRegOpen = () => {
        setRoomName("");
        setOpen(true);
    }

    // 채팅방 닫기
    const handleRegClose = () => {
        setOpen(false);
    }

    // 채팅방 생성
    const saveRoom = () => {
        if(roomName === "" || roomName == null) {
            alert("채팅방명을 입력해 주세요.");
            return false;
        }
        axios({
            method: "post",
            url: "/chat/room?name="+roomName
        }).then(response => {
            handleRegClose();
            navigate("/view/"+response.data.roomId,{
                state:{
                    roomId:response.data.roomId,
                    name:response.data.name
                }
            });
        });
    }

    // 로그아웃
    const logout = () => {
        localStorage.clear();
        navigate("/");
    }

    return (
        <section className="container">
            <header className="header flex-box flex-ver-c flex-hor-between">
                <h1 className="title">목록</h1>
                <div>
                    <button type="button" title="채팅방 추가" className="button" onClick={()=>handleRegOpen()}>
                        <i className="fas fa-comment-dots"></i>
                    </button>
                    <button type="button" title="로그아웃" className="button ml-15" onClick={()=>logout()}>
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </div>
            </header>
            <section className="chat-list">
                {
                    chatList && chatList
                    .sort( (a, b) => new Date(b.regDt) - new Date(a.regDt) )
                    .map((item, index) => {
                        return (
                            <Link to={"/view/"+item.roomId} className="chat-item" key={index}>
                                <div className="icon"><i className="fab fa-jenkins"></i></div>
                                <div className="item-box">
                                    <div className="title">{item.name}</div>
                                    <div className="date">{item.regDt}</div>
                                </div>

                            </Link>
                        )
                    })
                }
            </section>
            <section className={open ? "modal active" : "modal"}>
                <div className="modal-box">
                    <div className="modal-header">채팅방 추가</div>
                    <div className="modal-body">
                        <input type="text" className="form-control" title="채팅방명 입력" placeholder="채팅방명을 입력하세요." onChange={e => {setRoomName(e.target.value);}} onKeyUp={e => {if(e.keyCode === 13) saveRoom();}} value={roomName}/>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" title="저장하기" onClick={() => {saveRoom();}}>
                            <i className="fas fa-save icon"></i>
                        </button>
                        <button type="button" className="btn btn-default" onClick={()=>handleRegClose()}>
                            <i className="fas fa-times icon"></i>
                        </button>
                    </div>
                </div>
            </section>
        </section>
    )
    
}

export default ChatList;