// import { useState } from "react";
import { useForm } from "react-hook-form";

// export default function TodoList() {
//   const [todo, setTodo] = useState("");
//   const onChange = (e: React.FormEvent<HTMLInputElement>) => {
//     setTodo(e.currentTarget.value);
//   };
//   const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     console.log(todo);
//   };
//   return (
//     <div>
//       <form onSubmit={onSubmit}>
//         <input onChange={onChange} value={todo} placeholder="write a to do" />
//         <button>Add</button>
//       </form>
//     </div>
//   );
// }

export default function TodoList() {
  const { register, handleSubmit, formState } = useForm();
  //   handleSubmit is used to validate input data
  const onValid = (data: any) => {
    console.log(data);
  };
  //   formState.errors returns what is wrong with the submitted data as 'type'
  console.log(formState.errors);
  return (
    <div>
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={handleSubmit(onValid)}
      >
        <input {...register("email", { required: true })} placeholder="Email" />
        <input
          {...register("firstName", { required: true })}
          placeholder="First Name"
        />
        <input
          {...register("lastName", { required: true })}
          placeholder="Last Name"
        />
        <input
          {...register("username", { required: true, minLength: 10 })}
          placeholder="Username"
        />
        <input
          {...register("password", { required: true, minLength: 5 })}
          placeholder="Password"
        />
        <input
          {...register("password1", {
            required: "Password is required",
            minLength: {
              value: 5,
              message: "Your password is too short.",
            },
          })}
          placeholder="Password1"
        />
        <button>Add</button>
      </form>
    </div>
  );
}
