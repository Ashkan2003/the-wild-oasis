/* eslint-disable react/jsx-no-undef */
import { useState } from "react";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import Input from "../../ui/Input";
import FormRowVertical from "../../ui/FormRowVertical";
import { useLogin } from "./useLogin";
import SpinnerMini from "../../ui/SpinnerMini";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useLogin();

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return; // if the user doesnot passed the email and the password then do noting

    login( // the login-function is the react-query mutate-function so we can use functions like "onSuccess" or "onError" or "onSettled" by in. we can use these-finction by adding "," and writing a second-optional-argument that is a obj to write these-functions into it
      { email, password },
      { 
        onSettled: () => { // the onSettled-func is like onSuccess-func but its defference is that when ever the mutate-func succeded or failed(error) its code will run
          // when ever the user loged-in or failed to log-in, clear these states(clear inputs)
          setEmail("");
          setPassword("");
        },
      }
    );
  }
  return (
    <Form onSubmit={handleSubmit}>
      <FormRowVertical label="Email address">
        <Input
          type="email"
          id="email"
          autoComplete="username" // This makes this form better for password managers
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </FormRowVertical>

      <FormRowVertical label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button size="large" disabled={isLoading}>
          {!isLoading ? "Log in" : <SpinnerMini />}
        </Button>
      </FormRowVertical>
    </Form>
  );
}

export default LoginForm;
