/* eslint-disable no-unused-vars */
// note that for all read,delete,update,create (crud) you need RLS-policies-Authenication // go to supabase.com > Authentication > Policies > and create new Policies 

import supabase, { supabaseUrl } from "./supabase";

export async function getCabins() {// this function is for getting cabins-table from supabase// it return a array of obj

    //we write this code from the supabase-account > api-Doc > cabins > read All rows
    const { data, error } = await supabase
        .from('cabins')
        .select('*') // with the * we get all the rows

    if (error) {
        console.error("error");
        throw new Error("Cabins coud not be loaded")
    }

    return data
}

export async function createEditCabin(newCabin, id) {// the id is an option that when ever it has a value(true) it means that we want to edit-cabin and when ever it has not value(undefind) so we want to create-cabin //to do not write code twise we combine edit-cabin and create-cabin   // this function will create or edit a new row(cabin-ditals) to the cabin-table// the newCabin is an object with the input-values ricived from the react-query and react-hook-form

    // if hasImagePath == true => we want to edit-cabin
    // if hasImagePath == false => we want to create-cabin
    const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl); 

    const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll("/", ""); // for preventing many errrors the image-name mus be unic. so the image-name is combining of a random-id + imageName In cabin + replace All the "/" to ""(becuse if the image-name contins "/" then supabase see "/" then will create a nested file so we prevent that )

    const imagePath = hasImagePath ? newCabin.image : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`// when we create a new cabin we want to enset the image but if we want to edit the cabin wa want the cabin-image be the same as before its edit //the image path in the cabin-table will be the bucket-URl than the image stored in. so this imag-path is bucketURl + imageName. for ezample //https://kqelachrkqvlwtjprrgu.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg


    // 1. Create/Edit cabin cabin
    let query = supabase.from("cabins");

    // A) Create
    if (!id) query = query.insert([{ ...newCabin, image: imagePath }])

    // B) Edit // the edit needs filltering so it needs id
    if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id)

    const { data, error } = await query
        .select()
        .single()

    if (error) {
        console.error(error);
        throw new Error("Cabins coud not be created")
    }

    // 2. upload image // this is a recepy from supabase.com > documatation > javaScript > storage > uploadFile
    if(hasImagePath) return data;

    const { error: storageError } = await supabase
        .storage
        .from('cabin-images')
        .upload(imageName, newCabin.image)

    // 3. Dlete the cabin IF threre was an error uploading image
    if (storageError) {
        await supabase
            .from('cabins')
            .delete()
            .eq('id', data.id)  // pass the id that you want to delete its obj

        console.error(storageError);
        throw new Error("Cabin image coud not be uploaded and the cabin was not created ")
    }
    return data
}

export async function deleteCabin(id) { // this function will delete a row from the cabin-table by its id

    const { data, error } = await supabase
        .from('cabins')
        .delete()
        .eq('id', id)  // pass the id that you want to delete its obj

    if (error) {
        console.error(error);
        throw new Error("Cabins coud not be deleted")
    }

    return data
}