/* eslint-disable no-unused-vars */
import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useSignup } from "./useSignup";

// this app Authentication system is that this app is not for the quests or normal-web-users.this app is for wild-osis-employees. so only this employes can singup new employes from the inside the app or check in or checkout the quests
// this app is deffernt from other apps.this is like admin-panell for word-osis-employess
// in other apps the user first must signup and they can login or logout
// in this app the employs that have singin-initialy they can signin the outher employess 



// Email regex: /\S+@\S+\.\S+/
//we activeted the conform-email from the supabase => Authentication => providers => email 
// you can use tempemail.com to get a temporary email to varify the email or you can use your own email
// so once the user signup, we send a eamil to its email-box to conform it to redirect to http://localhost:5173/dashboard
// you can set or change the redirect-settnig from  supabase => Authentication => URL Configuration

function SignupForm() {
  const { singup, isLoading } = useSignup();
  const { register, formState, getValues, handleSubmit, reset } = useForm(); // we used react-hook-form to manage out form
  const { errors } = formState;

  function onSubmit({ fullName, email, password }) {
    //destructure the data coming from the react-hook-from handleSubmit-function to {fullName, email, password} we need these to pass to signup-function//we dont need passwordConfirm// the data is the intire data coming from the inputs-value
    singup(
      { fullName, email, password }, // when the user submit the form then send these information to the signup-function
      {
        onSettled: () =>  reset, // when the work finished with success or error then reset the form with react-hook-form reset-function
      }
    );
  }
  // writing react-hook-form is like a following a recepy
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isLoading}
          {...register("fullName", { required: "this field is required" })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isLoading}
          {...register("email", {
            required: "this field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          disabled={isLoading}
          {...register("password", {
            required: "this field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimom of 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isLoading}
          {...register("passwordConfirm", {
            required: "this field is required",
            validate: (
              value // the value is the passwordConfirm and by getValues-function we access to all input-valus tha has registered and we acces to password-input-value by getValues().password
            ) => value === getValues().password || "Passwords need to match",
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" disabled={isLoading} onClick={reset}>
          Cancel
        </Button>
        
        <Button disabled={isLoading}>Create new user</Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
