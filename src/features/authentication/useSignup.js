import { useMutation } from "@tanstack/react-query";
import { signup as signupApi } from "../../services/apiAuth";
import { toast } from "react-hot-toast";

export function useSignup() {
    const {mutate: singup, isLoading} = useMutation({
        mutationFn: signupApi,
        onSuccess: (user) => {
            console.log(user)
            toast.success("Account succesfully created! Please verufy the new account from the user's email address.")
        }
    })

    return {singup, isLoading}
}