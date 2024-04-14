/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"

export const useDebounce = (value) => {
    const [valueDebounce, setValueDebounce] = useState('')
    useEffect(() => {
        const handle = setTimeout(() => {
            setValueDebounce(value)
        })
        return () => {
            clearTimeout(handle)
        }
    }, [value])
    return valueDebounce
}