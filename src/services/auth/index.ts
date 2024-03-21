import instance from "@/lib/axios/instance";

const authServices = {
  SignUp: (data: any) => instance.post('/auth/signup', data),
}

export default authServices