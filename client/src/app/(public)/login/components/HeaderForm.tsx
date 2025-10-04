'use client'
interface HeaderFormProps {
    title: string,
    description: string
}

export default function HeaderForm({ title, description }: HeaderFormProps) {
    return (
        <>
            <div className="mx-auto max-w-full w-full text-center text-black">
                <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
                <p className="mt-4">
                    {description}
                </p>
            </div>

        </>
    )
}