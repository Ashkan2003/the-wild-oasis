/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";

import { useForm } from "react-hook-form";
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId); // if there is editId = true , and if there is not any editId = false

  const { isCreating, createCabin } = useCreateCabin(); //this is a custpm-hook
  const { isEditing, editCabin } = useEditCabin(); // this is a custopm-hook

  const isWorking = isCreating || isEditing;

  const { register, handleSubmit, reset, getValues, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  }); // useForm is one of the react-hook-form. the register-property gets the form input-value and gather it into an object and pass it into handelSubmit-property

  const { errors } = formState;

  function onSubmit(data) {
    //its a object // the data is the enformation coming from the register on each input-field //for example {name: 'ashkan bibi', maxCapacity: '10', regularPrive: '499', discount: '2', description: 'ddd'}

    const image = typeof data.image === "string" ? data.image : data.image[0];
    if (isEditSession)
      editCabin(
        { newCabinData: { ...data, image }, id: editId },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.(); // if the user of this component dont pass the onCloseModal-prop, so it will be undfind so it will create an error so we use optanal-chaning "?" to if it was not undfind then run it
          },
        }
      );
    else
      createCabin(
        { ...data, image: image },
        {
          onSuccess: (data) => {
            reset();
            onCloseModal?.(); // if the user of this component dont pass the onCloseModal-prop, so it will be undfind so it will create an error so we use optanal-chaning "?" to if it was not undfind then run it
          },
        }
      ); // pass the data to mutate-func so it will pass it to the mutateFn// if the createCabin was succesfull then reset the form with reset-function from react-hook-form
  }

  // the structure of the register : {...register("the name of the row-item in supabase", { required: "this field is required", min:{somthing}, validate:{something} })}

  return (
    <Form onSubmit={handleSubmit(onSubmit)} type={onCloseModal ? "modal" : "regular"}>
      {/*we used onSubmit-event to submit the form.so when the form submited, pass out onSubmit-function to the handleSubmit(react-hook-form-hook) so it recive the data(inputs-value information Object) */}
      <FormRow label="Cabin name" error={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", { required: "this field is required" })}
        />
      </FormRow>
      <FormRow label="maximun capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "this field is required",
            min: { value: 1, message: "Capacity should be at least 1" },
          })}
        />
      </FormRow>
      <FormRow label="regular price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            required: "this field is required",
            min: { value: 1, message: "Capacity should be at least 1" },
          })}
        />
      </FormRow>
      <FormRow label="discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          defaultValue={0}
          {...register("discount", {
            required: "this field is required",
            validate: (
              value // validate is a property to specify our own special form-validate for example if (value <= regularPrice) was false show this message to error
            ) =>
              value <= getValues().regularPrice ||
              "Discount should be less than regular price",
          })}
        />
      </FormRow>
      <FormRow
        label="description for website"
        error={errors?.description?.message}
      >
        <Textarea
          type="number"
          id="description"
          disabled={isWorking}
          defaultValue=""
          {...register("description", { required: "this field is required" })}
        />
      </FormRow>
      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: isEditSession ? false : "this field is required",
          })}
        />
      </FormRow>
      <FormRow>
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          type="reset"
          onClick={() => onCloseModal?.()} // if the user of this component dont pass the onCloseModal-prop, so it will be undfind so it will create an error so we use optanal-chaning "?" to if it was not undfind then run it
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit cabin" : "Create new cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
