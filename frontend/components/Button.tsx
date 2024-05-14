'use client'

import { useRouter } from "next/navigation"

export function Button() {
    const { push } = useRouter()
    return <button onClick={() => push('/plant')
    }>test</button>
}