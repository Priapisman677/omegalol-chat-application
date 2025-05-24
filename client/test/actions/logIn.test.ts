import { logIn } from '@/actions/user-actions/log-in';
import { signUp } from '@/actions/user-actions/sign-up';
import { prisma } from '@/lib/db';


const setMock = jest.fn()
let email = 'misankh@example.com'
let id = 'YYR2VQJ20'

jest.mock('nanoid', () => ({
    customAlphabet: () => () => id,
  }));

jest.mock('next/headers', (()=>{
    return {
        __esModule: true,
        cookies: ()=>{
            return {
                set: setMock,
            }
        }
    }
}))

beforeEach(async () => {
    try{
        await prisma.user.delete({
            where: {
                email
            }
        });
        
    }catch(e){
        console.log('Error at logIn.test.ts (deleteMany), please log the error manually',); 	
        
    }

	await signUp({
		username: 'john_doe',
		email,
		password: '12345678',
	});
});

test('should log in with the correct credentials', async () => {
    const result: LogInActionResponse = await logIn({
        email,
        password: '12345678',
    })

    expect(result).toEqual({
        success: true,
        msg: 'User logged in successfully',
        user: { username: 'john_doe', email, id: '#' + id, profilePicPath: null, country: null, gender:'unknown', bio: null },
    })
});

test('should set cookie upon successful log in', async () => {
    await logIn({
        email,
        password: '12345678',
    })

    expect(setMock).toHaveBeenCalledWith(
		'SERVER_TOKEN',
		expect.any(String),
		expect.objectContaining({ httpOnly: true,expires: expect.any(Date)})
	);

});

