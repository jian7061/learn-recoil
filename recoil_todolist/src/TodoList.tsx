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
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@naver.com$/,
              message: "Only naver.com emails allowed",
            },
          })}
          placeholder="Email"
        />
        <span>{formState.errors?.email?.message}</span>
        <input
          {...register("firstName", { required: true })}
          placeholder="First Name"
        />
        <span>{formState.errors?.firstName?.message}</span>

        <input
          {...register("lastName", { required: true })}
          placeholder="Last Name"
        />
        <span>{formState.errors?.lastName?.message}</span>

        <input
          {...register("username", { required: true, minLength: 10 })}
          placeholder="Username"
        />
        <span>{formState.errors?.username?.message}</span>

        <input
          {...register("password", { required: true, minLength: 5 })}
          placeholder="Password"
        />
        <span>{formState.errors?.password?.message}</span>

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
        <span>{formState.errors?.password1?.message}</span>

        <button>Add</button>
      </form>
    </div>
  );
}
