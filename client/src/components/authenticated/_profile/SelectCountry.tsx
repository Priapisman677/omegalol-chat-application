// components/CountrySelect.tsx
'use client';

import { updateProfileField } from '@/actions/user-actions/update-profile-field';
import CountyIcon from '@/components/shared/CountryIcon';
import { useSession } from '@/context/session-context';
import { formattedCountries } from '@/lib/countries';
import { useState } from 'react';
import { SmallChangeButton } from './SmallChangeButton';
import toast from 'react-hot-toast';

//prettier-ignore
export function CountrySelect() {

    const {session} = useSession()

    const {countryCode: userCountryCode} = session!

	const [countryCode, setCountryCode] = useState(userCountryCode);
    const [modify, setModify] = useState<boolean>(false)

	const handleSelect = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCountryCode(e.target.value);
        setModify(false)
        const result = await updateProfileField({value: e.target.value, updateField: 'country'})

        if(!result.success){
            toast.error(result.msg)
            return
        }
        toast.success('Country updated')
    }
    

	return (
		<div className="relative flex items-center mt-1 text-white">
            {modify && (
				<div className="fixed inset-0 z-10" onClick={() => setModify(false)} />
			)}
            {/* Optional flag preview */}
            {!modify && (
                <div className="flex items-center gap-2 text-center hover:cursor-pointer" onClick={() => setModify(true)}>
                    <CountyIcon countryCode={countryCode || null} className='h-5 w-7'></CountyIcon>
                    <span className='text-sm underline'>
                        {formattedCountries.find( (c) => c.code === countryCode)?.name ?? "Unknown Country"}
                    </span>
                    <SmallChangeButton></SmallChangeButton>
                </div>
            )}
			{modify && <select className="bg-[#1a1a1a] p-2 rounded w-[200px] z-20 relative" value={countryCode || "Select a  country"} onChange={handleSelect} onClick={(e) => e.stopPropagation()}>
				<option value="">Select your country</option>
				{formattedCountries.map((c) => (
					<option key={c.code} value={c.code}> {c.name}</option>
				))}
			</select>}

		</div>
	);
}
