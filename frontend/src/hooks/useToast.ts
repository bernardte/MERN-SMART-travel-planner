import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type instructionParameter = "success" | "error" | "info" | "warn";

const useToast = () => {
  const showToast = (instruction: instructionParameter, message: string) => {
    toast[instruction](message, {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Bounce,
    });
  };

  return { showToast };
};

export default useToast;
