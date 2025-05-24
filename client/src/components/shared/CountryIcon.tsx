"use client"
import { formattedCountries } from '@/lib/countries';


type Props = {
    countryCode: string | null
    className?: string
}

export default function  CountyIcon({ countryCode, className}: Props) {
    return (
        <img  src={
            countryCode? `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png` :'/Unknown_Flag.jpg'
        }
        alt="flag" className={className}
        title={formattedCountries.find((c) => c.code === countryCode)?.name ?? "Unknown Country"}/>
    )
}