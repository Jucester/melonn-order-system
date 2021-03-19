import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import { withRouter } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

import clientAxios from "../../config/axios";

const Login = (props) => {

	const [auth, saveAuth] = useContext(AuthContext);

	const [credentials, setCredentials] = useState({});

  	const handleChange = e => {
		setCredentials({
			...credentials,
			[e.target.name] : e.target.value
 		})
	};

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			// Get data
			const response = await clientAxios.post('/users/login', credentials);
			
			console.log(response.data)
			// Auth user
			const { token } = response.data;
			localStorage.setItem('token', token);

			// Save in context
			saveAuth({
				token,
				auth: true,
				authenticatedUser: response.data.user
			})

			Swal.fire({
				text: 'You have logged in',
				icon: 'success',
			});

			// redirect
			props.history.push('/');

		} catch (error) {
			console.log(error);
			Swal.fire({
				type: 'error',
				icon: 'error',
				title: 'Error',
				text: error.response.data.message	
			})
		}

	}

  	return (
		<div className="login">
		<h2> Login </h2>

		<div className="contenedor-formulario">
			<form
				onSubmit={handleLogin}
			>
			<div className="campo">
				<label> Email </label>
				<input
				type="text"
				name="email"
				placeholder="Your email..."
				required
				onChange={handleChange}
				/>
			</div>

			<div className="campo">
				<label> Password </label>
				<input
				type="password"
				name="password"
				placeholder="Your password..."
				required
				onChange={handleChange}
				/>
			</div>

			<input
				type="submit"
				value="Sign Up"
				className="btn btn-verde btn-block"
			/>
			</form>
		</div>
		</div>
  	);
};

export default withRouter(Login);
