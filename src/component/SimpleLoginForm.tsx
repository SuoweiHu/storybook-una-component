import React from 'react';
import '../css/tw-global.css';





export const SimpleLoginForm: React.FunctionComponent = () => {

    const [password, setPassword] = React.useState('');
    const [password_label, setPassword_label] = React.useState('Please choose a password.');
    const [isPasswordValid, setIsPasswordValid] = React.useState(false);

    async function checkPassword(password: string) {
        // Simulate an API call to check the password
        const isValid = await new Promise((resolve) => {
            setTimeout(() => {
                resolve(password.length >= 8);
            }, 500);
        });
        const isEmpty = await new Promise((resolve) => {
            setTimeout(() => {
                resolve(password.length == 0);
            }, 500);
        });
        if (isValid) {
            setIsPasswordValid(true);
            setPassword_label('Password is valid.');
        }
        else if (isEmpty) {
            setIsPasswordValid(false);
            setPassword_label('Password cannot be empty.');
        } else {
            setIsPasswordValid(false);
            setPassword_label('Password must be at least 8 characters long.');
        }
    }

    return (
        <div className="w-full max-w-md">
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                        Username
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input className={`shadow appearance-none border ${isPasswordValid ? 'border-green-600' : 'border-red-500'} rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`} id="password" type="password" placeholder="******************" value={password} onChange={(e) => { setPassword(e.target.value); checkPassword(e.target.value); }} />
                    <p className={`text-xs italic ${isPasswordValid ? 'text-green-600' : 'text-red-500'}`}>{password_label}</p>
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                        Sign In
                    </button>
                    <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
                        Forgot Password?
                    </a>
                </div>
            </form>
            <p className="text-center text-gray-500 text-xs">
                &copy;2020 Acme Corp. All rights reserved.
            </p>
        </div>
    );
};