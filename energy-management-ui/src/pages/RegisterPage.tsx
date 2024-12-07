import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {AppRoutes} from "../utils/constants.ts";
import {SubmitHandler, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {MdDone, MdErrorOutline} from "react-icons/md";
import {useRegisterMutation} from "../redux/api.ts";
import {useDispatch} from "react-redux";
import {startSession} from "@/redux/slices";
import {toast} from "react-hot-toast";
import {errorToastOptions} from "../utils/toast.tsx";
import {AuthenticationResponse, UserRole} from "../models/entities.ts";
import {Response} from "../models/transfer.ts";
import {Button, ButtonType, InputField, Stepper} from "../components";
import illustration from "../assets/register_illustration.png";
import {extractErrorMessage} from "../utils/errors-helper.ts";

type RegisterUser = {
   username: string;
   password: string;
   confirmPassword: string;
   email: string;
   role: UserRole;
}

export default function RegisterPage() {

   const firstStepSchema = z.object({
      username: z.string({required_error: "Field is required"}).refine(data => data.trim() !== "", {message: "Username can not be empty"}),
      email: z.string({required_error: "Field is required"}).email({message: "Your email is not valid, try again"}),
   });

   const secondStepSchema = z.object({
      password: z.string({required_error: "Field is required"})
         .refine(password => password.trim() !== ""
               && passwordRequirements.minCharacters
               && passwordRequirements.specialCharacter,
            {message: "Password is invalid"}),
      confirmPassword: z.string({required_error: "Field is required"}),
   }).refine(({password, confirmPassword}) => password === confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
   });

   type FirstStepFields = z.infer<typeof firstStepSchema>;
   type SecondStepFields = z.infer<typeof secondStepSchema>;

   const dispatch = useDispatch();
   const [register] = useRegisterMutation();
   const navigate = useNavigate();
   const [currentStep, setCurrentStep] = useState<number>(0);
   const [registerData, setRegisterData] = useState<RegisterUser>({
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      role: UserRole.USER,
   });
   const [passwordRequirements, setPasswordRequirements] = useState({
      minCharacters: false,
      specialCharacter: false,
   })

   const {
      register: registerFirstForm,
      handleSubmit: handleSubmitFirstForm,
      // setError: setErrorFirstForm,
      formState: {errors: firstFormErrors},
   } = useForm<FirstStepFields>({
      resolver: zodResolver(firstStepSchema),
   });

   const {
      register: registerSecondForm,
      handleSubmit: handleSubmitSecondForm,
      // setError: setErrorSecondForm,
      formState: {errors: secondFormErrors, isSubmitting}
   } = useForm<SecondStepFields>({
      resolver: zodResolver(secondStepSchema),
   });

   const redirectToLogin = () => {
      navigate(AppRoutes.LOGIN);
   }

   const onSubmitStep: SubmitHandler<FirstStepFields | SecondStepFields> = (data) => {
      setRegisterData({...registerData, ...data});
      setCurrentStep(currentStep + 1);
   }

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const onSubmit: SubmitHandler<FirstStepFields | SecondStepFields | FirstStepFields & SecondStepFields> = (__) => {
      register({...registerData, deviceIds: []}).unwrap()
         .then((response: Response<AuthenticationResponse>) => {
            dispatch(startSession(response.payload));
            navigate(AppRoutes.HOME);
         })
         .catch((response: Response<AuthenticationResponse>) => {
            toast.error(extractErrorMessage(response.errors), errorToastOptions())
         });
   }

   return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-background-color p-5 md:p-0 md:px-6">
         {/* Card */}
         <div
            className="md:w-full md:h-5/6 xl:w-5/6 xl:h-5/6 md:bg-background-accent w-full h-full flex justify-center items-center bg-transparent rounded-xl drop-shadow-lg transition-all duration-100 ease-in-out">
            {/* Form */}
            <div className="h-full md:w-4/5 lg:w-1/2 w-full lg:px-12 lg:py-2 md:px-8 md:py-4 p-3 flex flex-col justify-around">
               <Stepper steps={2} currentStep={currentStep} stepsDirection="row"/>

               {/* Header */}
               <div className="text-background-reverse text-4xl text-center my-2">
                  {currentStep === 0 && <span>Sign up for a new account</span>}
                  {currentStep === 1 && <span>One last step</span>}
                  {currentStep > 1 && <span>You're all set!</span>}
               </div>

               {/* Inputs */}
               {currentStep === 0 &&
                  (<form className="flex flex-col gap-6 animate-fadeIn" id="step1">
                     <InputField label="Username" type="text" name="username" registerFn={registerFirstForm} errorLabel={firstFormErrors.username?.message}/>
                     <InputField label="Email" type="email" name="email" registerFn={registerFirstForm} errorLabel={firstFormErrors.email?.message}/>
                  </form>)
               }
               {currentStep === 1 &&
                  (<form className="flex flex-col gap-6 animate-fadeIn" id="step2">
                     <InputField label="Password" type="password" name="password" registerFn={registerSecondForm}
                                 errorLabel={secondFormErrors.password?.message}
                                 onChange={(event) => {
                                    const password = event.target.value;
                                    const containsSpecialChar = (ch: string) =>
                                       /[`!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?~ ]/.test(ch);
                                    setPasswordRequirements({minCharacters: password.length >= 8, specialCharacter: containsSpecialChar(password)});
                                 }}
                     />
                     <InputField label="Confirm password" type="password" name="confirmPassword" registerFn={registerSecondForm}
                                 errorLabel={secondFormErrors.confirmPassword?.message}/>
                     <ul className="text-background-reverse">
                        <span className="font-bold">Password must:</span>
                        <li className="flex flex-row items-center justify-start gap-2">- be at least 8 characters
                           <span className="inline-block">
                              {passwordRequirements.minCharacters ?
                                 <MdDone size={20} className="text-green-400"/> :
                                 <MdErrorOutline size={20} className="text-red-400"/>
                              }
                           </span>
                        </li>
                        <li className="flex flex-row items-center justify-start gap-2">- have at least one special character
                           <span className="inline-block">
                              {passwordRequirements.specialCharacter ?
                                 <MdDone size={20} className="text-green-400"/> :
                                 <MdErrorOutline size={20} className="text-red-400"/>}
                           </span>
                        </li>
                     </ul>
                  </form>)
               }

               {/* Buttons */}
               <div className="flex flex-col gap-2">
                  {currentStep === 0 &&
                     (<>
                        <Button label="Next" formId="step1" type="submit" onClick={handleSubmitFirstForm(onSubmitStep)}/>
                        <Button onClick={redirectToLogin} label="Already a member? Sign in" buttonType={ButtonType.TERTIARY}
                                additionalStyles={"w-full"}/>
                     </>)
                  }
                  {currentStep === 1 &&
                     (<>
                        <Button label="Next" formId="step2" type="submit" onClick={handleSubmitSecondForm(onSubmitStep)}/>
                        <Button label="Back" buttonType={ButtonType.TERTIARY} onClick={() => setCurrentStep(currentStep - 1)}/>
                     </>)
                  }
                  {currentStep === 2 &&
                      <>
                          <Button label="Register" type="submit" disabled={isSubmitting} onClick={handleSubmitSecondForm(onSubmit)}/>
                          <Button label="I want to check my details again" buttonType={ButtonType.TERTIARY}
                                  onClick={() => setCurrentStep(currentStep - 2)}/>
                      </>
                  }
               </div>
            </div>

            {/* Image container */}
            <div className="md:h-full md:w-1/2 rounded-xl sm:h-0 sm:w-0">
               <img src={illustration} className="object-cover md:h-full md:w-full rounded-r-xl sm:h-0 sm:w-0 hidden md:block" alt="ill"/>
            </div>
         </div>
      </div>
   )
}