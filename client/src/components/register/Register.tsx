import React, { useState } from 'react';
import axios from 'axios';
import bcrypt from "bcryptjs-react";


export default function Register() {
    interface User {
        username: string,
        email: string,
        password: string,
        confirmpassword: string,
    }

    const [formError, setFormError] = useState<{ [key: string]: string }>({});
    const [user, setUser] = useState<User>({
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
    });
 

    const isEmptyValue = (value: string) => {
        return !value || value.trim().length < 1;
    }

    const validateEmail = (email: string) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const validateForm = () => {
        const error: { [key: string]: string } = {};

        if (isEmptyValue(user.username)) {
            error["username"] = "Tên người dùng không được để trống";
        }
        if (isEmptyValue(user.email)) {
            error["email"] = "Email không được để trống";
        } else {
            if (!validateEmail(user.email)) {
                error["email"] = "Email không hợp lệ";
            }
        }
        if (isEmptyValue(user.password)) {
            error["password"] = "Password không được để trống";
        }
        if (isEmptyValue(user.confirmpassword)) {
            error["confirmpassword"] = "Confirm password không được để trống";
        } else if (user.confirmpassword !== user.password) {
            error["confirmpassword"] = "Confirm password không trùng khớp";
        }

        setFormError(error);

        return Object.keys(error).length === 0;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        let name = e.target.name;
        setUser({ ...user, [name]: value });
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (validateForm()) {
            try {
                const response = await axios.get(`http://localhost:8080/users?email_like=${user.email}`);
                if (response.data.length === 0) {
                    // Email không tồn tại, tiến hành đăng ký
                    const hashedPassword = await bcrypt.hash(user.password, 10);
                    const newUser = { ...user, password: hashedPassword };
                    await axios.post('http://localhost:8080/users', newUser);
                    console.log("Đăng ký thành công");
                    
                } else {
                    console.log("Email đã được đăng ký");
                }
            } catch (error) {
                console.error("Lỗi trong quá trình đăng ký:", error);
            }
        } else {
            console.log("Form không hợp lệ");
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="">Tên người dùng</label>
                <input
                    placeholder='Nhập tên người dùng'
                    value={user.username}
                    name="username"
                    onChange={handleChange}
                    type="text"
                />
                {formError.username && <p>{formError.username}</p>}
                <br />
                <label htmlFor="">Email</label>
                <input
                    placeholder='Nhập email'
                    name="email"
                    onChange={handleChange}
                    value={user.email}
                    type="text"
                />
                {formError.email && <p>{formError.email}</p>}
                <br />
                <label htmlFor="">Mật khẩu</label>
                <input
                    placeholder='Nhập mật khẩu'
                    onChange={handleChange}
                    name="password"
                    value={user.password}
                    type="password"
                />
                {formError.password && <p>{formError.password}</p>}
                <br />
                <label htmlFor="">Xác nhận mật khẩu</label>
                <input
                    placeholder='Nhập lại mật khẩu'
                    onChange={handleChange}
                    name="confirmpassword"
                    value={user.confirmpassword}
                    type="password"
                />
                {formError.confirmpassword && <p>{formError.confirmpassword}</p>}
                <br />
                <button type="submit">Đăng ký</button>
            </form>
        </div>
    )
}
