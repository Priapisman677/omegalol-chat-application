'use client';

import { _signUp, signUp } from '@/actions/user-actions/sign-up';
import { MinimalCenteredModal } from '@/components/shared/MotionModal';
import { useSession } from '@/context/session-context';
// import { useSession } from '@/context/session-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function SignUp() {
	const {setSession, session} = useSession()
    const [feedback, setFeedback] = useState<{success: boolean, msg: string} | null>(null)

	      //* TEMPORARY:
	const [showModal, setShowModal] = useState(true);

	const router = useRouter()

    const handleSubmit = async (e: React.FormEvent)=>{
        e.preventDefault()
        const formData = new FormData(e.currentTarget as HTMLFormElement)

        const username = (formData.get('username')) as string
        const email = (formData.get('email')) as string
        const password = (formData.get('password'))	as string
        const confirmPassword = (formData.get('confirmPassword'))

		//¡ just for dev
		// if(username === 'a'){

		// 	await _signUp({username: 'a', email: 'a', password: 'a'})
		// 	router.push('/chat')
		// 	return 
		// }

        if(!username || !email || !password || !confirmPassword){
            setFeedback({success: false, msg:'All fields are required'})
            return
        }

		if(password !== confirmPassword){
			setFeedback({success: false, msg:'Passwords do not match'})
			return
		}

        const response = await signUp({username, email, password}) as SignUpActionResponse

		if(!response.success){
			
			setFeedback({success: response.success, msg: response.msg})
			return
		}

		setFeedback({success: true, msg: 'User created successfully'})
		setSession(response.user)

		console.log({session});
		

		toast.success('User created successfully')

		router.push('/chat')
    }

	return (
		<>
			<form className="max-w-sm p-4 space-y-4" onSubmit={handleSubmit}>
				<h2 className="text-xl font-bold">Sign Up</h2>
				<input
					name="username"
					type="text"
					placeholder="Username"
					className="w-full px-4 py-2 border border-gray-600 rounded"
					// value={'noEditName'}
				/>
				<input
					name="email"
					type="email"
					placeholder="Email"
					className="w-full px-4 py-2 border border-gray-600 rounded"
					// value={'noEditEmail@gmail'}
				/>
				<input
					name="password"
					type="password"
					placeholder="Password"
					className="w-full px-4 py-2 border border-gray-600 rounded"
					// value={'12345678'}
				/>
				<input
					name="confirmPassword"
					type="password"
					placeholder="Confirm Password"
					className="w-full px-4 py-2 border border-gray-600 rounded"
					// value={'12345678'}
				/>
				<p className={`${feedback?.success ? 'text-green-500' : 'text-red-500'} text-center`}>
					{feedback?.msg}
				</p>
				<button
					type="submit"
					className="w-full py-2 text-white bg-orange-600 rounded hover:cursor-pointer hover:bg-orange-500"
				>
					{' '}
					Sign Up{' '}
				</button>
				<p className="text-center">
					Already have an account?{' '}
					<Link href="/login" className="text-blue-500 underline hover:text-blue-400">
						Log in here
					</Link>
				</p>
			</form>
			<MinimalCenteredModal show={showModal} onClose={() => setShowModal(false)} />
		</>
	);
}
