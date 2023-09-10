// this file is for authorization of users
// the supabase mecaniz is that it store the loged-in-user-information in the local-storage
import supabase, { supabaseUrl } from "./supabase";

export async function signup({ fullName, email, password }) {// this function is for signing up the new users
    const { data, error } = await supabase.auth.signUp({
        email, password, options: { // this options is a optionall thing in supabase to give the new-created-user optainal-information
            data: {
                fullName,
                avatar: '',
            }
        }
    })

    if (error) {
        throw new Error(error.message)
    }
    console.log(data)
    return data
}

export async function login({ email, password }) { // this function is for sending the user email and password from the login-form(ui) to the supabase for login the user(the user who have a account previosly )
    let { data, error } = await supabase.auth.signInWithPassword({ // we get this code from supabase => API Doc => userManagement 
        email,
        password
    })

    if (error) {
        throw new Error(error.message)
    }

    return data

    // this data will return an object of 1.session and 2.user 
    // session: {access_token: 'eyJhbGciOiJIUzI1NiIsImtpZCI6InV0L3JNYnBtRTQ4N2JFaj…WQifQ.of50IiDvYdSh8caxH2wKLC4Ah2sD1pFu5-xjZ2-ClVw', token_type: 'bearer', expires_in: 3600, expires_at: 1693992789, refresh_token: 'xrmtKWYAeHBxGBlYlrRL1A', …}
    // user: {id: 'c119d42e-4e97-40b1-90c8-36264b91f295', aud: 'authenticated', role: 'authenticated', email: 'ashkanpc2003@gmail.com', email_confirmed_at: '2023-09-06T06:52:05.344542Z', …}



}

export async function getCurrentUser() { // this function is for getting user loged in when ever the user for ezaple "reload the page" or "come back 2 hours later" make him steel loged in

    // the session is the data coming from the login-function which is stored in the local-storage
    const { data: session } = await supabase.auth.getSession() // the getSession-func is a supabase-method to get the loged-in-user-informetion from the local-storage 

    if (!session.session) return null // if session is not exists inthe local-storage in means that there is not any user loged-in previosly

    const { data, error } = await supabase.auth.getUser() // we get this code from the supabase. the getUser-function is for getting the current-loged-in-user-information from the supabase 



    if (error) {
        throw new Error(error.message)
    }

    return data?.user // we use optional chaing for if the data exists(if there is a current-user-loged-in) return data.user
}

export async function logout() { // this function is for loging out the user
    const { error } = await supabase.auth.signOut() // we write this code from the supabase

    if (error) {
        throw new Error(error.message)
    }
}

export async function updateCurrentUser({ password, fullName, avatar }) { // this function is for updating user password or fullname and avatar

    // 1. update password or fullName // we can not update both of the in the same time(supabase-system)
    let updateDate;
    if (password) updateDate = { password } // if password was true(exists) => set the password like an obj in updateDate
    if (fullName) updateDate = { data: { fullName } } // if fullName was true(exists) => set the fullName like an obj in updateDate // (the supabase-system is that we stored the fullname in the data-obj so we cant pass fullname directully so we pass in to the data-obj and then pass in tnto updateDate)


    const { data, error } = await supabase.auth.updateUser(updateDate) // we get this code from supabase 

    if (error) {
        throw new Error(error.message)
    }
    if (!avatar) return data // if the user dosent want to uplaod an avatar(avatar == false) then return at this point beacuse we have done.

    //  if the user want to uplaod an avatar(avatar exists) then run the below code
    // 2. upload the avatar img
    const fileName = `avatar-${data.user.id}-${Math.random()}` // we need a unic-file-name for the avatar-img in the supabase
    const { error: storageError } = await supabase
        .storage
        .from("avatars")
        .upload(fileName, avatar)

    if (storageError) throw new Error(storageError.message)

    // 3. update avatar in the user
    const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
        data: {
            avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
            
        },
    })

    if (error2) throw new Error(error2.message)

    return updatedUser
}