import Login from '@/app/(wall)/login/page';
import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom'
import user from '@testing-library/user-event'
import { logIn } from '@/actions/user-actions/log-in';

jest.mock('@/actions/user-actions/log-in', () => {
	return {
		__esModule: true,
		logIn: jest.fn(),
	};
});

const pushMock = jest.fn();

jest.mock('next/navigation', () => {
	return {
		__esModule: true,
		useRouter: () => {
			return {push: pushMock};
		},
	};
});

test('should render', async() => {
	render(<Login></Login>);

    
	const emailInput = screen.getByPlaceholderText('Email');
	const passwordInput = screen.getByPlaceholderText('Password');
    
	expect(emailInput).toBeInTheDocument();
	expect(passwordInput).toBeInTheDocument();
    
	(logIn as jest.Mock).mockResolvedValue({
        success: true,
		msg: 'User logged in successfully',
	});
    
    const button = screen.getByRole('button')
    
    await user.type(emailInput, 'noEditEmail@gmail')
    await user.type(passwordInput, '12345678')
    await user.click(button)
    
    expect(screen.getByText('Success')).toBeInTheDocument()
    expect(pushMock).toHaveBeenCalledWith('/chat')
});
