import React, {useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

function Login() {
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const inputRef =  useRef({});
    const navigate = useNavigate();

    const login = () => {
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

        axios({
            method: "POST",
            url: "/login/authentication",
            data: {
                userId: id,
                userPw: pw
            }
        }).then(response => {
            if (response.data.result === "success") {
                let data = {
                    "token": response.data.data.accessToken,
                    "userId": response.data.data.data.userId,
                    "nickname":response.data.data.data.nickname
                }
                localStorage.setItem("user", JSON.stringify(data));
                navigate("/list");
            } else {
                alert("로그인에 실패했습니다.");
            }
        });
    }

    return(
        <section className="join-container">
            <div className="join-box">
                <div className="join-item">
                    <h1 className="title"><i className="fas fa-door-open icon"></i> 톡톡 <span className="desc">로그인</span></h1>
                    <div className="mb-5">
                        <input type="text" className="form-control" title="아이디 입력" placeholder="아이디" onChange={e => (setId(e.target.value))} ref={el => inputRef.current["id"] = el} value={id}/>
                    </div>
                    <div className="mb-5">
                        <input type="password" className="form-control" title="비밀번호 입력" placeholder="비밀번호" onChange={e => (setPw(e.target.value))} ref={el => inputRef.current["pw"] = el} value={pw} onKeyUp={e=> {if(e.keyCode === 13) login(e)}}/>
                    </div>
                    <div className="mt-15">
                        <button type="button" className="btn btn-primary2 width-100" style={{marginLeft:0, marginRight:0}} onClick={()=>login()}>로그인하기</button>
                        <Link to="/join" className="btn btn-sub width-100 mt-5" style={{marginLeft:0, marginRight:0}}>가입하기</Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login