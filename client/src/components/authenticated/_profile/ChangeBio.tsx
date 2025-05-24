'use client';

import { useState } from 'react';
import { useSession } from '@/context/session-context';
import { updateProfileField } from '@/actions/user-actions/update-profile-field';
import { SmallChangeButton } from './SmallChangeButton';
import toast from 'react-hot-toast';

//prettier-ignore
export function ModifyBio() {
	const { session } = useSession();
	const [bio, setBio] = useState(session?.bio || '');
	const [editing, setEditing] = useState(false);

    const [error, setError] = useState<string | null>(null)

	const handleBlur = async () => {
		setEditing(false);
		const result = await updateProfileField({ value: bio, updateField: 'bio' });
        setError(null)
        if (!result.success) {
            setError(result.msg);
            setBio(session?.bio || '');
            return;
        }
		toast.success('Bio updated')
        return;
	};

	return (
		<div className="w-full max-w-xl ml-8 text-white mt-14">
			<label className="block mb-1 text-sm text-[#888]">Bio</label>
			{editing ? (
				<textarea className="w-full p-2 rounded bg-[#1a1a1a] text-white border border-[#353538]"
				value={bio} onChange={(e) => setBio(e.target.value)} onBlur={handleBlur} autoFocus rows={3} />
			) : (
				<div onClick={() => setEditing(true)}>
					<div className="bg-[#1a1a1a] p-2 rounded hover:cursor-text border border-transparent hover:border-[#353538] text-sm text-[#ccc] min-h-[72px]" >
						{bio.trim() || <span className="text-[#555]">Click to add a bio...</span>}
					</div>
					<div className='flex w-full justify-end mt-1'><SmallChangeButton></SmallChangeButton></div>
				</div>
			)}
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
		</div>
	);
}
