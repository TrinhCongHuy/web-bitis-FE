import { useMutation } from "@tanstack/react-query"

export const UseMutationHook = (fnCallback) => {
    const mutation = useMutation({
        mutationFn: fnCallback
    })

    return mutation
}