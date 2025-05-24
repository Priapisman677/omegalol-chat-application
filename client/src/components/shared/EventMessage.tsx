"use client"

export function  EventMessage({message}: {message: EventMessage}) {

    const colors: Record<string, string> = {
        'red': 'text-red-700',
        'gray': 'text-gray-400',
        'green': 'text-green-400',
    };

    const color = colors[message.username || 'gray']
    return (
        <div  className={`${color} text-center  text-sm  my-2 thin-border-top `}>
            <span>{new Date(message.timeStamp).toLocaleTimeString()} – {message.textContent}</span>
        </div>
    );
}