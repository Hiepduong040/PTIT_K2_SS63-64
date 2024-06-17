import React, { useState } from 'react';
import axios from 'axios';
import bcrypt from "bcryptjs-react";


export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [formError, setFormError] = useState<string>("");
    

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.get(`http://localhost:8080/users?email=${email}`);
            if (response.data.length === 1) {
                const user = response.data[0];
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    console.log("Đăng nhập thành công");
                    console.log("Thông tin người dùng:", user);
                    
                } else {
                    setFormError("Mật khẩu không đúng");
                }
            } else {
                setFormError("Email không tồn tại");
            }
        } catch (error) {
            console.error("Lỗi trong quá trình đăng nhập:", error);
            setFormError("Đã xảy ra lỗi trong quá trình đăng nhập");
        }
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <label htmlFor="email">Email</label>
                <input
                    placeholder='Nhập email'
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="text"
                    
                />
                <br />
                <label htmlFor="password">Mật khẩu</label>
                <input
                    placeholder='Nhập mật khẩu'
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    
                />
                <br />
                {formError && <p style={{ color: 'red' }}>{formError}</p>}
                <button type="submit">Đăng nhập</button>
            </form>
        </div>
    );
}
