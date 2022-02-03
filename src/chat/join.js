import React, {useState, useRef} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

function Join() {
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const [nickname, setNickname] = useState("");
    const inputRef =  useRef({});
    const navigate = useNavigate();

    // 회원가입
    const save = () => {
        // 필수값 입력
        if(id === "" || id == null) {
            alert("아이디를 입력해 주세요.");
            inputRef.current["id"].focus();
            return;
        }
        if(pw === "" || pw == null) {
            alert("비밀번호를 입력해 주세요.");
            inputRef.current["pw"].focus();
            return;
        }
        if(nickname === "" || nickname == null) {
            alert("닉네임을 입력해 주세요.");
            inputRef.current["nickname"].focus();
            return;
        }
        
        // 회원가입 정보 전송
        axios({
            method: "POST",
            url: "/user/join",
            data: {
                userId: id,
                userPw: pw,
                nickname:nickname,
                salt : null
            }
        }).then(response => {
            if(response.data.result === "success") {
                alert("회원가입이 되었습니다.");
                navigate("/");
            } else {
                alert(response.data.msg);
                inputRef.current["id"].focus();
            }
        });
    }

    return(
        <section className="join-container">
            <div className="join-box">
                <div className="join-item">
                    <h1 className="title"><i className="fas fa-door-open icon"></i> 톡톡 <span className="desc">회원가입</span></h1>
                    <div className="mb-5">
                        <input type="text" className="form-control" title="아이디 입력" placeholder="아이디" onChange={e => (setId(e.target.value))} ref={el => inputRef.current["id"] = el} value={id}/>
                    </div>
                    <div className="mb-5">
                        <input type="password" className="form-control" title="비밀번호 입력" placeholder="비밀번호" onChange={e => (setPw(e.target.value))} ref={el => inputRef.current["pw"] = el} value={pw}/>
                    </div>
                    <div className="mb-5">
                        <input type="text" className="form-control" title="닉네임 입력" placeholder="닉네임" onChange={e => (setNickname(e.target.value))} ref={el => inputRef.current["nickname"] = el} value={nickname} onKeyUp={e=> {if(e.keyCode === 13) save(e)}}/>
                    </div>
                    <div className="mt-15">
                        <button type="button" className="btn btn-primary2 width-100" style={{marginLeft:0, marginRight:0}} onClick={() => save()}>가입하기</button>
                        <Link to="/" className="btn btn-sub width-100 mt-5" style={{marginLeft:0, marginRight:0}}>돌아가기</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Join