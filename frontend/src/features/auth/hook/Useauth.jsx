import { useDispatch } from "react-redux";
import { setError, setUser, setLoading } from "../state/auth.slice";
import { registerUser } from "../services/user.api";

const Useauth = () => {
  const dispatch = useDispatch();

  const handleRegister = async ({
    email,
    contact,
    fullname,
    password,
    role,
  }) => {
    const data = await registerUser({
      email,
      contact,
      fullname,
      password,
      role,
    });

    dispatch(setUser(data.user));
  };

  return handleRegister
};
