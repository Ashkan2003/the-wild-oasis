import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout as logoutApi } from "../../services/apiAuth"
import { useNavigate } from "react-router-dom";


export function useLogout() {
    // the logoutApi-function will remove the user-login-information like session from the supabase-catch
    // and the queryClient.removeQueries() will remove the user-login-information like session from the react-query-catch
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const { mutate: logout, isLoading } = useMutation({
        mutationFn: logoutApi,
        onSuccess: () => {
            queryClient.removeQueries();
            navigate('/login', { replace: true })
        }

    })

    return { logout, isLoading }
}